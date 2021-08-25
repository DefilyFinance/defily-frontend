import PropTypes from 'prop-types'
import { getKardiachainLink } from 'utils/getUrl'

const PairCell = ({ pair }) => {
  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => window.open(getKardiachainLink(pair?.pair_address, 'address'), '_blank')}
    >
      <div className="flex-shrink-0">
        <div className="relative min-w-min">
          <img
            className="h-10 w-10 rounded-full border-primary border-2 p-1 relative z-20 bg-white"
            src={`/tokens/${pair.base_symbol.replace(' Token', '').toLowerCase()}.png`}
            alt="logo"
          />
          <img
            className="h-10 w-10 rounded-full absolute top-0 bg-white left-5 border-primary border-2 p-1 ml-1"
            src={`/tokens/${pair.quote_symbol?.replace(' Token', '')?.toLowerCase()}.png`}
            alt="logo"
          />
        </div>
      </div>
      <div className="ml-8 cursor-pointer">
        <div className="text-white">
          {pair.base_symbol === 'WKAI' ? 'KAI' : pair.base_symbol.replace(' Token', '')}-
          {pair.quote_symbol === 'WKAI' ? 'KAI' : pair.quote_symbol.replace(' Token', '')}
        </div>
      </div>
    </div>
  )
}

PairCell.propTypes = {
  pair: PropTypes.object.isRequired,
}

export default PairCell
