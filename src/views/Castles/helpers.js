import { KAI_BLOCK_TIME } from 'config/index'

const MANUAL_POOL_COMPOUND_FREQUENCY = 1

export const getAprData = (pool) => {
  const { earningTokenPrice, apr } = pool
  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  const isHighValueToken = Math.round(earningTokenPrice / 1000) > 0
  const roundingDecimals = isHighValueToken ? 4 : 2

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const compoundFrequency = MANUAL_POOL_COMPOUND_FREQUENCY

  return { apr, isHighValueToken, roundingDecimals, compoundFrequency }
}

export const getPoolBlockInfo = (pool, currentBlock) => {
  const { startBlock, endBlock, isFinished } = pool
  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const duration = Math.max(endBlock - startBlock, 0)
  const durationDisplay = Number.isNaN((duration * KAI_BLOCK_TIME) / 86400) ? 0 : (duration * KAI_BLOCK_TIME) / 86400
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
  const blocksToDisplay = hasPoolStarted ? blocksRemaining : blocksUntilStart
  return {
    shouldShowBlockCountdown,
    blocksUntilStart,
    blocksRemaining,
    hasPoolStarted,
    blocksToDisplay,
    durationDisplay,
  }
}

export const getPoolBlockInfoStake = (pool, currentBlock) => {
  const { stakingBlock, stakingEndBlock, unStakingBlock, isFinished } = pool
  const shouldShowBlockCountdown = Boolean(stakingBlock && stakingEndBlock && !isFinished)
  const blocksUntilStake = Math.max(stakingBlock - currentBlock, 0)
  const blocksRemaining = Math.max(stakingEndBlock - currentBlock, 0)
  const hasPoolStaked = blocksUntilStake === 0 && blocksRemaining > 0
  const blocksToDisplay = hasPoolStaked ? blocksRemaining : blocksUntilStake

  const shouldShowBlockCountdownUnStaking = Boolean(
    unStakingBlock && currentBlock < unStakingBlock && stakingBlock !== unStakingBlock,
  )
  const blocksUntilUnStaking = Math.max(unStakingBlock - currentBlock, 0)

  return {
    shouldShowBlockCountdown,
    blocksUntilStake,
    blocksRemaining,
    hasPoolStaked,
    blocksToDisplay,
    shouldShowBlockCountdownUnStaking,
    blocksUntilUnStaking,
  }
}
