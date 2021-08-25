import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, START_BLOCK } from 'config/index'
import address from 'constants/contracts'
import { useEffect, useMemo, useState } from 'react'
import { useCurrentBlock } from 'store/block/hook'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getMasterChefContract } from 'utils/contractHelpers'

export const useRewardPerBlock = () => {
  const [reward, setReward] = useState(BIG_ZERO)

  useEffect(() => {
    const fetchRewardPerWeek = async () => {
      const masterChefContract = getMasterChefContract()
      const res = await callHelpers(masterChefContract, address.masterChef, 'rewardPerBlock')
      // check block
      setReward(new BigNumber(res).div(DEFAULT_TOKEN_DECIMAL))
    }

    fetchRewardPerWeek()
  }, [])

  return reward
}

export const useRewardsDistributed = () => {
  const currentBlock = useCurrentBlock()
  const rewardPerBlock = useRewardPerBlock()

  const rewardsDistributed = useMemo(() => {
    const BLOCK_FIRST_HALVING = 3265885
    const BLOCK_TWO_HALVING = 3784279
    // const firstReward = new BigNumber(BLOCK_FIRST_HALVING - START_BLOCK).times(rewardPerBlock * 4)
    // const twoReward = new BigNumber(BLOCK_TWO_HALVING - BLOCK_FIRST_HALVING - START_BLOCK).times(rewardPerBlock * 2)
    const newReward = new BigNumber(currentBlock - BLOCK_TWO_HALVING).times(rewardPerBlock)
    return newReward.plus(100000000)
  }, [currentBlock, rewardPerBlock])

  return rewardsDistributed
}
