import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import battlesConfig from 'constants/battles'
import { fetchBattlesUserAllowance, fetchBattleUserAllowance } from 'store/battles/fetchUserBattle'
import { fetchFarmDragonUserDragonBalance } from 'store/farms/fetchFarmUser'

const initialState = {
  data: [...battlesConfig],
  tokenBalance: '0',
  userDataLoaded: false,
}

export const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = {
        ...action.payload,
        userDataLoaded: true,
      }
    },
    setBattlesUserData: (state, action) => {
      const { userData, userDragonBalance } = action.payload
      state.data = state.data.map((pool, index) => {
        return { ...pool, userData: userData[index] }
      })
      state.userDataLoaded = true
      state.tokenBalance = userDragonBalance
    },
    updateTokenBalance: (state, action) => {
      const { cost, earn, value } = action.payload
      new BigNumber(value).isGreaterThan(new BigNumber(state.tokenBalance))
        ? showToastSuccess('DRAGON BATTLE', `You won the battle and got ${earn} Dragon tokens!`)
        : showToastError('DRAGON BATTLE', `You lost the battle and ${cost} Dragon tokens have been burned!`)

      state.tokenBalance = value
    },
    updateBattlesUserData: (state, action) => {
      const { field, value, bid } = action.payload
      const index = state.data.findIndex((p) => p.bid === bid)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
})

export const fetchBattlesUserDataAsync = (account) => async (dispatch) => {
  const allowances = await fetchBattlesUserAllowance(account)
  const userDragonBalance = await fetchFarmDragonUserDragonBalance(account)

  const userData = battlesConfig.map((pool, index) => ({
    allowance: allowances[index],
  }))

  dispatch(
    setBattlesUserData({
      userData,
      userDragonBalance,
    }),
  )
}

export const updateUserAllowance = (bid, account, battleAddress) => async (dispatch) => {
  const allowance = await fetchBattleUserAllowance(account, battleAddress)
  dispatch(updateBattlesUserData({ bid, field: 'allowance', value: allowance }))
}

export const updateUserBalance = (account, earn, cost) => async (dispatch) => {
  const userDragonBalance = await fetchFarmDragonUserDragonBalance(account)
  dispatch(updateTokenBalance({ value: userDragonBalance, earn, cost }))
}

// Actions
export const { setUserData, setBattlesUserData, updateBattlesUserData, updateTokenBalance } = battleSlice.actions

export default battleSlice.reducer
