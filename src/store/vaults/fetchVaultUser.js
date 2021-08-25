import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import vaultABI from 'config/abi/vaultAbi.json'
import { callHelpers } from 'utils/callHelpers'
import { getERC20Contract, getVaultContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

export const fetchVaultUserAllowances = async (account, vaults) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.lpTokenAddress,
      name: 'allowance',
      params: [account, vault.contractAddress],
    }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchVaultUserTokenBalances = async (account, vaults) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.lpTokenAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)

  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })

  return parsedTokenBalances
}

export const fetchVaultUserStakedBalances = async (account, vaults) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.contractAddress,
      name: 'stakedWantTokens',
      params: [account],
    }
  })

  const rawStakedBalances = await multicall(vaultABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })

  return parsedStakedBalances
}

export const fetchVaultV2UserShares = async (account, vaults) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.contractAddress,
      name: 'userInfo',
      params: [account],
    }
  })

  const rawShares = await multicall(vaultABI, calls)
  const parsedShares = rawShares.map((shares) => {
    return new BigNumber(shares[0]._hex).toJSON()
  })

  return parsedShares
}

export const fetchVaultAllowance = async (account, vault) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, vault.lpTokenAddress, 'allowance', [account, vault.contractAddress])
  return new BigNumber(res).toJSON()
}

export const fetchUserBalance = async (account, vault) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, vault.lpTokenAddress, 'balanceOf', [account])

  return new BigNumber(res).toJSON()
}

export const fetchUserStakeBalance = async (account, vault) => {
  const vaultContract = getVaultContract()

  const res = await callHelpers(vaultContract, vault.contractAddress, 'stakedWantTokens', [account])

  return new BigNumber(res).toJSON()
}

export const fetchUserSharesBalance = async (account, vault) => {
  const vaultContract = getVaultContract()

  const res = await callHelpers(vaultContract, vault.contractAddress, 'userInfo', [account])

  return new BigNumber(res).toJSON()
}
