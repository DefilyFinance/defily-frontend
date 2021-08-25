import useKardiachain from 'hooks/useKardiachain'
import { useSelector } from 'react-redux'

export function useBlockNumber() {
  const { chainId } = useKardiachain()

  return useSelector((state) => state.application.blockNumber[chainId ?? -1])
}

export default useBlockNumber
