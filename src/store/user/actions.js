import { createAction } from '@reduxjs/toolkit'

export const updateUserExpertMode = createAction('user/updateUserExpertMode')
export const updateUserSingleHopOnly = createAction('user/updateUserSingleHopOnly')
export const updateUserSlippageTolerance = createAction('user/updateUserSlippageTolerance')
export const updateUserDeadline = createAction('user/updateUserDeadline')
export const addSerializedToken = createAction('user/addSerializedToken')
export const removeSerializedToken = createAction('user/removeSerializedToken')
export const addSerializedPair = createAction('user/addSerializedPair')
export const removeSerializedPair = createAction('user/removeSerializedPair')

export const toggleTheme = createAction('user/toggleTheme')
export const updateUserStakedOnly = createAction('user/updateUserStakedOnly')
