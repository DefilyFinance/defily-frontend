import BigNumber from 'bignumber.js'
import HoverInlineText from 'components/HoverInlineText/HoverInlineText'
import { useMemo } from 'react'
import { warningSeverity } from 'utils/prices'

export function FiatValue({ fiatValue, priceImpact }) {
  const priceImpactColor = useMemo(() => {
    const severity = warningSeverity(priceImpact)
    if (severity === 3 || severity === 4) return 'text-red-500'
    if (severity === 2) return 'text-yellow-500'
    if (severity === 1) return 'text-white'
    return 'text-green-500'
  }, [priceImpact])

  return (
    <div className="text-white flex">
      {fiatValue ? '~$' : ''}
      <HoverInlineText text={fiatValue ? fiatValue?.toSignificant(6, { groupSeparator: ',' }) : ''} />
      {priceImpact ? (
        <span className={priceImpactColor}>({new BigNumber(priceImpact.toSignificant(3)).times(-1).toFixed()})%</span>
      ) : null}
    </div>
  )
}
