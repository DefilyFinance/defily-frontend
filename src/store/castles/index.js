import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import castlesConfig, { castlesV2Config } from 'constants/castles'
import { fetchPoolsLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from 'store/castles/fetchPools'
import {
  fetchPoolUser,
  fetchPoolUserAllowances,
  fetchPoolUserEarnings,
  fetchPoolUserStakedBalances,
  fetchPoolUserTokenBalances,
  fetchPoolV2User,
} from 'store/castles/fetchPoolsUser'
import { getPoolApr, getPoolAprV2 } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'
import { getPrices } from 'utils/priceHelpers'

const initUserData = {
  allowance: '0',
  tokenBalance: '0',
  stakedBalance: '0',
  earnings: '0',
  earningsTokenBalance: '0',
}

const initialState = {
  data: [...castlesConfig, ...castlesV2Config],
  userDataLoaded: false,
  userData: {},
}

export const castlesSlice = createSlice({
  name: 'castles',
  initialState,
  reducers: {
    setCastlesPublicData: (state, action) => {
      const livePoolsData = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userFarmData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userFarmData }
      })
      state.userDataLoaded = true
    },
    setUserData: (state, action) => {
      state.userData[action.payload.sousId] = {
        ...state.userData[action.payload.sousId],
        userDataLoaded: true,
        ...action.payload,
      }
    },
  },
})

// async action

export const fetchCastlesPublicDataAsync = (currentBlock) => async (dispatch, getState) => {
  const totalStakings = await fetchPoolsTotalStaking(castlesConfig)

  const prices = getState()?.prices?.data || (await getPrices())

  const liveData = castlesConfig.map((pool) => {
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    const tokenPerBlock = pool?.tokenPerBlock
    const isPoolEndBlockExceeded = currentBlock > 0 && currentBlock > Number(pool.endBlock)
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
      ...totalStaking,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      stakedTvl,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setCastlesPublicData(liveData))
}

export const fetchCastlesV2PublicDataAsync = (currentBlock) => async (dispatch, getState) => {
  const totalStakings = await fetchPoolsTotalStaking(castlesV2Config)
  const prices = getState()?.prices?.data || (await getPrices())

  const liveData = castlesV2Config.map((pool) => {
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    const tokensPerBlock = pool?.tokensPerBlock
    const isPoolEndBlockExceeded = currentBlock > 0 && currentBlock > Number(pool.endBlock)
    const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

    const stakingTokenPrice = getParameterCaseInsensitive(prices, pool.stakingToken.address) || 0

    const earningTokensPrice = pool.earningTokens.map(
      (earningToken) => getParameterCaseInsensitive(prices, earningToken.address) || 0,
    )

    const apr = !isPoolFinished
      ? getPoolAprV2(
          stakingTokenPrice,
          earningTokensPrice,
          getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
          tokensPerBlock,
          pool.earningTokens,
        )
      : 0

    const stakedTvl =
      pool.sousId === 22
        ? new BigNumber(0.100181494773760107).times(new BigNumber(stakingTokenPrice)).toJSON()
        : new BigNumber(new BigNumber(totalStaking.totalStaked).div(BIG_TEN.pow(pool.stakingToken.decimals)))
            .times(new BigNumber(stakingTokenPrice))
            .toJSON()

    return {
      ...totalStaking,
      stakingTokenPrice,
      earningTokensPrice,
      apr,
      stakedTvl,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setCastlesPublicData(liveData))
}

export const fetchCastlesStakingLimitsAsync = () => async (dispatch, getState) => {
  try {
    const poolsWithStakingLimit = getState()
      .castles.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
      .map((pool) => pool.sousId)

    const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)
    const poolLimits = await fetchPoolsLimits()

    const stakingLimitData = [...castlesConfig, ...castlesV2Config].map((pool) => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId }
      }
      const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
      const poolLimit = poolLimits[pool.sousId] || BIG_ZERO
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
        poolLimit: poolLimit.toJSON(),
      }
    })

    dispatch(setCastlesPublicData(stakingLimitData))
  } catch (e) {
    console.log(e)
  }
}

export const fetchCastlesUserDataAsync = (account) => async (dispatch) => {
  try {
    const promise = [
      fetchPoolUserAllowances(account, castlesV2Config),
      fetchPoolUserTokenBalances(account, castlesV2Config),
      fetchPoolUserStakedBalances(account, castlesV2Config),
      fetchPoolUserEarnings(account, castlesV2Config),
    ]
    const response = await Promise.all(promise)

    const allowances = response?.[0]
    const stakingTokenBalances = response?.[1]
    const balances = response?.[2]
    const earnings = response?.[3]

    const userData = castlesV2Config.map((vault, index) => {
      const balance = balances.find((balance) => balance.sousId === vault.sousId)

      return {
        sousId: vault.sousId,
        allowance: allowances[index],
        stakingTokenBalance: stakingTokenBalances[index],
        stakedBalance: balance?.stakedBalance,
        lastStakingBlock: balance?.lastStakingBlock,
        earnings: earnings[index],
      }
    })

    dispatch(setPoolsUserData(userData))
  } catch (e) {
    console.log(e)
  }
}

export const fetchCastleUserDataAsync = (account, pool) => async (dispatch) => {
  try {
    let res = {}
    if (pool.isV2) {
      res = await fetchPoolV2User(account, pool)
    } else {
      res = await fetchPoolUser(account, pool)
    }

    dispatch(
      setUserData({
        sousId: pool.sousId,
        ...res,
      }),
    )
  } catch (e) {
    dispatch(
      setUserData({
        sousId: pool.sousId,
        ...initUserData,
      }),
    )
  }
}

// Actions
export const { setCastlesPublicData, setUserData, setPoolsUserData } = castlesSlice.actions
export default castlesSlice.reducer
