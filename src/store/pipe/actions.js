import { createAction } from '@reduxjs/toolkit'

export const Field = {
  PAIR_A: 'PAIR_A',
  PAIR_B: 'PAIR_B',
}

export const typeInput = createAction('pipe/typeInputPipe')
export const resetPipeState = createAction('pipe/resetPipeState')
