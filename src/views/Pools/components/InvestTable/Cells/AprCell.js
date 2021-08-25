import classnames from 'classnames'
import { Clipboard } from 'react-feather'
import { formatNumber } from 'utils/formatBalance'
import PropTypes from 'prop-types'
import { useState } from 'react'
import ModalApyCalculator from 'components/Modal/ModalApyCalculator'
import { tokenEarnedPerThousandDaily } from 'utils'
import ApyCell from 'views/Pools/components/InvestTable/Cells/ApyCell'

const AprCell = ({ pool }) => {
  const aprDisplay = pool.lpAddress ? pool?.apr?.yearlyAPR : pool.apr
  const [openRoi, setOpenRoi] = useState(false)
  const isFarm = typeof pool.apr === 'object'
  const { stakedTvl, apr } = pool

  let earningTokenSymbol = undefined
  if (pool?.logo) {
    const index = pool.logo.lastIndexOf('.')
    earningTokenSymbol = pool.logo.substring(0, index)?.toUpperCase()
  }
  if (pool?.earningToken?.symbol) {
    earningTokenSymbol = pool?.earningToken?.symbol
  }

  if (pool.isVault) return <ApyCell vault={pool} />

  return (
    <>
      <span
        className={classnames('flex items-center', !pool?.isV2 && 'cursor-pointer')}
        onClick={() => {
          if (!pool?.isV2 && !pool.isVault) {
            setOpenRoi(true)
          }
        }}
      >
        {(pool.lpAddress && !pool?.apr?.yearlyAPR) || !pool.apr ? '...' : formatNumber(+aprDisplay, 0, 2, 'en-US')}%
        <Clipboard className="ml-1" size={18} />
      </span>
      {openRoi ? (
        <ModalApyCalculator
          open={openRoi}
          tokenPrice={pool?.earningTokenPrice}
          earningTokenSymbol={earningTokenSymbol}
          data={pool}
          {...(isFarm
            ? {
                tokenEarnedPerThousandDaily: tokenEarnedPerThousandDaily(stakedTvl, apr),
                isFarm,
              }
            : {
                apr,
              })}
          onClose={() => setOpenRoi(!openRoi)}
        />
      ) : null}
    </>
  )
}

AprCell.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default AprCell
