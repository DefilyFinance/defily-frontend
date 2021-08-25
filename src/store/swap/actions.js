import { createAction } from '@reduxjs/toolkit'

export const Field = {
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
}

export const selectCurrency = createAction('swap/selectCurrency')
export const switchCurrencies = createAction('swap/switchCurrencies')
export const typeInput = createAction('swap/typeInput')
export const replaceSwapState = createAction('swap/replaceSwapState')
export const setRecipient = createAction('swap/setRecipient')
