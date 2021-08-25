import useKardiachain from 'hooks/useKardiachain'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import masterChefABI from 'config/abi/masterchef.json'
import useRefresh from 'hooks/useRefresh'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

const useFarmsWithBalance = (farms, masterChefAddress) => {
  const { account } = useKardiachain()
  const [farmsWithStakedBalance, setFarmsWithStakedBalance] = useState([])
  const [earningsSum, setEarningsSum] = useState(null)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farms.map((farm) => ({
        address: masterChefAddress,
        name: 'pendingRewards',
        params: [farm.pid, account],
      }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = farms.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
      const farmsWithBalances = results.filter((balanceType) => balanceType.balance.gt(0))
      const totalEarned = farmsWithBalances.reduce((accum, earning) => {
        const earningNumber = new BigNumber(earning.balance)
        if (earningNumber.eq(0)) {
          return accum
        }
        return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
      }, 0)

      setFarmsWithStakedBalance(farmsWithBalances)
      setEarningsSum(totalEarned)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, farms, fastRefresh, masterChefAddress])

  return { farmsWithStakedBalance, earningsSum }
}

export default useFarmsWithBalance
