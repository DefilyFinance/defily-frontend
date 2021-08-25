import BigNumber from 'bignumber.js'
import erc20Abi from 'config/abi/erc20.json'
import { vaultsV2Config } from 'constants/vaults'
import multicall from 'utils/multicall'
import vaultABI from 'config/abi/vaultAbi.json'

export const fetchVaultsTotalStaked = async (vaults) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.contractAddress,
      name: 'totalStakedWantTokens',
    }
  })

  const rawTotalStaked = await multicall(vaultABI, calls)

  const parsedTotalStaked = rawTotalStaked.map((lpBalance) => {
    return new BigNumber(lpBalance[0]._hex)
  })

  return parsedTotalStaked
}

export const fetchVaultsTotalSupply = async (vaults) => {
  const calls = vaults.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'totalSupply',
    }
  })

  const vaultsTotalSupply = await multicall(erc20Abi, calls)

  return [
    ...vaults.map((v, index) => ({
      vid: v.vid,
      totalSupply: new BigNumber(vaultsTotalSupply[index]).toJSON(),
    })),
  ]
}

export const fetchVaultsV2TotalStakedOfStrategy = async () => {
  const calls = vaultsV2Config.map((vault) => {
    return {
      address: vault.contractVaultStakedAddress,
      name: 'stakedWantTokens',
      params: [vault.strategyContractAddress],
    }
  })

  const rawStakedBalances = await multicall(vaultABI, calls)

  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex)
  })

  return parsedStakedBalances
}

export const fetchVaultsV2TotalShares = async () => {
  const calls = vaultsV2Config.map((vault) => {
    return {
      address: vault.contractAddress,
      name: 'totalShares',
    }
  })

  const rawTotalShares = await multicall(vaultABI, calls)

  const parsedTotalShares = rawTotalShares.map((totalShares) => {
    return new BigNumber(totalShares[0]._hex)
  })

  return parsedTotalShares
}
