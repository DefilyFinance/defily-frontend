import DoubleLogo from 'components/Logo/DoubleLogo'
import { formatLogo } from 'utils/formatLogo'
import { getTokenName } from 'utils/tokenHelpers'
import PropTypes from 'prop-types'

const AssetsCell = ({ row }) => {
  const vault = row.original
  const nameDisplay = getTokenName(vault?.token1?.symbol ? 'KLP' : '', vault?.token0?.symbol, vault?.token1?.symbol)
  const logo = formatLogo(vault.token0, vault.token1)

  return (
    <div className="flex items-center">
      <div className="mr-4">
        <DoubleLogo right="-right-6" src0={logo.src0} src1={logo.src1} alt0={logo.alt0} alt1={logo.alt1} size={40} />
      </div>
      <div className="ml-4 cursor-pointer">
        <div className="text-white">{nameDisplay}</div>
      </div>
    </div>
  )
}

AssetsCell.propTypes = {
  row: PropTypes.object.isRequired,
}

export default AssetsCell
