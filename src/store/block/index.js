import { createSlice } from '@reduxjs/toolkit'

const initialState = { currentBlock: 0, initialBlock: 0 }

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlock: (state, action) => {
      if (state.initialBlock === 0) {
        state.initialBlock = action.payload
      }

      state.currentBlock = action.payload
    },
  },
})

// Actions
export const { setBlock } = blockSlice.actions

export default blockSlice.reducer
