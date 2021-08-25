import PropTypes from 'prop-types'
import { formatNumber } from 'utils/formatBalance'

const TotalValueLockedCell = ({ pool }) => {
  return <span>{pool.stakedTvl ? <>${formatNumber(+pool.stakedTvl || 0, 0, 2, 'en-US')}</> : '...'}</span>
}

TotalValueLockedCell.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default TotalValueLockedCell
