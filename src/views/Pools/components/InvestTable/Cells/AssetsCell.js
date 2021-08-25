import { useHistory } from 'react-router-dom'
import { getTokenName } from 'utils/tokenHelpers'
import PropTypes from 'prop-types'

const AssetsCell = ({ pool }) => {
  const history = useHistory()
  const nameDisplay = pool.lpAddress
    ? getTokenName(pool.symbol, pool?.t0?.symbol, pool?.t1?.symbol)
    : pool?.stakingToken?.symbol

  const subNameDisplay = pool?.symbol?.includes('KLP') || pool?.stakingToken?.token1 ? 'KAI DEX LP Token' : 'Token'

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 ">
        <div className="relative">
          {pool.lpAddress || pool.lpTokenAddress ? (
            <>
              {pool?.token1?.symbol || pool?.t1?.symbol ? (
                <>
                  <img
                    className="h-10 w-10 rounded-full border-primary border-2 p-1 relative z-20 bg-white"
                    src={`/tokens/${pool?.token0?.symbol?.toLowerCase() || pool?.t0?.symbol?.toLowerCase()}.png`}
                    alt="logo"
                  />
                  <img
                    className="h-10 w-10 rounded-full absolute top-0 bg-white -right-6 border-primary border-2 p-1 ml-1"
                    src={`/tokens/${pool?.token1?.symbol?.toLowerCase() || pool?.t1?.symbol?.toLowerCase()}.png`}
                    alt="logo"
                  />
                </>
              ) : (
                <img
                  className="h-10 w-10 rounded-full border-primary border-2 p-1 bg-white"
                  src={`/tokens/${pool.icon || `${pool?.token0?.symbol?.toLowerCase()}.png` || 'dfl.png'}`}
                  alt="logo"
                />
              )}
            </>
          ) : (
            <>
              {pool.stakingToken.token1 ? (
                <>
                  <img
                    className="h-10 w-10 rounded-full border-primary border-2 p-1 relative z-20 bg-white"
                    src={`/tokens/${pool?.stakingToken.token0.symbol.toLowerCase()}.png`}
                    alt="logo"
                  />
                  <img
                    className="h-10 w-10 rounded-full absolute top-0 bg-white -right-6 border-primary border-2 p-1 ml-1"
                    src={`/tokens/${pool?.stakingToken.token1.symbol.toLowerCase()}.png`}
                    alt="logo"
                  />
                </>
              ) : (
                <img
                  className="h-10 w-10 rounded-full border-primary border-2 p-1 bg-white border-primary border-2"
                  src={`/tokens/${
                    pool.stakingToken.symbol.includes('DDT') ? 'dfl' : pool.stakingToken.symbol.toLowerCase()
                  }.png`}
                  alt="logo"
                />
              )}
            </>
          )}
        </div>
      </div>
      <div
        className="ml-8 cursor-pointer"
        onClick={() => {
          if (pool?.link) return window.open(pool?.link)
          history.push(pool.route)
        }}
      >
        <div className="text-white">{nameDisplay}</div>
        <div className="text-white">{subNameDisplay}</div>
      </div>
    </div>
  )
}

AssetsCell.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default AssetsCell
