import { createReducer } from '@reduxjs/toolkit'
import {
  Field,
  resetZapState,
  typeInput,
  selectCurrency,
  ZAP_FLOW,
  switchZapFlow,
  replaceZapState,
} from 'store/zap/actions'

const initialState = {
  flow: ZAP_FLOW.PAIR_OUTPUT,
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
    pairId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
    pairId: '',
  },
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      replaceZapState,
      (
        state,
        { payload: { typedValue, flow, field, inputCurrencyId, outputCurrencyId, inputPairId, outputPairId } },
      ) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
            pairId: inputPairId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
            pairId: outputPairId,
          },
          independentField: field,
          typedValue,
          flow,
        }
      },
    )
    .addCase(resetZapState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
      }

      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, pairId, field } }) => {
      if (state.flow === ZAP_FLOW.PAIR_OUTPUT && field === Field.INPUT) {
        return {
          ...state,
          [field]: { currencyId },
        }
      }

      if (state.flow === ZAP_FLOW.PAIR_OUTPUT && field === Field.OUTPUT) {
        return {
          ...state,
          [field]: { pairId },
        }
      }

      if (state.flow === ZAP_FLOW.CURRENCY_OUTPUT && field === Field.INPUT) {
        return {
          ...state,
          [field]: { pairId },
        }
      }

      return {
        ...state,
        [field]: { currencyId },
      }
    })
    .addCase(switchZapFlow, (state) => {
      return {
        ...state,
        flow: state.flow === ZAP_FLOW.PAIR_OUTPUT ? ZAP_FLOW.CURRENCY_OUTPUT : ZAP_FLOW.PAIR_OUTPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId, pairId: state[Field.OUTPUT].pairId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId, pairId: state[Field.INPUT].pairId },
      }
    }),
)
