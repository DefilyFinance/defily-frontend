import { Trade, TradeType } from 'defily-v2-sdk'
import { Field } from 'store/swap/actions'
import { useUserSlippageTolerance } from 'store/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
import QuestionHelper from 'components/QuestionHelper'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade, allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <div style={{ padding: '0 16px' }}>
      <div className="flex items-center justify-between flex-wrap mb-1">
        <div className="flex items-center">
          <p>{isExactIn ? 'Minimum received' : 'Maximum sold'}</p>
          <QuestionHelper
            style={{
              zIndex: 50,
            }}
            classNameToolTip="tooltip-center"
            text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
            ml="4px"
          />
        </div>
        <div>
          <p>
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap mb-1">
        <div className="flex items-center">
          <p>Price Impact</p>
          <QuestionHelper
            style={{
              zIndex: 40,
            }}
            classNameToolTip="tooltip-center"
            text="The difference between the market price and estimated price due to trade size."
            ml="4px"
          />
        </div>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </div>

      <div className="flex items-center justify-between flex-wrap mb-1">
        <div className="flex items-center">
          <p>Liquidity Provider Fee</p>
          <QuestionHelper
            style={{
              zIndex: 30,
            }}
            classNameToolTip="tooltip-center"
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
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </p>
      </div>
    </div>
  )
}

export function AdvancedSwapDetails({ trade }) {
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <div className="text-white">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <div className="mt-4">
                <span className="flex items-center justify-center">
                  <p>Route</p>
                  <QuestionHelper
                    classNameToolTip="tooltip-center"
                    style={{
                      zIndex: 20,
                    }}
                    text="Routing through these tokens resulted in the best price for your trade."
                  />
                </span>
                <SwapRoute trade={trade} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
