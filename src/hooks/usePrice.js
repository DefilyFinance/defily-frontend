import address from 'constants/contracts'
import { usePrices } from 'store/prices/hook'
import { getParameterCaseInsensitive } from 'utils/index'
import tokens from '../constants/tokens'

export const useDflPrice = () => {
  const prices = usePrices()

  return getParameterCaseInsensitive(prices, address.defily)
}

export const useLtdPrice = () => {
  const prices = usePrices()

  return getParameterCaseInsensitive(prices, tokens.ltd.address)
}

export const usePriceByTokenAddress = (address) => {
  const prices = usePrices()
  return getParameterCaseInsensitive(prices, address)
}

export const useKaiPrice = () => {
  const prices = usePrices()

  return getParameterCaseInsensitive(prices, address.wKai)
}
