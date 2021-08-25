import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import { showToastError } from 'components/CustomToast/CustomToast'
import PercentPicker from 'components/PercentPicker/PercentPicker'
import UnlockButton from 'components/UnlockButton/UnlockButton'
import { INITIAL_ALLOWED_SLIPPAGE, ZAP_ADDRESS } from 'constants/swap'
import { CurrencyAmount, Percent } from 'defily-v2-sdk'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useKardiachain from 'hooks/useKardiachain'
import { usePairs } from 'hooks/usePairs'
import { useCallback, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { useDerivedPipeInfo, usePipeActionHandlers, usePipeState } from 'store/pipe/hooks'
import { useTransactionAdder } from 'store/transactions/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs, useUserSlippageTolerance } from 'store/user/hooks/index'
import { Field } from 'store/pipe/actions'
import { estimatedHelpers, sendTransactionToExtension, txDataHelpers } from 'utils/callHelpers'
import { getZapContract } from 'utils/contractHelpers'
import { pairId } from 'utils/currencyId'
import maxAmountSpend from 'utils/maxAmountSpend'
import PairInputPanel from 'components/PairInputPanel/PairInputPanel'

const Pipe = ({
  match: {
    params: { pairIdA, pairIdB },
  },
  history,
}) => {
  const { account, chainId, library } = useKardiachain()

  // txn values
  const [pendingTx, setPendingTx] = useState(false)
  const [allowedSlippage] = useUserSlippageTolerance()

  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair) => Boolean(v2Pair))
    // filter bossdoge pair
    .filter((v2Pair) => v2Pair.liquidityToken.address !== '0x5b60A5761047B3A9ec340941d904231bE85f5C0b')

  const pairA = pairIdA
    ? allV2PairsWithLiquidity.find((pair) => pair.liquidityToken.address.toLowerCase() === pairIdA.toLowerCase())
    : undefined
  const pairB = pairIdB
    ? allV2PairsWithLiquidity.find((pair) => pair.liquidityToken.address.toLowerCase() === pairIdB.toLowerCase())
    : undefined

  // pipe state
  const { independentField, typedValue, otherTypedValue } = usePipeState()

  const { dependentField, path, currencies, usdcValues, currencyBalances, parsedAmounts, noLiquidity, error } =
    useDerivedPipeInfo(pairA ?? undefined, pairB ?? undefined)

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.PAIR_A], ZAP_ADDRESS)

  const addTransaction = useTransactionAdder()

  const { onFieldAInput } = usePipeActionHandlers(noLiquidity)

  async function onPipe() {
    if (!chainId || !library || !account) return
    const zapContract = getZapContract()

    const { [Field.PAIR_A]: parsedAmountA } = parsedAmounts
    if (!parsedAmountA || !pairA || !pairB) {
      return
    }

    const method = 'FlashPipe'
    const args = [
      pairA.liquidityToken.address ?? '', // pair address A
      pairB.liquidityToken.address ?? '', // pair address b
      parsedAmountA.raw.toString(), // _amount
      (1000 - allowedSlippage / 10).toString(), // _slippageFactor
      path.pathToken0InputToToken0Output, // _token0ToOutputToken0Path
      path.pathToken1InputToToken0Output, // _token1ToOutputToken0Path
      path.pathToken0OutputToToken1Output, // _outputToken0ToToken1OutputPath
    ]

    setPendingTx(true)
    await estimatedHelpers(zapContract, method, args)
      .then(() =>
        sendTransactionToExtension(account, txDataHelpers(zapContract, method, args), ZAP_ADDRESS).then((response) => {
          setPendingTx(false)

          addTransaction(response, {
            summary: `Swap ${parsedAmounts[Field.PAIR_A]?.toSignificant(3)} ${
              currencies[Field.PAIR_A]?.token0.symbol
            }/${currencies[Field.PAIR_A]?.token1.symbol} for ${currencies[Field.PAIR_B]?.token0.symbol}/${
              currencies[Field.PAIR_B]?.token1.symbol
            }`,
          })

          onFieldAInput('')
        }),
      )
      .catch((err) => {
        setPendingTx(false)
        if (err?.message === 'Transaction Failed!') {
          showToastError('Transaction Failed!', 'Please try again')
        } else {
          showToastError(
            'Canceled',
            'Please try again. Confirm the transaction and make sure you are paying enough gas!',
          )
        }
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err)
        }
      })
  }

  // get the max amounts user can pipe
  const maxAmounts = [Field.PAIR_A].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    }
  }, {})

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField] ?? '',
  }

  const handlePairASelect = useCallback(
    (pairA_) => {
      const newPairIdA = pairId(pairA_)
      if (newPairIdA === pairIdB) {
        history.push(`/pipe/${pairIdB}/${pairA_}`)
      } else {
        history.push(`/pipe/${newPairIdA}/${pairIdB}`)
      }
    },
    [pairIdB, history],
  )

  const handlePairBSelect = useCallback(
    (pairB_) => {
      const newPairIdB = pairId(pairB_)
      if (pairIdA === newPairIdB) {
        if (pairIdB) {
          history.push(`/pipe/${pairIdB}/${newPairIdB}`)
        } else {
          history.push(`/pipe/${newPairIdB}`)
        }
      } else {
        history.push(`/pipe/${pairIdA || '0x7cd3c7aFeDD16A72Fba66eA35B2e2b301d1B7093'}/${newPairIdB}`)
      }
    },
    [pairIdA, pairIdB, history],
  )

  const handleSwitchPair = useCallback(() => {
    if (pairIdA && pairIdB) {
      history.push(`/pipe/${pairIdB}/${pairIdA}`)
    } else if (pairIdA) {
      history.push(`/pipe//${pairIdA}`)
    } else if (pairIdB) {
      history.push(`/pipe/${pairIdB}`)
    }
  }, [pairIdA, pairIdB, history])

  const handlePercentInput = useCallback(
    (percent) => {
      if (!pairA) return
      if (percent.equalTo(new Percent('100'))) {
        onFieldAInput(maxAmounts[Field.PAIR_A]?.toExact() ?? '')
      } else {
        onFieldAInput(
          new CurrencyAmount(pairA.liquidityToken, percent.multiply(maxAmounts[Field.PAIR_A].raw).quotient).toExact(),
        )
      }
    },
    [pairA, maxAmounts, onFieldAInput],
  )

  return (
    <>
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader title="Pipe" />
        <PairInputPanel
          label={independentField === Field.PAIR_B ? 'From (estimated)' : 'From'}
          pairs={allV2PairsWithLiquidity}
          value={formattedAmounts[Field.PAIR_A]}
          onUserInput={onFieldAInput}
          onMax={() => {
            onFieldAInput(maxAmounts[Field.PAIR_A]?.toExact() ?? '')
          }}
          // showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
          onPairSelect={handlePairASelect}
          pair={currencies[Field.PAIR_A]}
          otherPair={currencies[Field.PAIR_B]}
          fiatValue={usdcValues[Field.PAIR_A]}
          id="pipe-input-paira"
        />
        <PercentPicker onChangePercentInput={handlePercentInput} />
        <div className="flex justify-center" style={{ padding: '0 1rem' }}>
          <div className="rounded-lg p-1 cursor-pointer my-2 hover:bg-blue2">
            <ArrowDown size={20} onClick={handleSwitchPair} color="white" />
          </div>
        </div>
        <PairInputPanel
          label="To (estimated)"
          pairs={allV2PairsWithLiquidity}
          value={formattedAmounts[Field.PAIR_B]}
          // onUserInput={onFieldBInput}
          disableInput
          onPairSelect={handlePairBSelect}
          pair={currencies[Field.PAIR_B]}
          otherPair={currencies[Field.PAIR_A]}
          fiatValue={usdcValues[Field.PAIR_B]}
          id="pipe-output-pairb"
        />
        <div className="mt-2 text-white">
          {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
            <div className="flex items-center justify-center">
              <p>Slippage Tolerance:</p>
              <p className="font-bold primary ml-2">{allowedSlippage / 100}%</p>
            </div>
          )}
        </div>

        {!account ? (
          <UnlockButton />
        ) : (
          <div className="mt-4">
            {(approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && (
              <Button
                className="w-full mb-2"
                onClick={approveCallback}
                disabled={approval === ApprovalState.PENDING}
                isLoading={approval === ApprovalState.PENDING}
              >
                {approval === ApprovalState.PENDING
                  ? `Approving ${currencies[Field.PAIR_A]?.token0?.symbol}/${currencies[Field.PAIR_A]?.token1?.symbol}`
                  : `Approve ${currencies[Field.PAIR_A]?.token0?.symbol}/${currencies[Field.PAIR_A]?.token1?.symbol}`}
              </Button>
            )}
            <Button
              className="w-full"
              onClick={onPipe}
              isLoading={pendingTx}
              disabled={approval !== ApprovalState.APPROVED || noLiquidity}
            >
              {noLiquidity ? 'Invalid pair' : error ?? 'Pipe'}
            </Button>
          </div>
        )}
      </Card>
    </>
  )
}

export default Pipe
