import { createAction } from '@reduxjs/toolkit'

export const Field = {
  LIQUIDITY_PERCENT: 'LIQUIDITY_PERCENT',
  LIQUIDITY: 'LIQUIDITY',
  CURRENCY_A: 'CURRENCY_A',
  CURRENCY_B: 'CURRENCY_B',
}

export const typeInput = createAction('burn/typeInputBurn')
