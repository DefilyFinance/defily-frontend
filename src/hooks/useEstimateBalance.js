import BigNumber from 'bignumber.js'
import castlesConfig, { castlesV2Config } from 'constants/castles'
import { CASTLE_TAGS } from 'constants/index'
import { FIELD } from 'constants/miniFarms'
import vaultsConfig, { vaultsV2Config } from 'constants/vaults'
import useKardiachain from 'hooks/useKardiachain'
import { useAllStakedBalance } from 'hooks/useStakedBalance'
import { useMemo } from 'react'
import { usePrices } from 'store/prices/hook'
import { formatVault, formatVaultV2 } from 'store/vaults/helpers'
import { getParameterCaseInsensitive } from 'utils/index'
import { useVaultsNoAccount } from 'store/vaults/hook'
import { useGetPoolsFarms } from 'store/pools/hook'
import { useCastlesNoAccount } from 'store/castles/hook'
import { useMiniFarmsNoAccount } from 'store/miniFarms/hook'
import { useFarmsNoAccount } from 'store/farms/hook'

const useEstimateBalance = () => {
  const farms = useFarmsNoAccount()
  const miniFarms = useMiniFarmsNoAccount()
  const farmsOutside = useGetPoolsFarms()
  const pools = useCastlesNoAccount()
  const { vaults, vaultsV2 } = useVaultsNoAccount()
  const prices = usePrices()
  const allStakedBalance = useAllStakedBalance()
  const { account } = useKardiachain()

  const poolsActive = useMemo(() => pools.filter((pool) => !pool.isHide), [pools])

  const totalUserStaked = useMemo(() => {
    if (!farms || !allStakedBalance || !account || !miniFarms) {
      return undefined
    }

    const castleActive = castlesConfig.filter((castle) => !castle.tags.includes(CASTLE_TAGS.ifo))

    const allPools = [
      ...farms,
      ...miniFarms[FIELD.LTD].farmsConfig,
      ...miniFarms[FIELD.CHAT].farmsConfig,
      ...castleActive,
      ...castlesV2Config,
      ...vaultsConfig,
      ...vaultsV2Config,
    ]

    const total = allPools.reduce((acc, pool, index) => {
      if (pool.lpAddress) {
        return acc.plus(new BigNumber(allStakedBalance[index]).times(pool.price || 0))
      } else {
        const price = getParameterCaseInsensitive(prices, pool?.stakingToken?.address || pool?.lpTokenAddress)
        return acc.plus(new BigNumber(allStakedBalance[index]).times(price || 0))
      }
    }, new BigNumber(0))

    return total.isNaN() ? new BigNumber(0) : total
  }, [account, allStakedBalance, farms, miniFarms, prices])

  const averageApr = useMemo(() => {
    if (!farms || !allStakedBalance || !account || !poolsActive) {
      return undefined
    }

    const castleActive = castlesConfig.filter((castle) => !castle.tags.includes(CASTLE_TAGS.ifo))

    const totalPools = [
      ...farms,
      ...miniFarms[FIELD.LTD].farmsConfig,
      ...miniFarms[FIELD.CHAT].farmsConfig,
      ...castleActive,
      ...castlesV2Config,
      ...vaults,
      ...vaultsV2,
    ]

    const totalAverageApr = totalPools.reduce((acc, pool, index) => {
      if (pool.lpAddress) {
        const userStakedUsd = new BigNumber(allStakedBalance[index]).times(pool.price)
        if (userStakedUsd.isGreaterThan(0) && pool?.apr?.yearlyAPR) {
          return acc.plus(userStakedUsd.times(pool.apr.yearlyAPR).div(100))
        }
        return acc
      } else if (pool.contractVaultStakedAddress) {
        const vaultFormat = formatVaultV2(prices, farms, miniFarms, farmsOutside, pool)
        const price = getParameterCaseInsensitive(prices, pool?.lpTokenAddress)
        const userStakedUsd = new BigNumber(allStakedBalance[index]).times(price || 0)

        return acc.plus(new BigNumber(userStakedUsd).times(vaultFormat?.apy?.yearlyApy).div(100))
      } else if (pool.lpTokenAddress) {
        const vaultFormat = formatVault(prices, farms, miniFarms, farmsOutside, pool)
        const price = getParameterCaseInsensitive(prices, pool?.lpTokenAddress)
        const userStakedUsd = new BigNumber(allStakedBalance[index]).times(price || 0)

        return acc.plus(new BigNumber(userStakedUsd).times(vaultFormat?.apy?.yearlyApy || 0).div(100))
      } else {
        const price = getParameterCaseInsensitive(prices, pool?.stakingToken?.address)
        const userStakedUsd = new BigNumber(allStakedBalance[index]).times(price || 0)
        if (userStakedUsd.isGreaterThan(0) && pool?.apr) {
          return acc.plus(userStakedUsd.times(pool?.apr).div(100))
        }
        return acc
      }
    }, new BigNumber(0))

    const result = totalAverageApr.div(totalUserStaked).times(100)

    return result.isNaN() ? new BigNumber(0) : result
  }, [
    account,
    allStakedBalance,
    farms,
    farmsOutside,
    miniFarms,
    poolsActive,
    prices,
    totalUserStaked,
    vaults,
    vaultsV2,
  ])

  return { totalUserStaked, averageApr }
}

export default useEstimateBalance
