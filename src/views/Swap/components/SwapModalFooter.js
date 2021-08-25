import Button from 'components/Button/Button'
import { useMemo, useState } from 'react'
import { TradeType } from 'defily-v2-sdk'
import { RefreshCcw } from 'react-feather'
import { Field } from 'store/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices'
import QuestionHelper from 'components/QuestionHelper'
import { SwapCallbackError } from 'views/Swap/components/SwapCallbackError'
import FormattedPriceImpact from './FormattedPriceImpact'

export default function SwapModalFooter({ trade, onConfirm, allowedSlippage, swapErrorMessage, disabledConfirm }) {
  const [showInverted, setShowInverted] = useState(false)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between flex-wrap">
          <p>Price</p>
          <p className="flex items-center">
            {formatExecutionPrice(trade, showInverted)}
            <RefreshCcw className="cursor-pointer ml-1" onClick={() => setShowInverted(!showInverted)} size={18} />
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <p>{trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}</p>
            <QuestionHelper
              text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              ml="4px"
            />
          </div>
          <div className="flex items-center">
            <p>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </p>
            <o className="ml-1">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </o>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p>Price Impact</p>
            <QuestionHelper text="The difference between the market price and your price due to trade size." ml="4px" />
          </div>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p>Liquidity Provider Fee</p>
            <QuestionHelper
              text={
                <>
                  <p>For each trade a 0.25% fee is paid</p>
                  <p>- 0.2% to LP token holders</p>
                  <p>- 0.05% to protocol (KAI DEX fee)</p>
                </>
              }
              ml="4px"
            />
          </div>
          <p className="break-words">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </p>
        </div>
      </div>

      <div>
        <Button
          className="mt-6 w-full"
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>
        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </div>
    </>
  )
}
