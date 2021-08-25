import { KardiachainContextProvider } from 'contexts/KardiachainContext'
import { Provider } from 'react-redux'
import ApplicationUpdater from 'store/application/updater'
import ListsUpdater from './store/lists/updater'
import MulticallUpdater from 'store/multicall/updater'
import TransactionUpdater from 'store/transactions/updater'

import PropTypes from 'prop-types'

import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'store'

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <KardiachainContextProvider>
        <RefreshContextProvider>
          <Updaters />
          {children}
        </RefreshContextProvider>
      </KardiachainContextProvider>
    </Provider>
  )
}

Providers.propTypes = {
  children: PropTypes.node,
}

export default Providers
