import { CurrencyAmount, ETHER, JSBI } from 'defily-v2-sdk'
import { MIN_KAI } from 'constants/swap'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount) {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_KAI)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_KAI))
    }
    return CurrencyAmount.ether(JSBI.BigInt(0))
  }
  return currencyAmount
}

export default maxAmountSpend
