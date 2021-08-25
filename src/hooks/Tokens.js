import { parseBytes32String } from '@ethersproject/strings'
import { ETHER, Token } from 'defily-v2-sdk'
import { useBytes32TokenContract, useTokenContract } from 'hooks/useContract'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo } from 'react'
import { arrayify } from 'ethers/lib/utils'
import { useSelectedTokenList } from 'store/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from 'store/multicall/hooks'

import { isAddress } from '../utils'

export function useAllTokens() {
  const { chainId } = useKardiachain()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    return allTokens[chainId]
  }, [allTokens, chainId])
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str, bytes32, defaultValue) {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress) {
  const { chainId } = useKardiachain()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address || undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address || undefined, false)
  const token = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD,
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token'),
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

export function useCurrency(currencyId) {
  const isBNB = currencyId?.toUpperCase() === 'KAI'
  const token = useToken(isBNB ? undefined : currencyId)
  return isBNB ? ETHER : token
}
