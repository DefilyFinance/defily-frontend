import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import CurrencyInputPanel from 'components/CurrencyInputPanel/index'
import { showToastError } from 'components/CustomToast/CustomToast'
import PercentPicker from 'components/PercentPicker/PercentPicker'
import UnlockButton from 'components/UnlockButton/UnlockButton'
import { ZAP_ADDRESS } from 'constants/swap'
import { BOSSDOGE, DRAGON } from 'constants/tokens'
import { CurrencyAmount, ETHER, Percent } from 'defily-v2-sdk'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useKardiachain from 'hooks/useKardiachain'
import { usePairs } from 'hooks/usePairs'
import { useCallback, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { useTransactionAdder } from 'store/transactions/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs, useUserSlippageTolerance } from 'store/user/hooks/index'
import { Field, ZAP_FLOW } from 'store/zap/actions'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'store/zap/hooks'
import { estimatedHelpers, sendTransactionToExtension, txDataHelpers } from 'utils/callHelpers'
import { getZapContract } from 'utils/contractHelpers'
import isZero from 'utils/isZero'
import maxAmountSpend from 'utils/maxAmountSpend'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import PairInputPanel from 'components/PairInputPanel/PairInputPanel'

const Zap = () => {
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

  // zap state
  const { independentField, typedValue, flow } = useZapState()
  const { dependentField, path, currencies, currencyBalances, parsedAmounts, noLiquidity, error, symbol, usdcValues } =
    useDerivedZapInfo(allV2PairsWithLiquidity)

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.INPUT], ZAP_ADDRESS)

  const addTransaction = useTransactionAdder()

  const { onFieldAInput, onCurrencySelection, onSwitchFlow } = useZapActionHandlers(noLiquidity)

  async function onZap() {
    if (!chainId || !library || !account) return
    const zapContract = getZapContract()

    const { [Field.INPUT]: parsedAmountA } = parsedAmounts
    if (!parsedAmountA || !currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      return
    }

    let method
    let args
    let value

    if (flow === ZAP_FLOW.PAIR_OUTPUT) {
      method = 'FlashTokenToLP'
      const tokenAIsETH = currencies[Field.INPUT] === ETHER
      args = [
        tokenAIsETH
          ? '0x0000000000000000000000000000000000000000'
          : wrappedCurrency(currencies[Field.INPUT], chainId)?.address ?? '', // token address A
        currencies[Field.OUTPUT].liquidityToken.address ?? '', // pair address b
        tokenAIsETH ? '0' : parsedAmountA.raw.toString(), // _amount
        (1000 - allowedSlippage / 10).toString(), // _slippageFactor
        path.pathTokenAtoToken0Output, // _inputToToken0Path
        path.pathTokenAtoToken1Output, // _inputToToken1Path
      ]

      value = tokenAIsETH ? parsedAmountA.raw.toString() : null
    } else {
      method = 'FlashLPToToken'
      const tokenBIsETH = currencies[Field.OUTPUT] === ETHER
      args = [
        tokenBIsETH
          ? '0x0000000000000000000000000000000000000000'
          : wrappedCurrency(currencies[Field.OUTPUT], chainId)?.address ?? '', // _outputToken
        currencies[Field.INPUT].liquidityToken.address ?? '', // _inputLPToken
        parsedAmountA.raw.toString(), // _amount
        (1000 - allowedSlippage / 10).toString(), // _slippageFactor
        path.pathToken0toTokenOutput, // _token0ToOutputPath
        path.pathToken1toTokenOutput, // _token1ToOutputPath
      ]
    }

    setPendingTx(true)
    await estimatedHelpers(zapContract, method, args)
      .then(() =>
        sendTransactionToExtension(account, txDataHelpers(zapContract, method, args), ZAP_ADDRESS, {
          ...(value && !isZero(value) ? { value } : {}),
        }).then((response) => {
          setPendingTx(false)

          addTransaction(response, {
            summary: `Swap ${parsedAmounts[Field.INPUT]?.toSignificant(3)} ${symbol[Field.INPUT]} for ${
              symbol[Field.OUTPUT]
            }`,
          })

          // reset input
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

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField] ?? '',
  }

  // get the max amounts user can zap
  const maxAmounts = [Field.INPUT].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    }
  }, {})

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection],
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection],
  )

  const handlePercentInput = useCallback(
    (percent) => {
      if (!currencies[Field.INPUT]) return
      if (percent.equalTo(new Percent('100'))) {
        onFieldAInput(maxAmounts[Field.INPUT]?.toExact() ?? '')
      } else {
        onFieldAInput(
          new CurrencyAmount(currencies[Field.INPUT], percent.multiply(maxAmounts[Field.INPUT].raw).quotient).toExact(),
        )
      }
    },
    [currencies, maxAmounts, onFieldAInput],
  )

  return (
    <>
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader title="Zap" />
        {flow === ZAP_FLOW.PAIR_OUTPUT ? (
          <CurrencyInputPanel
            listHideTokens={[DRAGON[chainId], BOSSDOGE]}
            label={independentField === Field.OUTPUT ? 'From (estimated)' : 'From'}
            value={formattedAmounts[Field.INPUT]}
            onUserInput={onFieldAInput}
            onMax={() => {
              onFieldAInput(maxAmounts[Field.INPUT]?.toExact() ?? '')
            }}
            onCurrencySelect={handleInputSelect}
            currency={currencies[Field.INPUT]}
            id="zap-input-tokena"
            fiatValue={usdcValues[Field.INPUT]}
            showCommonBases
          />
        ) : (
          <PairInputPanel
            label={independentField === Field.OUTPUT ? 'From (estimated)' : 'From'}
            onMax={() => {
              onFieldAInput(maxAmounts[Field.INPUT]?.toExact() ?? '')
            }}
            onUserInput={onFieldAInput}
            pairs={allV2PairsWithLiquidity}
            value={formattedAmounts[Field.INPUT]}
            onPairSelect={handleInputSelect}
            pair={currencies[Field.INPUT]}
            fiatValue={usdcValues[Field.INPUT]}
            id="zap-input-paira"
          />
        )}
        <PercentPicker onChangePercentInput={handlePercentInput} />
        <div className="flex justify-center" style={{ padding: '0 1rem' }}>
          <div className="rounded-lg p-1 cursor-pointer my-2 hover:bg-blue2">
            <ArrowDown size={20} onClick={onSwitchFlow} color="white" />
          </div>
        </div>
        {flow === ZAP_FLOW.PAIR_OUTPUT ? (
          <PairInputPanel
            label="To (estimated)"
            pairs={allV2PairsWithLiquidity}
            value={formattedAmounts[Field.OUTPUT]}
            disableInput
            onPairSelect={handleOutputSelect}
            pair={currencies[Field.OUTPUT]}
            fiatValue={usdcValues[Field.OUTPUT]}
            id="zap-output-pairb"
          />
        ) : (
          <CurrencyInputPanel
            listHideTokens={[DRAGON[chainId], BOSSDOGE]}
            label="To (estimated)"
            value={formattedAmounts[Field.OUTPUT]}
            disableInput
            onCurrencySelect={handleOutputSelect}
            currency={currencies[Field.OUTPUT]}
            id="zap-output-tokenb"
            fiatValue={usdcValues[Field.OUTPUT]}
            showCommonBases
          />
        )}
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
                  ? `Approving ${symbol[Field.INPUT]}`
                  : `Approve ${symbol[Field.INPUT]}`}
              </Button>
            )}
            <Button
              className="w-full"
              onClick={onZap}
              isLoading={pendingTx}
              disabled={approval !== ApprovalState.APPROVED || noLiquidity}
            >
              {noLiquidity ? 'Invalid pair' : error ?? 'Zap'}
            </Button>
          </div>
        )}
      </Card>
    </>
  )
}

export default Zap
