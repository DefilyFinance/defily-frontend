import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import castlesConfig, { castlesV2Config } from 'constants/castles'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getSouschefContract, getSouschefV2Contract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

import sousChefABI from 'config/abi/sousChef.json'
import sousChefV2ABI from 'config/abi/sousChefV2.json'
import wkaiAbi from 'config/abi/weth.json'
import defilyAbi from 'config/abi/defily.json'

export const fetchPoolsBlockLimits = async (pools) => {
  const callsStartBlock = pools.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'startBlock',
    }
  })
  const callsEndBlock = pools.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)

  return pools.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async (pools) => {
  const nonKaiPools = pools.filter((p) => p.stakingToken.symbol !== 'KAI')
  const kaiPool = pools.filter((p) => p.stakingToken.symbol === 'KAI')

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
  const calls = castlesConfig.map((poolConfig) => {
    return {
      address: poolConfig.contractAddress,
      name: 'rewardPerBlock',
    }
  })

  const poolsTokenPerBlock = await multicall(sousChefABI, calls)

  return [
    ...castlesConfig.map((p, index) => ({
      sousId: p.sousId,
      tokenPerBlock: new BigNumber(poolsTokenPerBlock[index]).toJSON(),
    })),
  ]
}

export const fetchPoolsV2TokenPerBlock = async () => {
  const poolsTokensPerBlock = await Promise.all(
    castlesV2Config.map(async (poolConfig) => {
      const calls = poolConfig.earningTokens.map((token) => ({
        address: poolConfig.contractAddress,
        name: 'rewardPerBlock',
        params: [token.address],
      }))

      const rewardPerBlocks = await multicall(sousChefV2ABI, calls)
      return rewardPerBlocks
    }),
  )

  return [
    ...castlesV2Config.map((p, index) => ({
      sousId: p.sousId,
      tokensPerBlock: poolsTokensPerBlock[index].map((balance) => new BigNumber(balance).toJSON()),
    })),
  ]
}

export const fetchPoolStakingLimit = async (sousId) => {
  try {
    const sousContract = getSouschefContract()
    const config = [...castlesConfig, ...castlesV2Config].find((pool) => pool.sousId === sousId)

    const stakingLimit = await callHelpers(sousContract, config.contractAddress, 'poolLimitPerUser')
    return new BigNumber(stakingLimit)
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchPoolsStakingLimits = async (poolsWithStakingLimit) => {
  const validPools = [...castlesConfig, ...castlesV2Config]
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

export const fetchPoolLimit = async (sousId) => {
  try {
    const sousContract = getSouschefV2Contract()
    const config = castlesV2Config.find((pool) => pool.sousId === sousId)

    const stakingLimit = await callHelpers(sousContract, config.contractAddress, 'poolCap')
    return new BigNumber(stakingLimit)
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchPoolsLimits = async () => {
  const validPools = [...castlesV2Config].filter((p) => p.stakingToken.symbol !== 'KAI' && !p.isFinished)

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 castles do not have "poolLimitPerUser" and will throw an error
  const poolLimitPromises = validPools.map((validPool) => fetchPoolLimit(validPool.sousId))
  const poolLimits = await Promise.all(poolLimitPromises)

  return poolLimits.reduce((accum, poolLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: poolLimit,
    }
  }, {})
}
