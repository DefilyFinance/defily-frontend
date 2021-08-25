import { currencyEquals, Price, Token } from 'defily-v2-sdk'
import { useTradeExactOut } from 'hooks/Trades'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo } from 'react'
import { KUSD } from 'constants/tokens'
import { tryParseAmount } from 'store/swap/hooks'
import { wrappedCurrency } from 'utils/wrappedCurrency'

// USDC amount used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const usdcCurrencyAmount = tryParseAmount('100000', wrappedCurrency(KUSD[1], 1))

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency) {
  const { chainId } = useKardiachain()

  const v2USDCTrade = useTradeExactOut(currency, chainId === 1 ? usdcCurrencyAmount : undefined)

  return useMemo(() => {
    if (!currency || !chainId) {
      return undefined
    }

    // return some fake price data for non-mainnet
    if (chainId !== 1) {
      const fakeUSDC = new Token(chainId, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'fUSDC', 'Fake USDC')
      return new Price(
        currency,
        fakeUSDC,
        10 ** Math.max(0, currency.decimals - 6),
        15 * 10 ** Math.max(6 - currency.decimals, 0),
      )
    }

    // handle usdc
    if (currencyEquals(currency, KUSD[chainId])) {
      return new Price(KUSD[chainId], KUSD[chainId], '1', '1')
    }

    // use v2 price if available, v3 as fallback
    if (v2USDCTrade) {
      const { numerator, denominator } = v2USDCTrade.route.midPrice
      return new Price(currency, KUSD[chainId], denominator, numerator)
    }

    return undefined
  }, [chainId, currency, v2USDCTrade])
}

export function useUSDCValue(currencyAmount) {
  const price = useUSDCPrice(currencyAmount?.currency)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}
