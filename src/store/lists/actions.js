import { createAction } from '@reduxjs/toolkit'

export const fetchTokenList = {
  pending: createAction('lists/fetchTokenList/pending'),
  fulfilled: createAction('lists/fetchTokenList/fulfilled'),
  rejected: createAction('lists/fetchTokenList/rejected'),
}
// add and remove from list options
export const addList = createAction('lists/addList')
export const removeList = createAction('lists/removeList')

// select which lists to search across from loaded lists
export const enableList = createAction('lists/enableList')
export const disableList = createAction('lists/disableList')

// versioning
export const acceptListUpdate = createAction('lists/acceptListUpdate')
export const rejectVersionUpdate = createAction('lists/rejectVersionUpdate')
export const selectList = createAction('lists/selectList')
