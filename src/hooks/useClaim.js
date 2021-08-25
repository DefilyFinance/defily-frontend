import useKardiachain from './useKardiachain'
import { useCallback } from 'react'
import { getIdoContract } from 'utils/contractHelpers'
import { showToastTx } from 'components/CustomToast/CustomToast'
import { claimIdo } from 'utils/callHelpers'

const useClaim = (idoAddress, option) => {
  const { account } = useKardiachain()

  const handleClaim = useCallback(async () => {
    const idoContract = getIdoContract(option)
    const txHash = await claimIdo(idoContract, idoAddress, account)
    showToastTx(txHash)
    console.log(txHash)
  }, [account, idoAddress])

  return { onClaim: handleClaim }
}

export default useClaim
