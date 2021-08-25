import { ERC20_ABI, ERC20_BYTES32_ABI } from 'config/abi/erc20'
import address from 'constants/contracts'
import { ethers } from 'ethers'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo } from 'react'
import { isAddress } from 'utils/index'
import { simpleRpcProvider } from 'utils/providers'
import { AddressZero } from '@ethersproject/constants'
import MULTICALL_ABI from 'config/abi/multicall.json'

// account is optional
export function getContract(address, ABI) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  const provider = simpleRpcProvider

  return new ethers.Contract(address, ABI, provider)
}

function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useKardiachain()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress, withSignerIfPossible) {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress, withSignerIfPossible) {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract() {
  return useContract(address.multicall, MULTICALL_ABI, false)
}
