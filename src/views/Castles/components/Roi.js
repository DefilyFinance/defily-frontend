import Value from 'components/Value/Value'
import PropTypes from 'prop-types'
import { Clipboard } from 'react-feather'

const Roi = ({ pool }) => {
  const apr = pool.stakedTvl ? (pool.earningTokensPrice / (+pool.stakedTvl / 100000000) - 1) * 100 : 0

  return (
    <div className="flex justify-between items-center mb-1">
      <p className="text-white">ROI</p>
      <div className="flex items-center text-white font-bold">
        {apr && apr !== Infinity ? <Value value={apr || 0} unit="%" decimals={0} /> : '???%'}
        <Clipboard className="ml-1" size={18} />
      </div>
    </div>
  )
}

Roi.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default Roi
