import { useMemo } from 'react'
import { isAddress } from 'utils/index'

export function filterTokens(tokens, search) {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter(
      (token) =>
        token.liquidityToken.address === searchingAddress ||
        token.token0.address === searchingAddress ||
        token.token1.address === searchingAddress,
    )
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s) => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return tokens.filter((pair) => {
    return (
      (pair.token0.symbol && matchesSearch(pair.token0.symbol)) ||
      (pair.token0.name && matchesSearch(pair.token0.name)) ||
      (pair.token1.symbol && matchesSearch(pair.token1.symbol)) ||
      (pair.token1.name && matchesSearch(pair.token1.name))
    )
  })
}

export function useSortedTokensByQuery(tokens, searchQuery) {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches = []
    const symbolSubtrings = []
    const rest = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      const symbol = `${token.token0.symbol}/${token.token1.symbol}`

      if (symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      }
      if (symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      }
      return rest.push(token)
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}
