import Button from 'components/Button/Button'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import { DFL } from 'constants/tokens'
import { currencyEquals } from 'defily-v2-sdk'

export default function CommonBases({ chainId, onSelect, pairs }) {
  const commonBases = pairs.filter((pair) => {
    return currencyEquals(pair.token0, DFL[chainId]) || currencyEquals(pair.token1, DFL[chainId])
  })

  return (
    <div>
      <div className="flex items-center my-2">
        <p>Common bases</p>
      </div>
      <div className="flex">
        {commonBases.map((pair) => {
          return (
            <Button className="mx-1" size="sm" onClick={() => onSelect(pair)} key={pair.liquidityToken.address}>
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} />
              <p>
                {pair.token0.symbol}/{pair.token1.symbol}
              </p>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
