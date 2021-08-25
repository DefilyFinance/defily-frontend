import classnames from 'classnames'
import CurrencyLogo from './CurrencyLogo'

export default function DoubleCurrencyLogo({ currency0, currency1, size = 20 }) {
  return (
    <div className={classnames('relative', currency1 && 'mr-5')}>
      {currency0 && (
        <CurrencyLogo
          className="relative z-20"
          currency={currency0}
          size={`${size.toString()}px`}
          style={{ marginRight: '4px' }}
        />
      )}
      {currency1 && (
        <CurrencyLogo currency={currency1} size={`${size.toString()}px`} className="absolute top-0 -right-4" />
      )}
    </div>
  )
}
