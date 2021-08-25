import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import CurrencyInputPanel from 'components/CurrencyInputPanel/index'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import { MinimalPositionCard } from 'components/PositionCard/PositionCard'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal/index'
import UnlockButton from 'components/UnlockButton/UnlockButton'
import { ROUTER_ADDRESS } from 'constants/swap'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useKardiachain from 'hooks/useKardiachain'
import { PairState } from 'hooks/usePairs'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import { useCallback, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, currencyEquals, ETHER, Percent, WETH } from 'defily-v2-sdk'
import { Plus } from 'react-feather'
import { Field } from 'store/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'store/mint/hooks'
import { useTransactionAdder } from 'store/transactions/hooks'
import { useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from 'store/user/hooks/index'
import { estimatedHelpers, sendTransactionToExtension, txDataHelpers } from 'utils/callHelpers'
import { getRouterContract } from 'utils/contractHelpers'
import currencyId from 'utils/currencyId'
import { calculateSlippageAmount } from 'utils/index'
import isZero from 'utils/isZero'
import maxAmountSpend from 'utils/maxAmountSpend'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import ConfirmAddModalBottom from 'views/AddLiquidity/ConfirmAddModalBottom'
import PoolPriceBar from 'views/AddLiquidity/PoolPriceBar'
import PercentPicker from 'components/PercentPicker/PercentPicker'

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}) {
  const { account, chainId, library } = useKardiachain()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId]))),
  )

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [deadline] = useUserDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const usdcValues = {
    [Field.CURRENCY_A]: useUSDCValue(parsedAmounts[Field.CURRENCY_A]),
    [Field.CURRENCY_B]: useUSDCValue(parsedAmounts[Field.CURRENCY_B]),
  }

  // get the max amounts user can add
  const maxAmounts = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    }
  }, {})

  // const atMaxAmounts = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
  //   return {
  //     ...accumulator,
  //     [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
  //   }
  // }, {})

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let method
    let args
    let value
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      method = 'addLiquidityKAI'
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        `0x${(Math.floor(new Date().getTime() / 1000) + deadline).toString(16)}`,
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      method = 'addLiquidity'
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        `0x${(Math.floor(new Date().getTime() / 1000) + deadline).toString(16)}`,
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimatedHelpers(router, method, args)
      .then((estimatedGasLimit) =>
        sendTransactionToExtension(account, txDataHelpers(router, method, args), ROUTER_ADDRESS, {
          ...(value && !isZero(value) ? { value } : {}),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          })

          setTxHash(response.transactionHash)
        }),
      )
      .catch((err) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <div className="flex items-center">
        <p className="text-4xl">{`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}</p>
        <DoubleCurrencyLogo
          currency0={currencies[Field.CURRENCY_A]}
          currency1={currencies[Field.CURRENCY_B]}
          size={30}
        />
      </div>
    ) : (
      <div>
        <div className="flex items-center">
          <p className="text-4xl font-bold">{liquidityMinted?.toSignificant(6)}</p>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </div>
        <div>
          <p className="text-xl my-2">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
          </p>
        </div>
        <p className="text-md italic mb-2">
          Output is estimated. If the price changes by more than {allowedSlippage / 100} your transaction will revert.
        </p>
      </div>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = useMemo(() => {
    const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ''
    const symbolA = currencies[Field.CURRENCY_A]?.symbol ?? ''
    const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
    const symbolB = currencies[Field.CURRENCY_B]?.symbol ?? ''
    return `Supplying ${amountA} ${symbolA} and ${amountB} ${symbolB}`
  }, [currencies, parsedAmounts])

  const handleCurrencyASelect = useCallback(
    (currencyA_) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA || 'KAI'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB],
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const handlePercentInput = useCallback(
    (percent) => {
      if (!currencyA) return
      if (percent.equalTo(new Percent('100'))) {
        onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
      } else {
        onFieldAInput(
          new CurrencyAmount(currencyA, percent.multiply(maxAmounts[Field.CURRENCY_A].raw).quotient).toExact(),
        )
      }
    },
    [currencyA, maxAmounts, onFieldAInput],
  )

  const handlePercentOutput = useCallback(
    (percent) => {
      if (!currencyB) return
      if (percent.equalTo(new Percent('100'))) {
        onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
      } else {
        onFieldBInput(
          new CurrencyAmount(currencyB, percent.multiply(maxAmounts[Field.CURRENCY_B].raw).quotient).toExact(),
        )
      }
    },
    [currencyB, maxAmounts, onFieldBInput],
  )

  return (
    <>
      <TransactionConfirmationModal
        open={showConfirm}
        title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />}
        pendingText={pendingText}
        currencyToAdd={pair?.liquidityToken}
      />
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader title="Add Liquidity" backTo="/liquidity" />
        <div>
          <Card color="primary" className="p-2 mb-4">
            <p>
              <strong>Tip:</strong> When you add liquidity, you will receive pool tokens representing your position.
              These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any
              time.
            </p>
          </Card>
          <div>
            {/*{noLiquidity && (*/}
            {/*  <div>*/}
            {/*    <div className="mb-2">*/}
            {/*      <div className="text-white">*/}
            {/*        <p className="font-bold">You are the first liquidity provider.</p>*/}
            {/*        <p>The ratio of tokens you add will set the price of this pool.</p>*/}
            {/*        <p>Once you are happy with the rate click supply to review.</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              // showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              onCurrencySelect={handleCurrencyASelect}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              fiatValue={usdcValues[Field.CURRENCY_A]}
              showCommonBases
            />
            <PercentPicker onChangePercentInput={handlePercentInput} />
            <Plus className="mx-auto text-white my-2" />
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              // showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              fiatValue={usdcValues[Field.CURRENCY_B]}
              showCommonBases
            />
            <PercentPicker onChangePercentInput={handlePercentOutput} />

            {currencies[Field.CURRENCY_A] &&
              currencies[Field.CURRENCY_B] &&
              pairState !== PairState.INVALID &&
              !noLiquidity && (
                <>
                  <Card className="bg-blue2 p-2 text-white mt-4">
                    <div>
                      <p className="text-white mb-2">
                        {noLiquidity ? 'Initial prices and pool share' : 'Prices and pool share'}
                      </p>
                    </div>{' '}
                    <div>
                      <PoolPriceBar
                        currencies={currencies}
                        poolTokenPercentage={poolTokenPercentage}
                        noLiquidity={noLiquidity}
                        price={price}
                      />
                    </div>
                  </Card>
                </>
              )}

            {!account ? (
              <UnlockButton />
            ) : (
              <div className="mt-4">
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <div className="flex justify-between mb-2">
                      {approvalA !== ApprovalState.APPROVED && (
                        <Button
                          style={{
                            width: approvalB !== ApprovalState.APPROVED ? '48%' : '100%',
                          }}
                          className="w-full"
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          isLoading={approvalA === ApprovalState.PENDING}
                        >
                          {approvalA === ApprovalState.PENDING
                            ? `Approving ${currencies[Field.CURRENCY_A]?.symbol}`
                            : `Approve ${currencies[Field.CURRENCY_A]?.symbol}`}
                        </Button>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <Button
                          style={{
                            width: approvalA !== ApprovalState.APPROVED ? '48%' : '100%',
                          }}
                          className="w-full"
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          isLoading={approvalB === ApprovalState.PENDING}
                        >
                          {approvalB === ApprovalState.PENDING
                            ? `Approving ${currencies[Field.CURRENCY_B]?.symbol}`
                            : `Approve ${currencies[Field.CURRENCY_B]?.symbol}`}
                        </Button>
                      )}
                    </div>
                  )}
                <Button
                  className="w-full"
                  color={
                    !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                      ? 'danger'
                      : 'primary'
                  }
                  onClick={() => {
                    if (expertMode) {
                      onAdd()
                    } else {
                      setShowConfirm(true)
                    }
                  }}
                  disabled={
                    !isValid ||
                    approvalA !== ApprovalState.APPROVED ||
                    approvalB !== ApprovalState.APPROVED ||
                    noLiquidity
                  }
                >
                  {noLiquidity ? 'Invalid pair' : error ?? 'Supply'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <div className="mx-auto" style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </div>
      ) : null}
    </>
  )
}
