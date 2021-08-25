import { useSelector } from 'react-redux'

export const usePrices = () => {
  const prices = useSelector((state) => state.prices.data)
  return prices
}
