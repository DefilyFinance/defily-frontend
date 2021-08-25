import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { updateVersion } from './global/actions'
import { save, load } from 'redux-localstorage-simple'

import poolsReducer from './pools'
import farmsReducer from './farms'
import miniFarmsReducer from './miniFarms'
import castlesReducer from './castles'
import pricesReducer from './prices'
import modalReducer from './modal'
import blockReducer from './block'
import battleReducer from './battles'
import landsReducer from './lands'
import vaultsReducer from './vaults'
import application from './application/reducer'
import user from './user/reducer'
import multicall from './multicall/reducer'
import transactions from './transactions/reducer'
import lists from './lists/reducer'
import swap from './swap/reducer'
import burn from './burn/reducer'
import mint from './mint/reducer'
import zap from './zap/reducer'
import pipe from './pipe/reducer'

const PERSISTED_KEYS = ['user', 'transactions']

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    block: blockReducer,
    pools: poolsReducer,
    farms: farmsReducer,
    miniFarms: miniFarmsReducer,
    castles: castlesReducer,
    prices: pricesReducer,
    modal: modalReducer,
    battles: battleReducer,
    lands: landsReducer,
    vaults: vaultsReducer,

    swap,
    application,
    transactions,
    multicall,
    user,
    lists,
    burn,
    mint,
    zap,
    pipe,
  },
  middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

export default store
