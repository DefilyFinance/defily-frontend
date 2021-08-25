import { createSlice } from '@reduxjs/toolkit'
import { getPrices } from 'utils/priceHelpers'

const initialState = {
  data: null,
}

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    setPricesData: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      }
    },
  },
})

// async action

export const fetchPricesDataAsync = () => async (dispatch) => {
  try {
    const prices = await getPrices()

    dispatch(setPricesData(prices))
  } catch (error) {}
}

// Actions
export const { setPricesData } = pricesSlice.actions
export default pricesSlice.reducer
