import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import ListLogo from 'components/Logo/ListLogo'
import QuestionHelper from 'components/QuestionHelper/index'
import Value from 'components/Value/Value'
import { CASTLE_TAGS } from 'constants/index'
import { useModalWalletConnect } from 'store/modal/hooks'
import useKardiachain from 'hooks/useKardiachain'
import { useSousHarvest } from 'hooks/useReward'
import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Fragment } from 'react'

import Card from 'components/Card/Card'
import { useDispatch } from 'react-redux'
import { fetchCastleUserDataAsync } from 'store/castles/index'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { formatListLogo } from 'utils/formatLogo'
import { getPoolName } from 'utils/tokenHelpers'

const HarvestV2 = ({ pool, earnings }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()

  const tokensEarningLabel = getPoolName(pool.earningTokens)

  const usdTokensEarning = earnings.map((earning, index) => {
    return earning
      ? new BigNumber(getFullDisplayBalance(earning, pool.earningTokens[index].decimals))
          .times(pool?.earningTokensPrice?.[index] || 0)
          .toNumber()
      : 0
  })

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useSousHarvest(pool.contractAddress, !!pool?.fees?.withdrawalFee)

  const handleReward = useCallback(async () => {
    try {
      setPendingTx(true)
      await onReward()
      dispatch(fetchCastleUserDataAsync(account, pool))
      showToastSuccess('Harvested', `Your ${tokensEarningLabel} earnings have been sent to your wallet!`)
      setPendingTx(false)
    } catch (e) {
      setPendingTx(false)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      console.error(e)
    }
  }, [account, dispatch, onReward, pool, tokensEarningLabel])

  const logos = formatListLogo(pool?.earningToken ? [pool?.earningToken] : pool?.earningTokens)

  return (
    <Card className="mx-4 flex-1 farm-card max-w-md mb-8">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="text-center">
            <div className="h-20">
              <div className="flex justify-center">
                <ListLogo srcs={logos.srcs} alts={logos.alts} size={80} />
              </div>
            </div>
            {pool.earningTokens.map((earningToken, index) => (
              <Fragment key={index}>
                <div className="text-primary text-2xl break-words">
                  <Value value={getBalanceNumber(account ? earnings[index] : 0, earningToken.decimals)} decimals={6} />
                </div>
                <div className="text-primary">
                  {pool?.earningTokensPrice ? (
                    <Value prefix="~" value={account ? usdTokensEarning[index] : 0} decimals={3} unit="USD" />
                  ) : (
                    '~???USD'
                  )}
                </div>
                <p className="text-white text-xl">
                  {earningToken.symbol} {pool.tags.includes(CASTLE_TAGS.ifo) ? 'Distributed' : 'Earned'}
                </p>
              </Fragment>
            ))}
          </div>
          {pool?.fees?.feesHarvest && (
            <div className="flex justify-center text-white mt-2 text-sm">
              <div className="flex items-center">
                Harvest fee: {pool.fees.feesHarvest}%
                <QuestionHelper
                  classNameToolTip="tooltip-center"
                  text={`${pool.fees.feesHarvest}% harvest fee will be charged on your rewards`}
                />
              </div>
            </div>
          )}
          {account ? (
            <>
              {!pool.isHide && (
                <Button
                  disabled={pendingTx || earnings[0].eq(new BigNumber(0))}
                  isLoading={pendingTx}
                  className="w-full"
                  onClick={handleReward}
                >
                  {pendingTx ? `Collecting ${tokensEarningLabel}` : 'Harvest'}
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

HarvestV2.propTypes = {
  pool: PropTypes.object.isRequired,
  earnings: PropTypes.array.isRequired,
}

export default HarvestV2
