import { useMemo } from 'react'
import { Token } from 'defily-v2-sdk'
import { isAddress } from 'utils/index'

export function filterTokens(tokens, search) {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter((token) => token.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return tokens.filter((token) => {
    const { symbol, name } = token
    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
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
    const rest: Token[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token)
      }
      if (token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      }
      return rest.push(token)
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, searchQuery])
}
