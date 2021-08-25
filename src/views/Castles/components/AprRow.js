import classnames from 'classnames'
import Value from 'components/Value/Value'
import PropTypes from 'prop-types'
import { Clipboard } from 'react-feather'
import ModalApyCalculator from 'components/Modal/ModalApyCalculator'
import { useState } from 'react'
import { getPoolName } from 'utils/tokenHelpers'

const AprRow = ({ pool }) => {
  const labelEarningToken = getPoolName(pool.isV2 ? pool.earningTokens : [pool.earningToken])
  const [openRoi, setOpenRoi] = useState(false)

  const isShowModalApr = !pool.isV2 || pool.earningTokens.length < 2

  return (
    <div className="flex justify-between items-center mb-1">
      <p className="text-white">APR</p>
      <div
        onClick={() => {
          if (isShowModalApr) {
            setOpenRoi(true)
          }
        }}
        className={classnames(
          'flex items-center text-white font-bold',
          isShowModalApr && 'cursor-pointer hover:text-gray-300',
        )}
      >
        {pool.apr ? <Value value={pool.apr || 0} unit="%" decimals={0} /> : '???%'}
        <Clipboard className="ml-1" size={18} />
      </div>
      {openRoi ? (
        <ModalApyCalculator
          open={openRoi}
          apr={pool?.apr}
          data={pool}
          earningTokenSymbol={labelEarningToken}
          tokenPrice={pool?.earningTokenPrice || pool?.earningTokensPrice?.[0]}
          onClose={() => setOpenRoi(!openRoi)}
        />
      ) : null}
    </div>
  )
}

AprRow.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default AprRow
