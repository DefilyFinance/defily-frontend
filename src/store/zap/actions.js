import { createAction } from '@reduxjs/toolkit'

// export const Field = {
//   CURRENCY_A: 'CURRENCY_A',
//   PAIR_B: 'PAIR_B',
// }

export const Field = {
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
}

export const ZAP_FLOW = {
  CURRENCY_OUTPUT: 'CURRENCY_OUTPUT',
  PAIR_OUTPUT: 'PAIR_OUTPUT',
}

export const typeInput = createAction('zap/typeInputZap')
export const switchZapFlow = createAction('zap/switchZapFlow')
export const resetZapState = createAction('zap/resetZapState')
export const selectCurrency = createAction('zap/selectCurrency')
export const replaceZapState = createAction('zap/replaceZapState')
