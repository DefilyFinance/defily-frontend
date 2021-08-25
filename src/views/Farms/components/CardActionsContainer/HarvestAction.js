import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Dots from 'components/Loader/Dots'
import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import useReward from 'hooks/useReward'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserEarningsBalance } from 'store/farms/index'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

const HarvestAction = ({ earnings, earningTokenPrice, pid, masterChefAddress, userDataLoaded, earningTokenSymbol }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward, onRewardWithDraw } = useReward(pid, masterChefAddress)

  const usdTokenEarning = earnings
    ? new BigNumber(getFullDisplayBalance(earnings)).times(earningTokenPrice).toNumber()
    : 0

  const handleReward = useCallback(async () => {
    try {
      setPendingTx(true)
      // fix pool bossdoge because bossdoge will charge 2% fee when deposit or withdraw
      if (pid === 10) {
        await onRewardWithDraw()
      } else {
        await onReward()
      }
      showToastSuccess('Harvested', `Your ${earningTokenSymbol} earnings have been sent to your wallet!`)
      dispatch(updateUserEarningsBalance(account, pid))
      setPendingTx(false)
    } catch (e) {
      setPendingTx(false)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      console.error(e)
    }
  }, [account, dispatch, earningTokenSymbol, onReward, onRewardWithDraw, pid])

  return (
    <div className="flex justify-between items-center">
      <div>
        <Value className="text-primary font-bold text-xl" value={account ? getBalanceNumber(earnings) : 0} />
        <Value
          prefix="~"
          className="text-primary text-sm"
          value={account ? usdTokenEarning : 0}
          decimals={2}
          unit="USD"
        />
      </div>
      {account ? (
        userDataLoaded ? (
          <Button disabled={pendingTx || earnings.eq(new BigNumber(0))} isLoading={pendingTx} onClick={handleReward}>
            {pendingTx ? `Collecting ${earningTokenSymbol}` : 'Harvest'}
          </Button>
        ) : (
          <Button>
            <Dots>Loading</Dots>
          </Button>
        )
      ) : (
        <Button disabled>Harvest</Button>
      )}
    </div>
  )
}

export default HarvestAction
