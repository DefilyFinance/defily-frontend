import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { poolsSousChefConfig } from 'constants/pools'
import {
  fetchPoolsBlockLimits,
  fetchPoolsStakingLimits,
  fetchPoolsTokenPerBlock,
  fetchPoolsTotalStaking,
} from 'store/pools/fetchPools'
import fetchFarms from 'store/pools/fetchFarms'
import { setPricesData } from 'store/prices/index'
import { getPoolApr } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'
import { getPrices } from 'utils/priceHelpers'

const initialState = {
  farms: [],
  pools: [...poolsSousChefConfig],
}

export const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      state.farms = action.payload
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData = action.payload
      state.pools = state.pools.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
  },
})

export const fetchPoolsDataAsync = (prices) => async (dispatch) => {
  try {
    const res = await fetchFarms(prices)
    const farms = [...res[0].farms, ...res[1].farms]
    const newPrices = {
      ...res[0].prices,
      ...res[1].prices,
    }

    dispatch(setFarmsPublicData(farms))
    dispatch(setPricesData(newPrices))
  } catch (error) {
    console.log(error)
  }
}

export const fetchPoolsSouschefPublicDataAsync = (currentBlock) => async (dispatch, getState) => {
  const promise = [fetchPoolsBlockLimits(), fetchPoolsTotalStaking(), fetchPoolsTokenPerBlock()]
  const response = await Promise.all(promise)

  const blockLimits = response?.[0]
  const totalStakings = response?.[1]
  const poolsTokenPerBlock = response?.[2]

  const prices = getState()?.prices?.data || (await getPrices())

  const liveData = poolsSousChefConfig.map((pool) => {
    const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    const tokenPerBlock = poolsTokenPerBlock.find((entry) => entry.sousId === pool.sousId)?.tokenPerBlock
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
    const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

    const stakingTokenPrice = getParameterCaseInsensitive(prices, pool.stakingToken.address) || 0

    const earningTokenPrice = getParameterCaseInsensitive(prices, pool.earningToken.address) || 0

    const apr = !isPoolFinished
      ? getPoolApr(
          stakingTokenPrice,
          earningTokenPrice,
          getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
          parseFloat(tokenPerBlock),
          pool.earningToken.decimals,
        )
      : 0

    const stakedTvl = new BigNumber(
      new BigNumber(totalStaking.totalStaked).div(BIG_TEN.pow(pool.stakingToken.decimals)),
    )
      .times(new BigNumber(stakingTokenPrice))
      .toJSON()

    return {
      ...blockLimit,
      ...totalStaking,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      stakedTvl,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setPoolsPublicData(liveData))
}

export const fetchPoolsSouschefStakingLimitsAsync = () => async (dispatch, getState) => {
  try {
    const poolsWithStakingLimit = getState()
      .pools.pools.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
      .map((pool) => pool.sousId)

    const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)

    const stakingLimitData = poolsSousChefConfig.map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
      }
    })

    dispatch(setPoolsPublicData(stakingLimitData))
  } catch (e) {
    console.log(e)
  }
}

// Actions
export const { setFarmsPublicData, setPoolsPublicData } = poolsSlice.actions
export default poolsSlice.reducer
