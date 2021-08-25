import { useMemo } from 'react'
import { useAllTokenBalances } from 'store/wallet/hooks'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA, balanceB) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  }
  if (balanceA && balanceA.greaterThan('0')) {
    return -1
  }
  if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

function getTokenComparator(balances) {
  return function sortTokens(tokenA, tokenB) {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.liquidityToken.address]
    const balanceB = balances[tokenB.liquidityToken.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    const symbolA = `${tokenA.token0.symbol}/${tokenA.token1.symbol}`
    const symbolB = `${tokenB.token0.symbol}/${tokenB.token1.symbol}`

    if (symbolA && symbolB) {
      return 0
      // sort by symbol
      // return symbolA.toLowerCase() < symbolB.toLowerCase() ? -1 : 1
    }
    return symbolA ? -1 : symbolB ? -1 : 0
  }
}

function useTokenComparator(inverted) {
  const balances = useAllTokenBalances()
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  return useMemo(() => {
    if (inverted) {
      return (tokenA, tokenB) => comparator(tokenA, tokenB) * -1
    }
    return comparator
  }, [inverted, comparator])
}

export default useTokenComparator
