import { TokenAmount, Pair } from 'defily-v2-sdk'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo } from 'react'
import IUniswapV2PairABI from 'config/abi/lpToken.json'
import { Interface } from '@ethersproject/abi'

import { useMultipleContractSingleData } from 'store/multicall/hooks'
import { wrappedCurrency } from 'utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export const PairState = {
  LOADING: 0,
  NOT_EXISTS: 1,
  EXISTS: 2,
  INVALID: 3,
}

export function usePairs(currencies) {
  const { chainId } = useKardiachain()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens],
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const [reserve0, reserve1] = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA, tokenB) {
  const inputs = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(inputs)[0]
}
