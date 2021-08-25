import Value from 'components/Value/Value'
import PropTypes from 'prop-types'

const VaultAssetsCell = ({ vault }) => {
  return vault.stakedTvl ? <Value prefix="$" value={vault.stakedTvl} decimals={0} /> : <p className="text-white">...</p>
}

VaultAssetsCell.propTypes = {
  vault: PropTypes.object.isRequired,
}

export default VaultAssetsCell
