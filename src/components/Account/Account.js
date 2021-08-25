import ModalAccount from 'components/Modal/ModalAccount'
import Tooltip from 'components/Tooltip/Tooltip'
import { useModalWalletConnect } from 'store/modal/hooks'
import useEstimateBalance from 'hooks/useEstimateBalance'
import { useState } from 'react'
import Button from 'components/Button/Button'
import { formatAddress } from 'utils/addressHelpers'
import useKardiachain from 'hooks/useKardiachain'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber } from 'utils/formatBalance'

const Account = () => {
  const { account } = useKardiachain()
  const [open, setOpen] = useState(false)
  const { onToggleConnectModal } = useModalWalletConnect()
  const { totalUserStaked, averageApr } = useEstimateBalance()

  const toggleAccount = () => setOpen(!open)

  const displayTotalUserStaked = totalUserStaked ? formatNumber(totalUserStaked.toNumber(), 0, 0, 'en-US') : '...'
  const displayAverageApr = averageApr
    ? averageApr.eq(BIG_ZERO)
      ? '???'
      : formatNumber(averageApr.toNumber(), 0, 0, 'en-US')
    : '...'

  return (
    <div className="flex flex-wrap justify-center items-center text-sm sm:text-md">
      {!account && <Button onClick={onToggleConnectModal}>Connect wallet</Button>}
      {account && (
        <>
          <Tooltip
            classNameToolTip="left-0 sm:right-0 sm:left-auto"
            tooltip={
              <div className="w-60">
                You are staking a total of ${displayTotalUserStaked} at an average APR of {displayAverageApr}%
              </div>
            }
          >
            <Button className="mr-2 my-1 whitespace-nowrap">
              $ {displayTotalUserStaked}- {displayAverageApr}%
            </Button>
          </Tooltip>
          {/*<Button className="mr-2 my-1 whitespace-nowrap">*/}
          {/*  $ {displayTotalUserStaked}*/}
          {/*</Button>*/}
          <Button className="my-1" onClick={toggleAccount}>
            {account ? formatAddress(account) : 'Install Kardia'}
          </Button>
        </>
      )}
      <ModalAccount open={open} toggleAccount={toggleAccount} />
    </div>
  )
}

export default Account
