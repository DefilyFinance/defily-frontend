import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import { MinimalPositionCard } from 'components/PositionCard/PositionCard'
import Slider from 'components/Slider/Slider'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal/index'
import UnlockButton from 'components/UnlockButton/UnlockButton'
import { ROUTER_ADDRESS } from 'constants/swap'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo, useState } from 'react'
import { Currency, currencyEquals, ETHER, Percent, WETH } from 'defily-v2-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { ArrowDown, Plus } from 'react-feather'
import { Link } from 'react-router-dom'
import { Field } from 'store/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'store/burn/hooks'
import { useTransactionAdder } from 'store/transactions/hooks'
import { useUserDeadline, useUserSlippageTolerance } from 'store/user/hooks/index'
import { estimatedHelpers, sendTransactionToExtension, txDataHelpers } from 'utils/callHelpers'
import { getRouterContract } from 'utils/contractHelpers'
import currencyId from 'utils/currencyId'
import { calculateSlippageAmount } from 'utils/index'
import { wrappedCurrency } from 'utils/wrappedCurrency'

export default function RemoveLiquidity({
  history,
  match: {
    params: { currencyIdA, currencyIdB },
  },
}) {
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useKardiachain()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId],
  )

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState(false)
  const [showDetailed, setShowDetailed] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState('')
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // allowance handling
  const [signatureData, setSignatureData] = useState(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field, value) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const onLiquidityInput = useCallback((value) => onUserInput(Field.LIQUIDITY, value), [onUserInput])
  const onCurrencyAInput = useCallback((value) => onUserInput(Field.CURRENCY_A, value), [onUserInput])
  const onCurrencyBInput = useCallback((value) => onUserInput(Field.CURRENCY_B, value), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames
    let args
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityKAI', 'removeLiquidityKAISupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          `0x${(Math.floor(new Date().getTime() / 1000) + deadline).toString(16)}`,
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          `0x${(Math.floor(new Date().getTime() / 1000) + deadline).toString(16)}`,
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityKAIWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityKAIWithPermit', 'removeLiquidityKAIWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates = await Promise.all(
      methodNames.map((methodName) =>
        estimatedHelpers(router, methodName, args)
          .then((value) => BigNumber.from(value))
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          }),
      ),
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)

      await sendTransactionToExtension(account, txDataHelpers(router, methodName, args), ROUTER_ADDRESS)
        .then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setTxHash(response.transactionHash)
        })
        .catch((err: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(err)
        })
    }
  }

  function modalHeader() {
    return (
      <div>
        <div className="flex justify-between items-center text-2xl">
          <p className="font-bold">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</p>
          <div className="flex items-center">
            <CurrencyLogo currency={currencyA} />
            <p className="font-bold ml-2">{currencyA?.symbol}</p>
          </div>
        </div>
        <div>
          <Plus size={16} className="my-2" />
        </div>
        <div className="flex justify-between items-center text-2xl">
          <p className="font-bold">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</p>
          <div className="flex items-center">
            <CurrencyLogo currency={currencyB} size="24px" />
            <p className="font-bold ml-2">{currencyB?.symbol}</p>
          </div>
        </div>
        <p className="text-md mt-2 mb-4 italic">
          Output is estimated. If the price changes by more than {allowedSlippage / 100} your transaction will revert.
        </p>
      </div>
    )
  }

  function modalBottom() {
    return (
      <>
        <div className="flex justify-between items-center">
          {currencyA?.symbol ?? ''}/{currencyB?.symbol ?? ''} Burned
          <div className="flex justify-between items-center">
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <p className="font-bold text-xl">{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</p>
          </div>
        </div>
        {pair && (
          <div className="flex justify-between mt-2">
            <p>Price</p>
            <div className="font-bold">
              <p className="text-right">
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </p>
              <p className="text-right">
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </p>
            </div>
          </div>
        )}
        <Button
          className="w-full mt-4"
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
        >
          Confirm
        </Button>
      </>
    )
  }

  const pendingText = useMemo(() => {
    const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ''
    const symbolA = currencyA?.symbol ?? ''
    const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
    const symbolB = currencyB?.symbol ?? ''

    return `Removing ${amountA} ${symbolA} and ${amountB} ${symbolB}`
  }, [currencyA?.symbol, currencyB?.symbol, parsedAmounts])

  const liquidityPercentChangeCallback = useCallback(
    (value) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB))),
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        history.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
      } else {
        history.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, history],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        history.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
      } else {
        history.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, history],
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  return (
    <>
      <TransactionConfirmationModal
        open={showConfirm}
        title="You will receive"
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash || ''}
        content={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />}
        pendingText={pendingText}
      />
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader backTo="/liquidity" title="Remove Liquidity" />
        <Card color="primary" className="p-2">
          <p>
            <strong>Tip:</strong> Removing pool tokens converts your position back into underlying tokens at the current
            rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
          </p>
        </Card>
        <div className="flex items-center justify-between my-4">
          <p className="text-white">Remove Amount</p>
          <Button variant="text" scale="sm" onClick={() => setShowDetailed(!showDetailed)}>
            {showDetailed ? 'Simple' : 'Detailed'}
          </Button>
        </div>
        {!showDetailed && (
          <Card className="bg-blue2 p-2">
            <p className="text-6xl font-bold text-white" style={{ lineHeight: 1 }}>
              {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
            </p>
            <div className="mx-2">
              <Slider
                name="lp-amount"
                min={0}
                max={100}
                value={innerLiquidityPercentage}
                onValueChanged={(value) => setInnerLiquidityPercentage(Math.ceil(value))}
                mb="16px"
              />
            </div>
            <div className="flex flex-wrap justify-evenly">
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}>
                25%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}>
                50%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}>
                75%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}>
                Max
              </Button>
            </div>
          </Card>
        )}
        {!showDetailed && (
          <>
            <ArrowDown className="mx-auto text-white my-3" />
            <div className="text-white">
              <p className="font-bold uppercase mb-1">You will receive</p>
              <Card className="p-2 bg-blue2">
                <div className="flex justify-between mb-2">
                  <p>{formattedAmounts[Field.CURRENCY_A] || '-'}</p>
                  <div className="flex items-center">
                    <CurrencyLogo currency={currencyA} />
                    <p id="remove-liquidity-tokena-symbol" className="ml-2">
                      {currencyA?.symbol}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p>{formattedAmounts[Field.CURRENCY_B] || '-'}</p>
                  <div className="flex items-center">
                    <CurrencyLogo currency={currencyB} />
                    <p id="remove-liquidity-tokenb-symbol" className="ml-2">
                      {currencyB?.symbol}
                    </p>
                  </div>
                </div>
                {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                  <div style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                    {oneCurrencyIsETH ? (
                      <button className="text-sm ml-1 bg-primary rounded px-1.5 py-px text-black">
                        <Link
                          to={`/remove/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${
                            currencyB === ETHER ? WETH[chainId].address : currencyIdB
                          }`}
                        >
                          Receive WKAI
                        </Link>
                      </button>
                    ) : oneCurrencyIsWETH ? (
                      <button className="text-sm bg-primary rounded px-1.5 py-px text-black">
                        <Link
                          to={`/remove/${currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'KAI' : currencyIdA}/${
                            currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'KAI' : currencyIdB
                          }`}
                        >
                          Receive KAI
                        </Link>
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            </div>
          </>
        )}
        {showDetailed && (
          <div>
            <CurrencyInputPanel
              value={formattedAmounts[Field.LIQUIDITY]}
              onUserInput={onLiquidityInput}
              onMax={() => {
                onUserInput(Field.LIQUIDITY_PERCENT, '100')
              }}
              showMaxButton={!atMaxAmount}
              disableCurrencySelect
              currency={pair?.liquidityToken}
              pair={pair}
              id="liquidity-amount"
              onCurrencySelect={() => null}
            />
            <ArrowDown className="mx-auto text-white my-3" />
            <CurrencyInputPanel
              hideBalance
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onCurrencyAInput}
              onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
              showMaxButton={!atMaxAmount}
              currency={currencyA}
              label="Output"
              onCurrencySelect={handleSelectCurrencyA}
              id="remove-liquidity-tokena"
            />
            <Plus className="mx-auto text-white my-3" />
            <CurrencyInputPanel
              hideBalance
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onCurrencyBInput}
              onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
              showMaxButton={!atMaxAmount}
              currency={currencyB}
              label="Output"
              onCurrencySelect={handleSelectCurrencyB}
              id="remove-liquidity-tokenb"
            />
          </div>
        )}
        {pair && (
          <div className="text-white flex justify-between" style={{ marginTop: '16px' }}>
            <p className="font-bold uppercase">Prices</p>
            <div>
              <div className="flex justify-end">
                <p>1 {currencyA?.symbol} =</p>
                <p>
                  {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                </p>
              </div>
              <div className="flex justify-end">
                <p>1 {currencyB?.symbol} =</p>
                <p>
                  {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="relative">
          {!account ? (
            <UnlockButton />
          ) : (
            <div className="flex justify-between mt-4">
              <Button
                style={{
                  width: '48%',
                }}
                className="w-full"
                onClick={approveCallback}
                disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                isLoading={approval === ApprovalState.PENDING}
              >
                {approval === ApprovalState.PENDING
                  ? 'Approving...'
                  : approval === ApprovalState.APPROVED || signatureData !== null
                  ? 'Approved'
                  : 'Approve'}
              </Button>
              <Button
                style={{
                  width: '48%',
                }}
                className="w-full"
                color={
                  !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                    ? 'danger'
                    : 'primary'
                }
                onClick={() => {
                  setShowConfirm(true)
                }}
                disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
              >
                {error || 'Remove'}
              </Button>
            </div>
          )}
        </div>
      </Card>
      {pair ? (
        <div className="mx-auto" style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </div>
      ) : null}
    </>
  )
}
