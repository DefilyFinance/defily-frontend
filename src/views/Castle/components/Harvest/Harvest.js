import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Logo from 'components/Logo/Logo'
import Value from 'components/Value/Value'
import { useModalWalletConnect } from 'store/modal/hooks'
import useKardiachain from 'hooks/useKardiachain'
import { useSousHarvest } from 'hooks/useReward'
import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import Card from 'components/Card/Card'
import { useDispatch } from 'react-redux'
import { usePrices } from 'store/prices/hook'
import { fetchCastleUserDataAsync } from 'store/castles/index'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { formatLogo } from 'utils/formatLogo'
import { getParameterCaseInsensitive } from 'utils/index'

const Harvest = ({ pool, earnings }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const prices = usePrices()

  const earningTokenBalance = getBalanceNumber(earnings, pool.earningToken.decimals)

  const priceTokenEarning = getParameterCaseInsensitive(prices, pool.earningToken.address)

  const usdTokenEarning = earnings
    ? new BigNumber(getFullDisplayBalance(earnings, pool.earningToken.decimals))
        .times(priceTokenEarning || 0)
        .toNumber()
    : 0

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useSousHarvest(pool.contractAddress)

  const handleReward = useCallback(async () => {
    try {
      setPendingTx(true)
      await onReward()
      dispatch(fetchCastleUserDataAsync(account, pool))
      showToastSuccess('Harvested', `Your ${pool.earningToken.symbol} earnings have been sent to your wallet!`)
      setPendingTx(false)
    } catch (e) {
      setPendingTx(false)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      console.error(e)
    }
  }, [account, dispatch, onReward, pool])

  const logo = formatLogo(pool?.earningToken)

  return (
    <Card className="mx-4 flex-1 farm-card max-w-md mb-8">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="text-center">
            <div className="h-20">
              <div className="flex justify-center">
                <Logo src={logo.src0} alt={logo.alt0} size={80} />
              </div>
            </div>
            <div className="text-primary text-2xl break-words">
              <Value value={account ? earningTokenBalance : 0} decimals={3} />
            </div>
            <div className="text-primary">
              {priceTokenEarning ? (
                <Value prefix="~" value={account ? usdTokenEarning : 0} decimals={3} unit="USD" />
              ) : (
                '~???USD'
              )}
            </div>
            <p className="text-white text-xl">{pool.earningToken.symbol} Earned</p>
          </div>
          {account ? (
            <>
              {!pool.isHide && (
                <Button
                  disabled={pendingTx || earnings.eq(new BigNumber(0))}
                  isLoading={pendingTx}
                  className="w-full"
                  onClick={handleReward}
                >
                  {pendingTx ? `Collecting ${pool.earningToken.symbol}` : 'Harvest'}
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full" onClick={onToggleConnectModal}>
              Connect wallet
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

Harvest.propTypes = {
  pool: PropTypes.object.isRequired,
  earnings: PropTypes.instanceOf(BigNumber),
}

export default Harvest
