// import ModalNotification from 'components/Modal/ModalNotification'
import GoTop from 'components/GoTop/GoTop'
import ModalWallet from 'components/Modal/ModalWallet'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { ToastContainer } from 'react-toastify'
import Layout from 'components/Layout/Layout'

import { useFetchPublicData } from 'store/hooks'
import AddLiquidity from 'views/AddLiquidity/AddLiquidity'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from 'views/AddLiquidity/redirects'
import Battles from 'views/Battles/Battles'
import Farms from 'views/Farms/Farms'
import Dashboard from 'views/Dashboard/Dashboard'
import Home from 'views/Home/Home'
import Liquidity from 'views/Liquidity/Liquidity'
import Pipe from 'views/Pipe/Pipe'
import { RedirectOldPipePathStructure, RedirectPipeDuplicateTokenIds } from 'views/Pipe/redirects'
import PoolFinder from 'views/PoolFinder/index'
import Pools from 'views/Pools/Pools'
import MiniFarms from 'views/MiniFarms/MiniFarms'
import NotFound from 'views/NotFound'
import Castle from 'views/Castle/Castle'
import Castles from 'views/Castles/Castles'
import RemoveLiquidity from 'views/RemoveLiquidity/RemoveLiquidity'
import { RedirectToSwap } from 'views/Swap/redirects'
import Swap from 'views/Swap/Swap'
import Vaults from 'views/Vaults/Vaults'
import Zap from 'views/Zap/Zap'
import DragonLands from './views/Lands/DragonLands'
import Land from './views/Land/Land'
import { useFetchVaultsPublicData } from 'store/vaults/hook'
import { usePollBlockNumber } from 'store/block/hook'

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function App() {
  usePollBlockNumber()
  useFetchPublicData()
  useFetchVaultsPublicData()

  return (
    <Router>
      <Switch>
        <Layout>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/battles">
            <Battles />
          </Route>
          <Route path="/farms">
            <Farms />
          </Route>
          {/*<Route path="/farm/:lpAddress">*/}
          {/*  <Farm />*/}
          {/*</Route>*/}
          <Route path="/mini-farms">
            <MiniFarms />
          </Route>
          <Route path="/castles">
            <Castles />
          </Route>
          <Route path="/castle/:pid">
            <Castle />
          </Route>
          <Route path="/pools">
            <Pools />
          </Route>
          <Route path="/vaults">
            <Vaults />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/ido">
            <DragonLands />
          </Route>
          <Route path="/ido-detail/:id">
            <Land />
          </Route>

          {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
          <Route path="/swap">
            <Swap />
          </Route>
          <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
          <Route exact strict path="/liquidity" component={Liquidity} />
          <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
          <Route exact path="/add" component={AddLiquidity} />
          <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
          <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
          <Route exact strict path="/find" component={PoolFinder} />

          <Route exact path="/pipe" component={Pipe} />
          <Route exact path="/pipe/:pairIdA" component={RedirectOldPipePathStructure} />
          <Route exact path="/pipe/:pairIdA/:pairIdB" component={RedirectPipeDuplicateTokenIds} />

          <Route exact path="/zap" component={Zap} />
          <GoTop />
        </Layout>

        <Route component={NotFound} />
      </Switch>
      <ModalWallet />
      <ToastContainer newestOnTop />
    </Router>
  )
}

export default App
