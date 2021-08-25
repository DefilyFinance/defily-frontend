import { TokenAmount } from 'defily-v2-sdk'
import { useTokenContract } from './useContract'
import { useSingleCallResult } from 'store/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(token) {
  const contract = useTokenContract(token?.address, false)

  const totalSupply = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}

export default useTotalSupply
