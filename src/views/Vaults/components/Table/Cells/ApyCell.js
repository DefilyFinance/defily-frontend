import ModalApyCalculatorVault from 'components/Modal/ModalApyCalculatorVault'
import Value from 'components/Value/Value'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Clipboard } from 'react-feather'

const ApyCell = ({ vault }) => {
  const [openRoi, setOpenRoi] = useState(false)

  const handleOpenModalApy = () => setOpenRoi((prevState) => !prevState)

  return (
    <>
      {openRoi && <ModalApyCalculatorVault onClose={handleOpenModalApy} open={openRoi} apy={vault.apy} data={vault} />}
      <Value
        className="flex"
        onClick={(e) => {
          e.stopPropagation()
          handleOpenModalApy()
        }}
        value={vault.apy.yearlyApy ? vault.apy.yearlyApy : 0}
        unit={
          <span className="flex items-center">
            %
            <Clipboard className="ml-1 cursor-pointer" size={18} />
          </span>
        }
        decimals={0}
      />
    </>
  )
}

ApyCell.propTypes = {
  vault: PropTypes.object.isRequired,
}

export default ApyCell
