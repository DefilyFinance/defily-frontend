import PropTypes from 'prop-types'

const RewardsCell = ({ pool }) => {
  if (pool?.isV2) {
    return (
      <div className="flex">
        {pool.earningTokens.map((earningToken, index) => (
          <img
            key={index}
            className="h-10 w-10 rounded-full bg-white border-primary border-2 p-1"
            src={`/tokens/${earningToken.symbol.toLowerCase()}.png`}
            alt="logo"
          />
        ))}
      </div>
    )
  }

  if (pool?.isVault) {
    return (
      <div className="relative min-w-min">
        <img
          className="h-10 w-10 rounded-full border-primary border-2 p-1 relative z-20 bg-white"
          src={`/tokens/${pool?.token0?.symbol?.toLowerCase()}.png`}
          alt="logo"
        />
        {pool?.token1?.symbol && (
          <img
            className="h-10 w-10 rounded-full absolute top-0 bg-white left-5 border-primary border-2 p-1 ml-1"
            src={`/tokens/${pool?.token1?.symbol?.toLowerCase()}.png`}
            alt="logo"
          />
        )}
      </div>
    )
  }

  return (
    <img
      className="h-10 w-10 rounded-full bg-white border-primary border-2 p-1"
      src={`/tokens/${pool.lpAddress ? pool.logo : `${pool?.earningToken?.symbol.toLowerCase()}.png`}`}
      alt="logo"
    />
  )
}

RewardsCell.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default RewardsCell
