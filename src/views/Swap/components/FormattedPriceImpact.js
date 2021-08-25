import { useMemo } from 'react'
import { warningSeverity } from 'utils/prices'
import { ONE_BIPS } from 'constants/swap'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }) {
  const priceImpactColor = useMemo(() => {
    const severity = warningSeverity(priceImpact)
    if (severity === 3 || severity === 4) return 'text-red-500'
    if (severity === 2) return 'text-yellow-500'
    if (severity === 1) return 'text-white'
    return 'text-green-500'
  }, [priceImpact])

  return (
    <div className={priceImpactColor}>
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </div>
  )
}
