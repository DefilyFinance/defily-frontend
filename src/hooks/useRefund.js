import { useCallback } from 'react'
import useKardiachain from './useKardiachain'
import { getIdoContract } from '../utils/contractHelpers'
import { showToastTx } from '../components/CustomToast/CustomToast'
import { refundIdo } from '../utils/callHelpers'

const useRefund = (idoAddress, option) => {
  const { account } = useKardiachain()
  const handleRefund = useCallback(async () => {
    const idoContract = getIdoContract(option)
    const txHash = await refundIdo(idoContract, idoAddress, account)
    showToastTx(txHash)
    console.log(txHash)
  }, [account, idoAddress])

  return { onRefund: handleRefund }
}

export default useRefund
