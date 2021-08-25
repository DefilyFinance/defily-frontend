import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

export const transformLand = (pool) => {
  const { stakingLimit, userData, ...rest } = pool

  return {
    ...rest,
    stakingLimit: new BigNumber(stakingLimit),
    userData: transformUserData(userData),
  }
}

export const transformUserData = (userData) => {
  return {
    allowances: userData
      ? userData?.allowances?.map((allowance) => new BigNumber(allowance))
      : // eslint-disable-next-line no-unused-vars
        userData?.allowances.map((_) => BIG_ZERO),
    tokenBalance: userData ? new BigNumber(userData.tokenBalance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalances: userData
      ? userData?.stakedBalances?.map((stakedBalance) => new BigNumber(stakedBalance))
      : // eslint-disable-next-line no-unused-vars
        userData?.stakedBalances.map((_) => BIG_ZERO),
  }
}
