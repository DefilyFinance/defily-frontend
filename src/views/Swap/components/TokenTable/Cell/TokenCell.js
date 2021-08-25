import PropTypes from 'prop-types'

const TokenCell = ({ token }) => {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 ">
        <img
          className="h-10 w-10 rounded-full p-1 bg-blue2"
          src={`/tokens/${token.symbol.replace(' Token', '').toLowerCase()}.png`}
          alt="logo"
        />
      </div>
      <div className="ml-4">
        <div className="text-white">{token.symbol.replace(' Token', '')}</div>
      </div>
    </div>
  )
}

TokenCell.propTypes = {
  token: PropTypes.object.isRequired,
}

export default TokenCell
