import ModalApyCalculator from 'components/Modal/ModalApyCalculator'
import Value from 'components/Value/Value'
import { useState } from 'react'
import { Clipboard } from 'react-feather'
import { formatNumber } from 'utils/formatBalance'
import { tokenEarnedPerThousandDaily } from 'utils/index'

const CardInformation = ({ farm, earningTokenSymbol }) => {
  const [openRoi, setOpenRoi] = useState(false)

  const apr = farm?.apr

  const stakedTvl = farm?.stakedTvl || 0

  return (
    <div className="mb-3 mt-5">
      {openRoi ? (
        <ModalApyCalculator
          earningTokenSymbol={earningTokenSymbol}
          open={openRoi}
          tokenPrice={farm.earningTokenPrice}
          data={farm}
          tokenEarnedPerThousandDaily={tokenEarnedPerThousandDaily(stakedTvl, apr)}
          isFarm
          onClose={() => setOpenRoi(!openRoi)}
        />
      ) : null}
      <div className="flex justify-between items-center mb-1">
        <p className="text-white">APR</p>
        <p
          onClick={() => setOpenRoi(true)}
          className="flex items-center cursor-pointer text-white hover:text-gray-300 font-bold"
        >
          {apr ? `${apr.yearlyAPR === '0' ? '???' : formatNumber(+apr.yearlyAPR)}%` : '...'}
          <Clipboard className="ml-1 cursor-pointer" size={18} />
        </p>
      </div>
      <div className="flex justify-between items-center mb-1 text-white">
        <p>{earningTokenSymbol} per day</p>
        <p className="font-bold">{apr?.userDailyRewards ? formatNumber(+apr?.userDailyRewards, 0, 0) : 0}</p>
      </div>
      <div className="flex justify-between items-center mb-1 text-white">
        <p>Earn</p>
        <p className="font-bold">{earningTokenSymbol}</p>
      </div>
      <div className="flex justify-between items-center text-white">
        <p>TVL</p>
        <Value className="font-bold" prefix="$" value={stakedTvl} decimals={0} />
      </div>
    </div>
  )
}

export default CardInformation
