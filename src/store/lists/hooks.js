import { ChainId, Token } from 'defily-v2-sdk'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

// use ordering of default list of lists to assign priority
function sortByListPriority() {
  return 0
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  constructor(tokenInfo, tags) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }

  logoURI() {
    return `/tokens/${this.tokenInfo.symbol.toLowerCase()}.png`
  }
}

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST = {
  [ChainId.MAINNET]: {},
}

const listCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null

export function listToTokenMap(list) {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce(
    (tokenMap, tokenInfo) => {
      const tags =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x) => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token,
        },
      }
    },
    { ...EMPTY_LIST },
  )
  listCache?.set(list, map)
  return map
}

export function useAllLists() {
  return useSelector((state) => state.lists.byUrl)
}

function combineMaps(map1, map2) {
  return {
    [ChainId.MAINNET]: { ...map1?.[ChainId.MAINNET], ...map2?.[ChainId.MAINNET] },
  }
}

export function useTokenList(url) {
  const lists = useSelector((state) => state.lists.byUrl)
  return useMemo(() => {
    if (!url) return EMPTY_LIST
    const current = lists[url]?.current
    if (!current) return EMPTY_LIST
    try {
      return listToTokenMap(current)
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, url])
}

export function useSelectedTokenList() {
  return useTokenList(useSelectedListUrl())
}

export function useSelectedListUrl() {
  return useSelector((state) => state.lists.selectedListUrl)
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined) {
  const lists = useAllLists()

  return useMemo(() => {
    if (!urls) return EMPTY_LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const newTokens = Object.assign(listToTokenMap(current))
            return combineMaps(allTokens, newTokens)
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, EMPTY_LIST)
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls() {
  return useSelector((state) => state.lists.activeListUrls)
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList() {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  return combineMaps(activeTokens)
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
