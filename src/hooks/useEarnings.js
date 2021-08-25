import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useState } from 'react'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getMasterChefContract, getSouschefContract } from 'utils/contractHelpers'

const useEarnings = (pid) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { fastRefresh } = useRefresh()
  const { account } = useKardiachain()

  useEffect(() => {
    const fetchBalanceEarned = async () => {
      try {
        const masterChefContract = getMasterChefContract()
        const balance = await callHelpers(masterChefContract, address.masterChef, 'pendingRewards', [pid, account])
        setBalance(new BigNumber(balance))
      } catch (e) {}
    }

    if (account) {
      fetchBalanceEarned()
    }
  }, [account, fastRefresh, pid])

  return balance
}

export default useEarnings

export const useEarningsPool = (poolAddress) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { fastRefresh } = useRefresh()
  const { account } = useKardiachain()

  useEffect(() => {
    const fetchBalanceEarned = async () => {
      try {
        const souschefContract = getSouschefContract()
        const balance = await callHelpers(souschefContract, poolAddress, 'pendingReward', [account])
        setBalance(new BigNumber(balance))
      } catch (e) {
        console.log(e)
      }
    }

    if (account) {
      fetchBalanceEarned()
    }
  }, [account, fastRefresh, poolAddress])

  return balance
}
