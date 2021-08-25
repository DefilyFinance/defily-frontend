import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  walletConnect: false,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleWalletConnect: (state) => {
      state.walletConnect = !state.walletConnect
    },
  },
})

export const { toggleWalletConnect, toggleGuideVideo } = modalSlice.actions

export default modalSlice.reducer
