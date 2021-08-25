import { showToastTx } from 'components/CustomToast/CustomToast'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback } from 'react'
import { fight } from 'utils/callHelpers'
import { getDragonBattleBossContract, getDragonBattleContract } from 'utils/contractHelpers'

const useFight = (battleAddress, method) => {
  const { account } = useKardiachain()

  const handleFight = useCallback(async () => {
    const dragonBattleContract = method === 'fight' ? getDragonBattleContract() : getDragonBattleBossContract()
    const txHash = await fight(dragonBattleContract, account, battleAddress, method)
    showToastTx(txHash)
    console.log(txHash)
  }, [account, battleAddress, method])

  return { onFight: handleFight }
}

export default useFight
