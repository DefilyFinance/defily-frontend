import classnames from 'classnames'
import LogoSwap from 'components/LogoSwap/LogoSwap'
import { ETHER, Token } from 'defily-v2-sdk'
import { useMemo } from 'react'
import { WrappedTokenInfo } from 'store/lists/hooks'

export default function CurrencyLogo({ currency, size = '24px', style, className }) {
  const srcs = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [currency.logoURI()]
      }
      return [`/tokens/${currency.symbol.toLowerCase()}.png`]
    }
    return []
  }, [currency])

  if (currency === ETHER) {
    return <img src="/tokens/kai.png" className={classnames(className, 'w-8 h-8 rounded-50 bg-white shadow-md p-1')} />
  }

  return (
    <LogoSwap size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} className={className} />
  )
}
