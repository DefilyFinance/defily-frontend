import Button from 'components/Button/Button'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import { useMemo } from 'react'
import { TradeType } from 'defily-v2-sdk'
import { AlertTriangle, ArrowDown } from 'react-feather'
import { Field } from 'store/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'

export default function SwapModalHeader({ trade, allowedSlippage, showAcceptChanges, onAcceptChanges }) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" />
          <p
            className="text-xl ml-2"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
          >
            {trade.inputAmount.toSignificant(6)}
          </p>
        </div>
        <div>
          <p className="font-bold text-xl">{trade.inputAmount.currency.symbol}</p>
        </div>
      </div>
      <div>
        <ArrowDown className="ml-2 my-2" size={16} />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <CurrencyLogo currency={trade.outputAmount.currency} />
          <p
            className="text-xl ml-2"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? 'primary'
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </p>
        </div>
        <div>
          <p className="font-bold text-xl">{trade.outputAmount.currency.symbol}</p>
        </div>
      </div>
      {showAcceptChanges ? (
        <div className="flex items-center justify-between p-3 bg-blue1 rounded-2xl mt-4">
          <div className="flex items-center text-white">
            <AlertTriangle className="mr-1" />
            <p className="font-bold"> Price Updated</p>
          </div>
          <Button onClick={onAcceptChanges}>Accept</Button>
        </div>
      ) : null}
      <div className="mt-6 italic">
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <p>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </p>
        ) : (
          <p>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </p>
        )}
      </div>
    </div>
  )
}
