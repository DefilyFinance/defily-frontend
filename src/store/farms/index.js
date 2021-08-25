import { createSlice } from '@reduxjs/toolkit'
import address from 'constants/contracts'
import farmsConfig from 'constants/farms'
import fetchFarm from 'store/farms/fetchFarm'
import {
  fetchFarmUserAllowance,
  fetchFarmUserAllowances,
  fetchFarmUserEarning,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalance,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalance,
  fetchFarmUserTokenBalances,
} from 'store/farms/fetchFarmUser'
import { setPricesData } from 'store/prices/index'

const initialState = {
  data: farmsConfig,
  userDataLoaded: false,
}

export const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    setFarmsData: (state, action) => {
      const liveFarmsData = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((entry) => entry.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((farm) => {
        const userFarmData = userData.find((entry) => entry.pid === farm.pid)
        return { ...farm, userData: userFarmData }
      })
      state.userDataLoaded = true
    },
    updateFarmsUserData: (state, action) => {
      const { field, value, pid } = action.payload
      const index = state.data.findIndex((p) => p.pid === pid)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
    setUserData: (state, action) => {
      state.userData[action.payload.pid] = {
        ...state.userData[action.payload.pid],
        userDataLoaded: true,
        ...action.payload,
      }
    },
  },
})

// async action

export const fetchFarmsDataAsync = (prices) => async (dispatch) => {
  try {
    const res = await fetchFarm(prices)
    dispatch(setFarmsData(res.farms))
    dispatch(setPricesData(res.prices))
  } catch (error) {
    console.log(error)
  }
}

export const fetchFarmUserDataAsync = (account) => async (dispatch) => {
  const promise = [
    fetchFarmUserAllowances(account, farmsConfig, address.masterChef),
    fetchFarmUserTokenBalances(account, farmsConfig),
    fetchFarmUserStakedBalances(account, farmsConfig, address.masterChef),
    fetchFarmUserEarnings(account, farmsConfig, address.masterChef),
  ]

  const response = await Promise.all(promise)

  const allowances = response?.[0]
  const stakingTokenBalances = response?.[1]
  const stakedBalances = response?.[2]
  const earningsBalances = response?.[3]

  const userData = farmsConfig.map((farm, index) => ({
    pid: farm.pid,
    allowance: allowances[index],
    stakingTokenBalance: stakingTokenBalances[index],
    stakedBalance: stakedBalances[index],
    earnings: earningsBalances[index],
  }))

  dispatch(setFarmsUserData(userData))
}

export const updateUserAllowance = (account, pid) => async (dispatch) => {
  const farm = farmsConfig.find((farm) => farm.pid === pid)
  const allowance = await fetchFarmUserAllowance(account, farm.lpAddress, address.masterChef)
  dispatch(updateFarmsUserData({ pid: farm.pid, field: 'allowance', value: allowance }))
}

export const updateUserStakingBalance = (account, pid) => async (dispatch) => {
  const farm = farmsConfig.find((farm) => farm.pid === pid)
  const tokenBalance = await fetchFarmUserTokenBalance(account, farm.lpAddress)
  dispatch(updateFarmsUserData({ pid: farm.pid, field: 'stakingTokenBalance', value: tokenBalance }))
}

export const updateUserStakedBalance = (account, pid) => async (dispatch) => {
  const farm = farmsConfig.find((farm) => farm.pid === pid)
  const stakedBalance = await fetchFarmUserStakedBalance(account, farm.pid, address.masterChef)
  dispatch(updateFarmsUserData({ pid: farm.pid, field: 'stakedBalance', value: stakedBalance }))
}

export const updateUserEarningsBalance = (account, pid) => async (dispatch) => {
  const earnings = await fetchFarmUserEarning(account, pid, address.masterChef)
  dispatch(updateFarmsUserData({ pid: pid, field: 'earnings', value: earnings }))
}

// Actions
export const { setFarmsData, setFarmsUserData, updateFarmsUserData } = farmsSlice.actions
export default farmsSlice.reducer
