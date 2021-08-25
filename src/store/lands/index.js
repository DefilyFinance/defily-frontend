import { createSlice } from '@reduxjs/toolkit'
import configLands from 'constants/lands'
import {
  fetchBalanceHolders,
  fetchDragonUserBalance,
  fetchInvestmentBalances,
  fetchLandUserAllowances,
  fetchLandUserStakedBalances,
  fetchLandUserStakingTokenBalance,
  fetchLandUserTokenBalance,
  fetchBalanceIdo,
  fetchTotalCollectedIdo,
  fetchTotalInvestorsCount,
} from 'store/lands/fetchLandUser'
import { getBalanceNumber } from '../../utils/formatBalance'

const initialState = {
  data: configLands,
  userDataLoaded: false,
}

export const landsSlice = createSlice({
  name: 'lands',
  initialState,
  reducers: {
    setLandsPublicData: (state, action) => {
      const liveLandsData = action.payload
      state.data = state.data.map((vault) => {
        const liveLandData = liveLandsData.find((entry) => entry.idoId === vault.idoId)
        return { ...vault, ...liveLandData }
      })
    },
    setLandsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((land) => {
        if (userData.idoId === land.idoId) {
          return { ...land, userData }
        }
        return land
      })
      state.userDataLoaded = true
    },
    updateLandUserData: (state, action) => {
      const { field, value, idoId } = action.payload
      const index = state.data.findIndex((p) => p.idoId === idoId)

      if (index >= 0) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload,
          userData: { ...state.data[index].userData, [field]: value },
        }
      }
    },
  },
})

// async action
export const fetchLandsPublicDataAsync = (lands) => async (dispatch) => {
  try {
    const promise = lands?.map(async (land) => {
      if (land?.notComplete) return land
      const promise = [
        fetchBalanceHolders(land),
        fetchBalanceIdo(land),
        fetchTotalCollectedIdo(land),
        fetchTotalInvestorsCount(land),
      ]

      const res = await Promise.all(promise)
      const balanceHolders = res?.[0]
      const idoBalances = res?.[1]
      const totalCollecteds = res?.[2]?.map((item, i) => land?.options?.data?.[i]?.idoContract?.totalCollected || item)
      const totalInvestors = res?.[3]
      let totalBalance = 0
      let holders = 0
      balanceHolders?.map((balanceHolder, i) => {
        const balance = getBalanceNumber(balanceHolder, land.stakingToken.decimals)
        holders +=
          land?.options?.data?.[i]?.poolContract?.stakingCount ||
          balance / land?.options?.data?.[i]?.poolContract?.stakingRequire
        totalBalance += balance
      })
      return {
        ...land,
        participants: {
          balanceHolders,
          totalBalance,
          holders,
          isLoaded: true,
        },
        idoBalances,
        totalCollecteds,
        totalInvestors,
      }
    })
    const dataLands = await Promise.all(promise)
    dispatch(setLandsPublicData(dataLands))
  } catch (err) {}
}

export const fetchLandDataAsync = (land) => async (dispatch) => {
  try {
    if (land?.notComplete) return
    const promise = [
      fetchBalanceHolders(land),
      fetchBalanceIdo(land),
      fetchTotalCollectedIdo(land),
      fetchTotalInvestorsCount(land),
    ]

    const res = await Promise.all(promise)
    const balanceHolders = res?.[0]
    const idoBalances = res?.[1]
    const totalCollecteds = res?.[2]?.map((item, i) => land?.options?.data?.[i]?.idoContract?.totalCollected || item)
    const totalInvestors = res?.[3]
    let totalBalance = 0
    let holders = 0
    const options = land?.options?.data || []
    balanceHolders?.map((balanceHolder, i) => {
      const balance = getBalanceNumber(balanceHolder, land.stakingToken.decimals)
      holders +=
        options?.[i]?.poolContract?.stakingCount || balance / land?.options?.data?.[i]?.poolContract?.stakingRequire
      totalBalance += balance
    })
    dispatch(
      updateLandUserData({
        ...land,
        participants: {
          balanceHolders,
          totalBalance,
          holders,
          isLoaded: true,
        },
        idoBalances,
        totalCollecteds,
        totalInvestors,
      }),
    )
  } catch (error) {}
}

export const fetchLandUserDataAsync = (account, pool) => async (dispatch) => {
  if (pool?.notComplete) return
  const promise = [
    // pool
    fetchLandUserAllowances(account, pool),
    fetchLandUserStakedBalances(account, pool),
    fetchLandUserStakingTokenBalance(account, pool),
    fetchLandUserTokenBalance(account),
    fetchDragonUserBalance(account),
    // ido
    fetchInvestmentBalances(account, pool),
  ]
  const response = await Promise.all(promise)

  dispatch(
    setLandsUserData({
      idoId: pool.idoId,
      allowances: response?.[0],
      stakedBalances: response?.[1],
      stakingTokenBalance: response?.[2],
      tokenBalance: response?.[3],
      dragonBalance: response?.[4],
      idoData: response?.[5],
      userDataLoaded: true,
    }),
  )
}

export const updateUserAllowances = (account, pool) => async (dispatch) => {
  const allowance = await fetchLandUserAllowances(account, pool)
  dispatch(updateLandUserData({ idoId: pool.idoId, field: 'allowances', value: allowance }))
}

export const updateUserStakedBalance = (account, pool) => async (dispatch) => {
  const stakedBalances = await fetchLandUserStakedBalances(account, pool)
  dispatch(updateLandUserData({ idoId: pool.idoId, field: 'stakedBalances', value: stakedBalances }))
}

// Actions
export const { setLandsPublicData, setLandsUserData, updateLandUserData } = landsSlice.actions
export default landsSlice.reducer
