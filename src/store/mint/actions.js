import { createAction } from '@reduxjs/toolkit'

export const Field = {
  CURRENCY_A: 'CURRENCY_A',
  CURRENCY_B: 'CURRENCY_B',
}

export const typeInput = createAction('mint/typeInputMint')
export const resetMintState = createAction('mint/resetMintState')
