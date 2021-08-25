import { showToastTx } from 'components/CustomToast/CustomToast'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback } from 'react'
import { withdraw } from 'utils/callHelpers'
import { getVaultContract } from 'utils/contractHelpers'

const useWithdraw = (vaultAddress) => {
  const { account } = useKardiachain()

  const handleWithdraw = useCallback(
    async (amount, decimals) => {
      const vaultContract = getVaultContract()
      const txHash = await withdraw(vaultContract, vaultAddress, amount, account, decimals)
      showToastTx(txHash)
      console.log(txHash)
    },
    [account, vaultAddress],
  )

  return { onWithdraw: handleWithdraw }
}

export default useWithdraw
