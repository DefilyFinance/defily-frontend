import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import ModalTitle from 'components/Modal/ModalTitle'
import Tooltip from 'components/Tooltip/Tooltip'
import Value from 'components/Value/Value'
import address from 'constants/contracts'
import useKardiachain from 'hooks/useKardiachain'
import { useDflPrice } from 'hooks/usePrice'
import useTokenBalance from 'hooks/useTokenBalance'
import { useState } from 'react'
import Modal from 'components/Modal/Modal'
import { Copy } from 'react-feather'
import { formatAddress } from 'utils/addressHelpers'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import PropTypes from 'prop-types'

const ModalAccount = ({ open, toggleAccount }) => {
  const { account, onLogout } = useKardiachain()
  const dflPrice = useDflPrice()
  const [isCopy, setIsCopy] = useState(false)
  const dflBalance = getBalanceNumber(useTokenBalance(address.defily))
  const usdTokenDfl = dflBalance ? formatNumber(new BigNumber(dflBalance).times(dflPrice).toNumber()) : 0

  const handleLogout = () => {
    onLogout()
    toggleAccount()
  }

  const copyToClipboard = () => {
    setIsCopy(true)
    navigator.clipboard.writeText(account)
  }

  return (
    <Modal open={open} onClose={toggleAccount}>
      <ModalTitle onClose={toggleAccount}>Your wallet</ModalTitle>
      <div className="text-center">
        <p className="text-gray-500 break-words hidden sm:block">{account}</p>
        <p className="text-gray-500 break-words block sm:hidden">{account ? formatAddress(account) : ''}</p>
        <div className="mt-2 flex justify-center">
          <a
            target="_blank"
            href={`https://explorer.kardiachain.io/address/${account}`}
            className="mx-2 text-gray-500 hover:text-primary"
          >
            View on kardiachain
          </a>
          <Tooltip tooltip={<span>{isCopy ? 'Copied' : 'copy'}</span>}>
            <p
              onClick={copyToClipboard}
              className="cursor-pointer flex items-center mx-2 text-gray-500 hover:text-primary"
            >
              Copy Address <Copy className="ml-1" />
            </p>
          </Tooltip>
        </div>
        <Value className="text-3xl font-bold text-primary" value={dflBalance} />
        <Value prefix="~" className="text-primary" value={account ? usdTokenDfl : 0} decimals={2} unit="USD" />
        <p>DFL balance</p>
        <Button className="mx-auto mt-2" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Modal>
  )
}

ModalAccount.propTypes = {
  open: PropTypes.bool,
  toggleAccount: PropTypes.func,
}

export default ModalAccount
