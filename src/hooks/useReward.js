import { showToastTx } from 'components/CustomToast/CustomToast'
import { useCallback } from 'react'
import useKardiachain from 'hooks/useKardiachain'
import { harvest, harvestWithdraw, soushHarvest, soushHarvestWithdraw } from 'utils/callHelpers'
import { getMasterChefContract, getSouschefContract } from 'utils/contractHelpers'

const useReward = (pid, masterChefAddress) => {
  const { account } = useKardiachain()

  const handleReward = useCallback(async () => {
    const masterChefContract = getMasterChefContract()
    const txHash = await harvest(masterChefContract, masterChefAddress, pid, account)
    showToastTx(txHash)
    console.log(txHash)
  }, [account, masterChefAddress, pid])

  const handleRewardWithDraw = useCallback(async () => {
    const masterChefContract = getMasterChefContract()
    const txHash = await harvestWithdraw(masterChefContract, masterChefAddress, pid, account)
    showToastTx(txHash)
    console.log(txHash)
  }, [account, masterChefAddress, pid])

  return { onReward: handleReward, onRewardWithDraw: handleRewardWithDraw }
}

export const useSousHarvest = (poolAddress, isWithdraw) => {
  const { account } = useKardiachain()

  const handleReward = useCallback(async () => {
    const souschefContract = getSouschefContract()
    let txHash
    if (isWithdraw) {
      txHash = await soushHarvestWithdraw(souschefContract, poolAddress, account)
    } else {
      txHash = await soushHarvest(souschefContract, poolAddress, account)
    }
    showToastTx(txHash)
    console.log(txHash)
  }, [account, poolAddress, isWithdraw])

  return { onReward: handleReward }
}

export default useReward
