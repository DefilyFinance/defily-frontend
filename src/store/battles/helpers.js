import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

export const transformBattleUserData = (userData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
  }
}
