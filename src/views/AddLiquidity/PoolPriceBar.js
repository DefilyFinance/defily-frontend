import { ONE_BIPS } from 'constants/swap'
import { Field } from 'store/mint/actions'

function PoolPriceBar({ currencies, noLiquidity, poolTokenPercentage, price }) {
  return (
    <div className="text-white">
      <div>
        <div className="flex justify-between">
          <p>{price?.toSignificant(6) ?? '-'}</p>
          <p>
            {currencies[Field.CURRENCY_B]?.symbol ?? ''} per {currencies[Field.CURRENCY_A]?.symbol ?? ''}
          </p>
        </div>
        <div className="flex justify-between my-2">
          <p>{price?.invert()?.toSignificant(6) ?? '-'}</p>
          <p>
            {currencies[Field.CURRENCY_A]?.symbol ?? ''} per {currencies[Field.CURRENCY_B]?.symbol ?? ''}
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </p>
          <p>Share of Pool</p>
        </div>
      </div>
    </div>
  )
}

export default PoolPriceBar
