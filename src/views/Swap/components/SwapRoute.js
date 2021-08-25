import { Fragment, memo } from 'react'
import { Trade } from 'defily-v2-sdk'
import { ChevronRight } from 'react-feather'
import { unwrappedToken } from 'utils/wrappedCurrency'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  return (
    <div className="flex items-center justify-center flex-wrap w-full">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        const currency = unwrappedToken(token)
        return (
          <Fragment key={i}>
            <div className="flex">
              <p fontSize="14px" ml="0.125rem" mr="0.125rem">
                {currency.symbol}
              </p>
            </div>
            {!isLastItem && <ChevronRight size={12} />}
          </Fragment>
        )
      })}
    </div>
  )
})
