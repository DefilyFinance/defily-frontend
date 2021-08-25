import { showToastTx } from 'components/CustomToast/CustomToast'
import address from 'constants/contracts'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback } from 'react'
import { sousUnstake, sousUnstakeEmergency, unstake } from 'utils/callHelpers'
import { getMasterChefContract, getSouschefContract } from 'utils/contractHelpers'

const useUnstake = (pid, masterChefAddress) => {
  const { account } = useKardiachain()

  const handleUnstake = useCallback(
    async (amount, decimals) => {
      const masterChefContract = getMasterChefContract()
      const txHash = await unstake(masterChefContract, masterChefAddress, pid, amount, account, decimals)
      showToastTx(txHash)
      console.log(txHash)
    },
    [account, masterChefAddress, pid],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstake = (poolAddress) => {
  const { account } = useKardiachain()

  const handleUnstake = useCallback(
    async (amount, decimals) => {
      const souschefContract = getSouschefContract()
      const txHash = await sousUnstake(souschefContract, poolAddress, amount, decimals, account)
      showToastTx(txHash)
      console.log(txHash)
    },
    [account, poolAddress],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstakeEmergency = (poolAddress) => {
  const { account } = useKardiachain()

  const handleUnstake = useCallback(async () => {
    const souschefContract = getSouschefContract()
    const txHash = await sousUnstakeEmergency(souschefContract, poolAddress, account)
    showToastTx(txHash)
    console.log(txHash)
  }, [account, poolAddress])

  return { onUnstakeEmergency: handleUnstake }
}

export const useUnstakeV2 = (pid) => {
  const { account } = useKardiachain()

  const handleUnstake = useCallback(
    async (amount) => {
      const masterChefContract = getMasterChefContract()
      const txHash = await unstake(masterChefContract, pid, amount, account, address.masterChefLtd)
      showToastTx(txHash)
      console.log(txHash)
    },
    [account, pid],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
