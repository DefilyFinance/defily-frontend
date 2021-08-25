import Container from 'components/Container/Container'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import LayoutSwap from 'components/LayoutSwap/LayoutSwap'
import { pathBgFooter, pathNoDragon, subPathNoDragon } from 'config/index'
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
// import ReactGA from 'react-ga'
const PATH_SWAP = ['/swap', '/liquidity', '/add', '/find', '/remove', '/zap', '/pipe']

// ReactGA.initialize('UA-204692819-1')
const Layout = ({ children }) => {
  const history = useHistory()
  const pathname = history?.location?.pathname

  const isRouteSwap = useMemo(() => {
    return !!PATH_SWAP.find(
      (item) => pathname?.substring(0, item?.length) && pathname?.substring(0, item?.length)?.toLowerCase() === item,
    )
  }, [pathname])

  const showDragon = useMemo(() => {
    if (pathNoDragon.includes(history.location.pathname?.toLowerCase())) {
      return false
    }
    const pathString = history.location.pathname?.split('/')?.[1]
    if (subPathNoDragon.includes(pathString)) {
      return false
    }
    return true
  }, [pathname])

  useEffect(() => {
    if (!isRouteSwap) {
      window.scrollTo(0, 0)
    }
    // if (pathname) {
    //   ReactGA.pageview(pathname + search)
    // }
  }, [pathname])

  const switchImageFooter = () => {
    switch (pathname) {
      case '/battles':
        return '/images/dragon-battle.png'
      case '/vaults':
        return '/images/bg-vault.png'
      default:
        return '/images/castle.png'
    }
  }

  return (
    <Container
      contentStyle={{
        backgroundImage: pathBgFooter.includes(pathname) ? 'url(/images/bg-footer.png)' : null,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right bottom',
        backgroundSize: 'contain',
      }}
    >
      {showDragon && !pathBgFooter.includes(pathname) && pathname !== '/vaults' && (
        <div className="z-10">
          <img className="img-dragon1 hidden sm:block" src="/images/dragon1.svg" />
          <img className="img-dragon2 hidden sm:block" src="/images/dragon2.svg" />
          <img className="img-dragon3 hidden sm:block" src="/images/dragon3.svg" />
          <img className="img-dragon4 hidden sm:block" src="/images/dragon4.svg" />
        </div>
      )}
      <Header />
      <div className="flex-1 relative">{isRouteSwap ? <LayoutSwap>{children}</LayoutSwap> : children}</div>
      {showDragon && !pathBgFooter.includes(pathname) && <img className="img-castle" src={switchImageFooter()} />}
      {!['/'].includes(pathname) && <Footer />}
    </Container>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout
