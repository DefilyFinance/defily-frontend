import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Dots from 'components/Loader/Dots'
import Logo from 'components/Logo/Logo'
import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import { useSousHarvest } from 'hooks/useReward'
import { Fragment, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCastlesUserDataAsync } from 'store/castles/index'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { formatListLogo } from 'utils/formatLogo'
import { getPoolName } from 'utils/tokenHelpers'

const HarvestAction = ({
  isFees,
  earnings,
  earningTokens,
  earningTokensPrice,
  contractAddress,
  userDataLoaded,
  isIfo,
  stakedBalance,
}) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useSousHarvest(contractAddress, isFees)

  const tokensEarningLabel = getPoolName(earningTokens)

  const usdTokensEarning = earnings.map((earning, index) => {
    return earning
      ? new BigNumber(getFullDisplayBalance(earning, earningTokens[index].decimals))
          .times(earningTokensPrice?.[index] || 0)
          .toNumber()
      : 0
  })

  const handleReward = useCallback(async () => {
    try {
      setPendingTx(true)
      await onReward()
      dispatch(fetchCastlesUserDataAsync(account))
      showToastSuccess('Harvested', `Your ${tokensEarningLabel} earnings have been sent to your wallet!`)
      setPendingTx(false)
    } catch (e) {
      setPendingTx(false)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      console.error(e)
    }
  }, [account, dispatch, onReward, tokensEarningLabel])

  const logos = formatListLogo(earningTokens)

  const totalRewards = new BigNumber(stakedBalance).div(0.100181494773760107).times(100000000)
  const usdTotalRewards = new BigNumber(getFullDisplayBalance(totalRewards, earningTokens[0].decimals)).times(
    earningTokensPrice?.[0] || 0,
  )

  return (
    <div className="flex justify-between items-center flex-wrap">
      <div>
        {isIfo ? (
          <>
            <div className="flex items-center">
              <Logo src={logos.srcs[0]} alt={logos.alts[0]} size={24} />
              <Value
                className="text-primary font-bold text-xl ml-1"
                value={getBalanceNumber(account ? totalRewards : 0)}
                decimals={0}
              />
            </div>
            {earningTokensPrice ? (
              <Value
                className="text-primary text-sm"
                prefix="~"
                value={account ? usdTotalRewards : 0}
                decimals={3}
                unit="USD"
              />
            ) : (
              <span className="text-primary">~???USD</span>
            )}
          </>
        ) : (
          earningTokens.map((earningToken, index) => (
            <Fragment key={index}>
              <div className="flex items-center flex-wrap">
                <Logo src={logos.srcs[index]} alt={logos.alts[index]} size={24} />
                <Value
                  className="text-primary font-bold text-xl ml-1"
                  value={getBalanceNumber(account ? earnings[index] : 0, earningToken.decimals)}
                  decimals={6}
                />
              </div>
              {earningTokensPrice ? (
                <Value
                  className="text-primary text-sm"
                  prefix="~"
                  value={account ? usdTokensEarning[index] : 0}
                  decimals={3}
                  unit="USD"
                />
              ) : (
                <span className="text-primary">~???USD</span>
              )}
            </Fragment>
          ))
        )}
      </div>
      {account ? (
        userDataLoaded ? (
          <>
            {isIfo ? (
              <Button disabled>Transferring Rewards</Button>
            ) : (
              <Button
                disabled={pendingTx || earnings[0].eq(new BigNumber(0))}
                isLoading={pendingTx}
                onClick={handleReward}
              >
                {pendingTx ? `Collecting` : 'Harvest'}
              </Button>
            )}
          </>
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
