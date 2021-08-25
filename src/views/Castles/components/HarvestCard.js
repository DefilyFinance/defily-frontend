import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Dots from 'components/Loader/Dots'
import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCastlesUserDataAsync } from 'store/castles/index'
import { BIG_TEN } from 'utils/bigNumber'
import { soushHarvest } from 'utils/callHelpers'
import { getSouschefContract } from 'utils/contractHelpers'
import { getPoolName } from 'utils/tokenHelpers'
import { getEarningsText } from 'views/Farms/helpers'

const HarvestCard = ({ userDataLoaded, poolsWithStakedBalance }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const [pendingTx, setPendingTx] = useState(false)
  const souschefContract = getSouschefContract()

  const poolsWithEarnings = useMemo(() => {
    return poolsWithStakedBalance.filter((pool) => pool.userData.earnings[0].gt(0))
  }, [poolsWithStakedBalance])

  const earningsUsdSum = useMemo(() => {
    const totalEarned = poolsWithEarnings.reduce((accum, pool) => {
      const earningUsdNumber = pool.userData.earnings.reduce((sum, earning, index) => {
        if (earning.eq(0)) {
          return sum
        }

        return sum.plus(
          earning
            .div(BIG_TEN.pow(pool.earningTokens[index].decimals))
            .multipliedBy(pool.earningTokensPrice?.[index] || 0),
        )
      }, new BigNumber(0))

      if (pool.userData.earnings[0].eq(0)) {
        return accum
      }

      return accum.plus(earningUsdNumber)
    }, new BigNumber(0))

    return totalEarned
  }, [poolsWithEarnings])

  const numTotalToCollect = poolsWithEarnings.length
  const hasEarningPoolToCollect = numTotalToCollect > 0

  const earningsText = getEarningsText(numTotalToCollect, hasEarningPoolToCollect, earningsUsdSum, true)
  const [preText, toCollectText] = earningsText.split(earningsUsdSum.isNaN() ? '0' : earningsUsdSum.toString())

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const poolWithEarning of poolsWithEarnings) {
      try {
        const tokensEarningLabel = getPoolName(poolWithEarning.earningTokens)
        await soushHarvest(souschefContract, poolWithEarning.contractAddress, account)
        dispatch(fetchCastlesUserDataAsync(account))
        showToastSuccess(`Harvested!`, `Your ${tokensEarningLabel} earnings have been sent to your wallet!`)
      } catch (error) {
        showToastError('Error', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      }
    }
    setPendingTx(false)
  }, [account, dispatch, poolsWithEarnings, souschefContract])

  if (!account) return null

  return (
    <Card className="mx-auto max-w-md p-3 mb-4">
      <div className="flex justify-between">
        <div className="text-white">
          {preText && <p>{preText}</p>}
          {userDataLoaded && earningsUsdSum && !earningsUsdSum.isNaN() ? (
            <Value
              decimals={earningsUsdSum.gt(0) ? 2 : 0}
              fontSize="24px"
              bold
              prefix={earningsUsdSum.gt(0) ? '~$' : '$'}
              lineHeight="1.1"
              value={earningsUsdSum.toNumber()}
            />
          ) : (
            <Dots>Loading</Dots>
          )}
          <p>{toCollectText}</p>
        </div>
        {numTotalToCollect <= 0 ? (
          <Button disabled>Harvest all</Button>
        ) : (
          <Button
            className="font-bold"
            id="harvest-all"
            isLoading={pendingTx}
            disabled={pendingTx}
            onClick={harvestAllFarms}
          >
            {pendingTx ? 'Harvesting' : 'Harvest all'}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default HarvestCard
