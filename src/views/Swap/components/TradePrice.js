import { RefreshCcw } from 'react-feather'

export default function TradePrice({ price, showInverted, setShowInverted }) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <div className="flex items-center justify-center break-words whitespace-normal">
      {show ? (
        <>
          <p>
            {formattedPrice ?? '-'} {label}
          </p>
          <RefreshCcw className="cursor-pointer ml-1" onClick={() => setShowInverted(!showInverted)} size={18} />
        </>
      ) : (
        '-'
      )}
    </div>
  )
}
