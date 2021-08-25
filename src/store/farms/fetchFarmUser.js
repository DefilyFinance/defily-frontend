import BigNumber from 'bignumber.js'
import erc20Abi from 'config/abi/erc20.json'
import masterChefAbi from 'config/abi/masterchef.json'
import address from 'constants/contracts'
import { callHelpers } from 'utils/callHelpers'
import { getERC20Contract, getMasterChefContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

export const fetchFarmUserAllowances = async (account, farmsToFetch, masterChefAddress) => {
  const calls = farmsToFetch.map((farm) => {
    return { address: farm.lpAddress, name: 'allowance', params: [account, masterChefAddress] }
  })

  const rawLpAllowances = await multicall(erc20Abi, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account, farmsToFetch) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.lpAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20Abi, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account, farmsToFetch, masterChefAddress) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterChefAbi, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })

  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account, farmsToFetch, masterChefAddress) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingRewards',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(masterChefAbi, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })

  return parsedEarnings
}

export const fetchFarmDragonUser = async (account) => {
  const callsErc = [
    {
      address: address.defily,
      name: 'allowance',
      params: [account, address.dragon],
    },
    {
      address: address.defily,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: address.dragon,
      name: 'balanceOf',
      params: [account],
    },
  ]

  const [[allowance], dflTokenBalance, dragonTokenBalance] = await multicall(erc20Abi, callsErc)

  return {
    dragonAllowance: new BigNumber(allowance._hex).toJSON(),
    dflBalance: new BigNumber(dflTokenBalance).toJSON(),
    dragonBalance: new BigNumber(dragonTokenBalance).toJSON(),
  }
}

export const fetchFarmUserAllowance = async (account, lpAddress, masterChefAddress) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, lpAddress, 'allowance', [account, masterChefAddress])
  return new BigNumber(res).toJSON()
}

export const fetchFarmDragonUserAllowance = async (account) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, address.defily, 'allowance', [account, address.dragon])
  return new BigNumber(res).toJSON()
}

export const fetchFarmUserTokenBalance = async (account, lpAddress) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, lpAddress, 'balanceOf', [account])

  return new BigNumber(res).toJSON()
}

export const fetchFarmUserStakedBalance = async (account, pid, masterChefAddress) => {
  const masterChefContract = getMasterChefContract()
  const { amount } = await callHelpers(masterChefContract, masterChefAddress, 'userInfo', [pid, account])

  return new BigNumber(amount).toJSON()
}

export const fetchFarmUserEarning = async (account, pid, masterChefAddress) => {
  const masterChefContract = getMasterChefContract()
  const earnings = await callHelpers(masterChefContract, masterChefAddress, 'pendingRewards', [pid, account])

  return new BigNumber(earnings).toJSON()
}

export const fetchFarmDragonUserDragonBalance = async (account) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, address.dragon, 'balanceOf', [account])

  return new BigNumber(res).toJSON()
}
