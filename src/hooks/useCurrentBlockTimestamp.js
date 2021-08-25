import { useSingleCallResult } from 'store/multicall/hooks'
import { useMulticallContract } from './useContract'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp() {
  const multicall = useMulticallContract()
  return useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]
}
