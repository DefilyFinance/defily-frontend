import ModalApyCalculatorVault from 'components/Modal/ModalApyCalculatorVault'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Clipboard } from 'react-feather'
import { formatNumber } from 'utils/formatBalance'

const ApyCell = ({ vault }) => {
  const [openRoi, setOpenRoi] = useState(false)

  const handleOpenModalApy = () => setOpenRoi((prevState) => !prevState)

  return (
    <>
      {openRoi && <ModalApyCalculatorVault onClose={handleOpenModalApy} open={openRoi} apy={vault.apy} data={vault} />}
      <span onClick={handleOpenModalApy} className="flex items-center cursor-pointer">
        {vault.apy.yearlyApy ? formatNumber(vault.apy.yearlyApy, 0, 0) : 0}%{' '}
        <Clipboard className="ml-1 cursor-pointer" size={18} />
      </span>
    </>
  )
}

ApyCell.propTypes = {
  vault: PropTypes.object.isRequired,
}

export default ApyCell
