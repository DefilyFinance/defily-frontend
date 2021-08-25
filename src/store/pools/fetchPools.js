import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import { poolsSousChefConfig } from 'constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getSouschefContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

import sousChefABI from 'config/abi/sousChef.json'
import wkaiAbi from 'config/abi/weth.json'
import defilyAbi from 'config/abi/defily.json'

export const fetchPoolsBlockLimits = async () => {
  const callsStartBlock = poolsSousChefConfig.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsSousChefConfig.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)

  return poolsSousChefConfig.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  const nonKaiPools = poolsSousChefConfig.filter((p) => p.stakingToken.symbol !== 'KAI')
  const kaiPool = poolsSousChefConfig.filter((p) => p.stakingToken.symbol === 'KAI')

  const callsNonKaiPools = nonKaiPools.map((poolConfig) => {
    return {
      address: poolConfig.stakingToken.address,
      name: 'balanceOf',
      params: [poolConfig.contractAddress],
    }
  })

  const callsKaiPools = nonKaiPools.map((poolConfig) => {
    return {
      address: address.wKai,
      name: 'balanceOf',
      params: [poolConfig.contractAddress],
    }
  })

  const nonKaiPoolsTotalStaked = await multicall(defilyAbi, callsNonKaiPools)
  const kaiPoolsTotalStaked = await multicall(wkaiAbi, callsKaiPools)

  return [
    ...nonKaiPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonKaiPoolsTotalStaked[index]).toJSON(),
    })),
    ...kaiPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(kaiPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}

export const fetchPoolsTokenPerBlock = async () => {
  const calls = poolsSousChefConfig.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'rewardPerBlock',
    }
  })

  const poolsTokenPerBlock = await multicall(sousChefABI, calls)

  return [
    ...poolsSousChefConfig.map((p, index) => ({
      sousId: p.sousId,
      tokenPerBlock: new BigNumber(poolsTokenPerBlock[index]).toJSON(),
    })),
  ]
}

export const fetchPoolStakingLimit = async (sousId) => {
  try {
    const sousContract = getSouschefContract()
    const config = poolsSousChefConfig.find((pool) => pool.sousId === sousId)

    const stakingLimit = await callHelpers(sousContract, config.contractAddress, 'poolLimitPerUser')

    return new BigNumber(stakingLimit)
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchPoolsStakingLimits = async (poolsWithStakingLimit) => {
  const validPools = poolsSousChefConfig
    .filter((p) => p.stakingToken.symbol !== 'KAI' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 castles do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) => fetchPoolStakingLimit(validPool.sousId))
  const stakingLimits = await Promise.all(stakingLimitPromises)

  return stakingLimits.reduce((accum, stakingLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    }
  }, {})
}
