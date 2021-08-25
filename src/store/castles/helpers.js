import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

export const transformUserData = (pool, userData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    earnings: userData
      ? userData?.earnings?.map((earning) => new BigNumber(earning))
      : pool?.earningTokens?.map((_) => BIG_ZERO),
    lastStakingBlock: userData ? +userData.lastStakingBlock : 0,
  }
}

export const transformPool = (pool) => {
  const { totalStaked, stakingLimit, poolLimit, ...rest } = pool

  return {
    ...rest,
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    poolLimit: new BigNumber(poolLimit),
    userData: transformUserData(pool, pool.userData),
  }
}
