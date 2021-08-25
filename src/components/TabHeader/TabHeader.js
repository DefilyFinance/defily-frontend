import { NavLink } from 'react-router-dom'

const pathNameLiquidity = ['/liquidity', '/add', '/remove', '/find']
const pathNameZap = ['/zap']
const pathNamePipe = ['/pipe']

const TabHeader = () => {
  return (
    <div className="flex justify-center mx-auto text-white mt-10 mb-10 bg-blue1 max-w-min	rounded-3xl py-1 px-2">
      <NavLink
        isActive={(match, location) => location.pathname === '/swap'}
        className="px-4 py-2 whitespace-nowrap"
        activeClassName="text-black bg-primary rounded-2xl"
        to="/swap"
      >
        Swap
      </NavLink>
      <NavLink
        className="px-4 py-2 whitespace-nowrap"
        isActive={(match, location) => {
          const pathString = location.pathname?.split('/')?.[1]
          if (pathNameLiquidity.includes(`/${pathString}`)) return true
          return pathNameLiquidity.includes(location.pathname)
        }}
        activeClassName="text-black bg-primary rounded-2xl"
        to="/liquidity"
      >
        Liquidity
      </NavLink>
      <NavLink
        className="px-4 py-2 whitespace-nowrap"
        isActive={(match, location) => {
          const pathString = location.pathname?.split('/')?.[1]
          if (pathNameZap.includes(`/${pathString}`)) return true
          return pathNameZap.includes(location.pathname)
        }}
        activeClassName="text-black bg-primary rounded-2xl"
        to="/zap"
      >
        Zap
      </NavLink>
      <NavLink
        className="px-4 py-2 whitespace-nowrap"
        isActive={(match, location) => {
          const pathString = location.pathname?.split('/')?.[1]
          if (pathNamePipe.includes(`/${pathString}`)) return true
          return pathNamePipe.includes(location.pathname)
        }}
        activeClassName="text-black bg-primary rounded-2xl"
        to="/pipe"
      >
        Pipe
      </NavLink>
    </div>
  )
}

export default TabHeader
