import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Dots from 'components/Loader/Dots'
import Value from 'components/Value/Value'
import address from 'constants/contracts'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { usePrices } from 'store/prices/hook'
import { BIG_TEN } from 'utils/bigNumber'
import { harvest, harvestWithdraw } from 'utils/callHelpers'
import { getMasterChefContract } from 'utils/contractHelpers'
import { getParameterCaseInsensitive } from 'utils/index'
import { getEarningsText } from 'views/Farms/helpers'

const HarvestCard = ({
  userDataLoaded,
  farmsWithStakedBalance,
  earningToken,
  masterChefAddress,
  updateHarvestCallback,
  nameFarm,
}) => {
  const prices = usePrices()
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const masterChefContract = getMasterChefContract()
  const [pendingTx, setPendingTx] = useState(false)
  const earningTokenPrice = getParameterCaseInsensitive(prices, earningToken.address) || 0

  const farmEarningsSum = useMemo(() => {
    const totalEarned = farmsWithStakedBalance.reduce((accum, farm) => {
      const earningNumber = new BigNumber(farm.userData.earnings)

      if (earningNumber.eq(0)) {
        return accum
      }
      return accum + earningNumber.div(BIG_TEN.pow(earningToken.decimals)).toNumber()
    }, 0)

    return totalEarned
  }, [earningToken.decimals, farmsWithStakedBalance])

  const earningsUsd = new BigNumber(farmEarningsSum).multipliedBy(earningTokenPrice)

  const numTotalToCollect = farmsWithStakedBalance.length
  const hasEarningPoolToCollect = numTotalToCollect > 0

  const earningsText = getEarningsText(numTotalToCollect, hasEarningPoolToCollect, earningsUsd)
  const [preText, toCollectText] = earningsText.split(earningsUsd.isNaN() ? '0' : earningsUsd.toString())

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const farmWithBalance of farmsWithStakedBalance) {
      try {
        // fix farm bossdoge
        if (farmWithBalance.pid === 10 && masterChefAddress === address.masterChef) {
          await harvestWithdraw(masterChefContract, masterChefAddress, farmWithBalance.pid, account)
        } else {
          await harvest(masterChefContract, masterChefAddress, farmWithBalance.pid, account)
        }
        dispatch(updateHarvestCallback(account, farmWithBalance.pid, nameFarm))
        showToastSuccess(`Harvested!`, `Your ${earningToken.symbol} earnings have been sent to your wallet!`)
      } catch (error) {
        showToastError('Error', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      }
    }
    setPendingTx(false)
  }, [
    farmsWithStakedBalance,
    masterChefAddress,
    dispatch,
    updateHarvestCallback,
    account,
    nameFarm,
    earningToken.symbol,
    masterChefContract,
  ])

  if (!account) return null

  return (
    <Card className="mx-auto max-w-md p-3 mb-4">
      <div className="flex justify-between">
        <div className="text-white">
          {preText && <p>{preText}</p>}
          {userDataLoaded && earningsUsd && !earningsUsd.isNaN() ? (
            <Value
              decimals={earningsUsd.gt(0) ? 2 : 0}
              fontSize="24px"
              bold
              prefix={earningsUsd.gt(0) ? '~$' : '$'}
              lineHeight="1.1"
              value={earningsUsd.toNumber()}
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
