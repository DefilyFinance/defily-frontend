import { showToastTx } from 'components/CustomToast/CustomToast'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback } from 'react'
import { deposit, investKai } from 'utils/callHelpers'
import { getIdoContract, getVaultContract } from 'utils/contractHelpers'
import tokens from '../constants/tokens'

const useDeposit = (vaultAddress) => {
  const { account } = useKardiachain()

  const handleDeposit = useCallback(
    async (amount, decimals) => {
      const vaultContract = getVaultContract()
      const txHash = await deposit(vaultContract, vaultAddress, amount, account, decimals)
      showToastTx(txHash)
      console.log(txHash)
    },
    [account, vaultAddress],
  )

  return { onDeposit: handleDeposit }
}

export const useInvestIdo = (idoAddress, option) => {
  const { account } = useKardiachain()

  const handleInvest = useCallback(
    async (amount, decimals, type = tokens.kai.symbol) => {
      if (type === tokens.kai.symbol) {
        const idoContract = getIdoContract(option)
        const txHash = await investKai(idoContract, idoAddress, amount, account, decimals)
        showToastTx(txHash)
        console.log(txHash)
      }
    },
    [idoAddress, account],
  )

  return { onInvest: handleInvest }
}

export default useDeposit
