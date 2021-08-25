import erc20ABI from 'config/abi/erc20.json'
import erc20Abi from 'config/abi/erc20.json'
import sousChefAbi from 'config/abi/sousChef.json'
import sousChefV2Abi from 'config/abi/sousChefV2.json'
import sousChefV3Abi from 'config/abi/sousChefV3.json'
import BigNumber from 'bignumber.js'
import { callHelpers } from 'utils/callHelpers'
import { getERC20Contract, getSouschefContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

export const fetchPoolUserAllowances = async (account, pools) => {
  const calls = pools.map((pool) => {
    return {
      address: pool.stakingToken.address,
      name: 'allowance',
      params: [account, pool.contractAddress],
    }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchPoolUserTokenBalances = async (account, pools) => {
  const calls = pools.map((pool) => {
    return {
      address: pool.stakingToken.address,
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

export const fetchPoolUserStakedBalances = async (account, pools) => {
  const poolsNoWithDrawFee = pools.filter((pool) => !pool?.blockPeriod)
  const poolsWithDrawFee = pools.filter((pool) => pool?.blockPeriod)

  const callsNoWithDrawFee = poolsNoWithDrawFee.map((pool) => {
    return {
      address: pool.contractAddress,
      name: 'userInfo',
      params: [account],
    }
  })

  const callsWithDrawFee = poolsWithDrawFee.map((pool) => {
    return {
      address: pool.contractAddress,
      name: 'userInfo',
      params: [account],
    }
  })

  const rawBalancesNoWithDrawFee = await multicall(sousChefV2Abi, callsNoWithDrawFee)
  const rawBalancesWithDrawFee = await multicall(sousChefV3Abi, callsWithDrawFee)

  const parsedBalancesNoWithDrawFee = poolsNoWithDrawFee.map((pool, index) => {
    return {
      sousId: pool.sousId,
      lastStakingBlock: undefined,
      stakedBalance: new BigNumber(rawBalancesNoWithDrawFee[index]?.amount?._hex).toJSON(),
    }
  })

  const parsedBalancesWithDrawFee = poolsWithDrawFee.map((pool, index) => {
    return {
      sousId: pool.sousId,
      lastStakingBlock: rawBalancesWithDrawFee[index]?.lastStakingBlock?._hex
        ? new BigNumber(rawBalancesWithDrawFee[index].lastStakingBlock._hex).toJSON()
        : undefined,
      stakedBalance: new BigNumber(rawBalancesWithDrawFee[index]?.amount?._hex).toJSON(),
    }
  })

  return [...parsedBalancesNoWithDrawFee, ...parsedBalancesWithDrawFee]
}

export const fetchPoolUserEarnings = async (account, pools) => {
  const calls = pools.map((pool) => {
    return {
      address: pool.contractAddress,
      name: 'pendingReward',
      params: [account],
    }
  })

  const rawEarnings = await multicall(sousChefV2Abi, calls)
  const parsedEarnings = rawEarnings?.map((earnings) => {
    return earnings?.[0].map((earning) => new BigNumber(earning?._hex).toJSON())
  })

  return parsedEarnings
}

export const fetchPoolUser = async (account, pool) => {
  const callsErc = [
    {
      address: pool.stakingToken.address,
      name: 'allowance',
      params: [account, pool.contractAddress],
    },
    {
      address: pool.stakingToken.address,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: pool.earningToken.address,
      name: 'balanceOf',
      params: [account],
    },
  ]

  const callsSousChef = [
    {
      address: pool.contractAddress,
      name: 'userInfo',
      params: [account],
    },
    {
      address: pool.contractAddress,
      name: 'pendingReward',
      params: [account],
    },
  ]

  const [[allowance], tokenBalance, earningsTokenBalance] = await multicall(erc20Abi, callsErc)
  const [stakedBalance, earnings] = await multicall(sousChefAbi, callsSousChef)

  return {
    allowance: new BigNumber(allowance._hex).toJSON(),
    stakingTokenBalance: new BigNumber(tokenBalance).toJSON(),
    earningsTokenBalance: new BigNumber(earningsTokenBalance).toJSON(),
    earnings: new BigNumber(earnings).toJSON(),
    stakedBalance: new BigNumber(stakedBalance.amount._hex).toJSON(),
  }
}

export const fetchPoolV2User = async (account, pool) => {
  const callsErc = [
    {
      address: pool.stakingToken.address,
      name: 'allowance',
      params: [account, pool.contractAddress],
    },
    {
      address: pool.stakingToken.address,
      name: 'balanceOf',
      params: [account],
    },
  ]

  const callsEarningTokensBalance = pool.earningTokens.map((earningToken) => ({
    address: earningToken.address,
    name: 'balanceOf',
    params: [account],
  }))

  const callsSousChef = [
    {
      address: pool.contractAddress,
      name: 'userInfo',
      params: [account],
    },
    {
      address: pool.contractAddress,
      name: 'pendingReward',
      params: [account],
    },
  ]

  const [[allowance], tokenBalance, ...earningBalance] = await multicall(erc20Abi, [
    ...callsErc,
    ...callsEarningTokensBalance,
  ])

  const [balances, earnings] = await multicall(pool.blockPeriod ? sousChefV3Abi : sousChefV2Abi, callsSousChef)

  return {
    allowance: new BigNumber(allowance._hex).toJSON(),
    stakingTokenBalance: new BigNumber(tokenBalance).toJSON(),
    earningsTokenBalance: earningBalance.map((earningsTokenBalance) =>
      new BigNumber(earningsTokenBalance.balance._hex).toJSON(),
    ),
    earnings: earnings[0].map((earning) => new BigNumber(earning._hex).toJSON()),
    stakedBalance: new BigNumber(balances.amount._hex).toJSON(),
    lastStakingBlock: balances?.lastStakingBlock?._hex ? new BigNumber(balances.lastStakingBlock._hex).toJSON() : '0',
  }
}

export const fetchPoolAllowance = async (account, pool) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, pool.stakingToken.address, 'allowance', [account, pool.contractAddress])
  return new BigNumber(res).toJSON()
}

export const fetchUserBalance = async (account, pool) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, pool.stakingToken.address, 'balanceOf', [account])

  return new BigNumber(res).toJSON()
}

export const fetchPoolUserStakeBalance = async (account, pool) => {
  const souschefContract = getSouschefContract()

  const { amount } = await callHelpers(souschefContract, pool.contractAddress, 'userInfo', [account])

  return new BigNumber(amount).toJSON()
}

export const fetchPoolUserEarning = async (account, pool) => {
  const souschefContract = getSouschefContract()

  const balance = await callHelpers(souschefContract, pool.contractAddress, 'pendingReward', [account])

  return new BigNumber(balance).toJSON()
}
