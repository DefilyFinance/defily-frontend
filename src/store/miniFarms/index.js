import { createSlice } from '@reduxjs/toolkit'
import miniFarmsConfig, { FIELD } from 'constants/miniFarms'
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
import fetchFarm from 'store/miniFarms/fetchFarm'
import { setPricesData } from 'store/prices/index'

const initialState = {
  data: miniFarmsConfig,
  userDataLoaded: false,
}

export const miniFarmsSlice = createSlice({
  name: 'miniFarms',
  initialState,
  reducers: {
    setFarmsData: (state, action) => {
      state.data = {
        [FIELD.LTD]: {
          ...state.data[FIELD.LTD],
          farmsConfig: state.data[FIELD.LTD].farmsConfig.map((farm) => {
            const liveFarmData = action.payload[FIELD.LTD].find((entry) => entry.pid === farm.pid)
            return { ...farm, ...liveFarmData }
          }),
        },
        [FIELD.CHAT]: {
          ...state.data[FIELD.CHAT],
          farmsConfig: state.data[FIELD.CHAT].farmsConfig.map((farm) => {
            const liveFarmData = action.payload[FIELD.CHAT].find((entry) => entry.pid === farm.pid)
            return { ...farm, ...liveFarmData }
          }),
        },
      }
    },
    setFarmsUserData: (state, action) => {
      const userData = action.payload.userData
      const nameFarm = action.payload.nameFarm
      state.data[nameFarm].farmsConfig = state.data[nameFarm].farmsConfig.map((farm) => {
        const userFarmData = userData.find((entry) => entry.pid === farm.pid)
        return { ...farm, userData: userFarmData }
      })
      state.data[nameFarm].userDataLoaded = true
    },
    updateFarmsUserData: (state, action) => {
      const { field, value, pid, nameFarm } = action.payload
      const index = state.data[nameFarm].farmsConfig.findIndex((p) => p.pid === pid)

      if (index >= 0) {
        state.data[nameFarm].farmsConfig[index] = {
          ...state.data[nameFarm].farmsConfig[index],
          userData: { ...state.data[nameFarm].farmsConfig[index].userData, [field]: value },
        }
      }
    },
  },
})

// async action

export const fetchMiniFarmsDataAsync = (prices) => async (dispatch) => {
  try {
    const res = await fetchFarm(prices)
    dispatch(
      setFarmsData({
        [FIELD.LTD]: res[0].farms,
        [FIELD.CHAT]: res[1].farms,
      }),
    )
    dispatch(
      setPricesData({
        ...res[0].prices,
        ...res[1].prices,
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

export const fetchMiniFarmUserDataAsync = (account, farmsConfig, contractAddress, nameFarm) => async (dispatch) => {
  const promise = [
    fetchFarmUserAllowances(account, farmsConfig, contractAddress),
    fetchFarmUserTokenBalances(account, farmsConfig),
    fetchFarmUserStakedBalances(account, farmsConfig, contractAddress),
    fetchFarmUserEarnings(account, farmsConfig, contractAddress),
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

  dispatch(setFarmsUserData({ userData, nameFarm }))
}

export const updateUserAllowance = (account, pid, nameFarm) => async (dispatch) => {
  const farm = miniFarmsConfig[nameFarm].farmsConfig.find((farm) => farm.pid === pid)
  const allowance = await fetchFarmUserAllowance(account, farm.lpAddress, miniFarmsConfig[nameFarm].contractAddress)
  dispatch(updateFarmsUserData({ pid: farm.pid, field: 'allowance', value: allowance, nameFarm }))
}

export const updateUserStakingBalance = (account, pid, nameFarm) => async (dispatch) => {
  const farm = miniFarmsConfig[nameFarm].farmsConfig.find((farm) => farm.pid === pid)
  const tokenBalance = await fetchFarmUserTokenBalance(account, farm.lpAddress)
  dispatch(updateFarmsUserData({ pid: farm.pid, field: 'stakingTokenBalance', value: tokenBalance, nameFarm }))
}

export const updateUserStakedBalance = (account, pid, nameFarm) => async (dispatch) => {
  const farm = miniFarmsConfig[nameFarm].farmsConfig.find((farm) => farm.pid === pid)
  const stakedBalance = await fetchFarmUserStakedBalance(account, farm.pid, miniFarmsConfig[nameFarm].contractAddress)
  dispatch(updateFarmsUserData({ pid: farm.pid, field: 'stakedBalance', value: stakedBalance, nameFarm }))
}

export const updateUserEarningsBalance = (account, pid, nameFarm) => async (dispatch) => {
  const earnings = await fetchFarmUserEarning(account, pid, miniFarmsConfig[nameFarm].contractAddress)
  dispatch(updateFarmsUserData({ pid: pid, field: 'earnings', value: earnings, nameFarm }))
}

// Actions
export const { setFarmsData, setFarmsUserData, updateFarmsUserData } = miniFarmsSlice.actions
export default miniFarmsSlice.reducer
