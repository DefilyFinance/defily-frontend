import address from 'constants/contracts'
import { FIELD } from 'constants/miniFarms'
import { TYPE_FARM } from 'constants/vaults'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { isArchivedPid } from 'store/farms/helpers'
import { useFetchActiveLand } from 'store/lands/hook'
import { usePrices } from 'store/prices/hook'
import { formatVaultV2 } from 'store/vaults/helpers'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'
import { useVaultsNoAccount } from 'store/vaults/hook'
import { useGetPoolsFarms } from 'store/pools/hook'
import { useCastlesNoAccount } from 'store/castles/hook'
import { useMiniFarmsNoAccount } from 'store/miniFarms/hook'
import { useFarmsNoAccount } from 'store/farms/hook'

const useTotalValueLocked = () => {
  const farms = useFarmsNoAccount()
  const miniFarms = useMiniFarmsNoAccount()
  const pools = useCastlesNoAccount()
  const farmsOutside = useGetPoolsFarms()
  const activeFarms = farms.filter((farm) => !isArchivedPid(farm.pid))
  const { vaults, vaultsV2 } = useVaultsNoAccount()
  const prices = usePrices()
  useFetchActiveLand()

  const vaultsGetTvl = vaults
    .filter((vault) => vault.typeFarm !== TYPE_FARM.dfl)
    .filter((vault) => vault.typeFarm !== TYPE_FARM.ltd)
  const vaultsV2GetTvl = vaultsV2.filter((vault) => vault.typeFarm !== TYPE_FARM.dfl)

  const totalValueLocked = useMemo(() => {
    if (!activeFarms.length) return new BigNumber(0)
    const totalFarmsTVL = activeFarms.reduce((accum, farm) => {
      let stakedTvl = Number.isNaN(farm?.stakedTvl) ? 0 : farm?.stakedTvl ?? 0

      return accum.plus(new BigNumber(stakedTvl))
    }, new BigNumber(0))

    const totalMiniFarmsTVLLTD = miniFarms[FIELD.LTD].farmsConfig.reduce((accum, farm) => {
      let stakedTvl = Number.isNaN(farm?.stakedTvl) ? 0 : farm?.stakedTvl ?? 0

      return accum.plus(new BigNumber(stakedTvl))
    }, new BigNumber(0))

    const totalMiniFarmsTVLCHAT = miniFarms[FIELD.CHAT].farmsConfig.reduce((accum, farm) => {
      let stakedTvl = Number.isNaN(farm?.stakedTvl) ? 0 : farm?.stakedTvl ?? 0

      return accum.plus(new BigNumber(stakedTvl))
    }, new BigNumber(0))

    const totalPoolsTVL = pools.reduce((accum, pool) => {
      let stakedTvl = Number.isNaN(pool?.stakedTvl) ? 0 : pool?.stakedTvl ?? 0

      return accum.plus(new BigNumber(stakedTvl))
    }, new BigNumber(0))

    const totalVaultsTVL = vaultsGetTvl.reduce((accum, vault) => {
      const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
      const usdTotalStaked = priceStakingToken
        ? new BigNumber(getFullDisplayBalance(vault.totalStaked, vault.decimals)).times(priceStakingToken).toNumber()
        : 0

      return accum.plus(new BigNumber(usdTotalStaked))
    }, new BigNumber(0))

    const totalVaultsV2TVL = vaultsV2GetTvl.reduce((accum, vault) => {
      const formatVaults = formatVaultV2(prices, farms, miniFarms, farmsOutside, vault)

      return accum.plus(new BigNumber(formatVaults.stakedTvl))
    }, new BigNumber(0))

    const priceDragon = getParameterCaseInsensitive(prices, address.defily)

    return totalFarmsTVL
      .plus(totalPoolsTVL)
      .plus(totalMiniFarmsTVLLTD)
      .plus(totalMiniFarmsTVLCHAT)
      .plus(totalVaultsTVL)
      .plus(totalVaultsV2TVL)
  }, [activeFarms, farms, farmsOutside, miniFarms, pools, prices, vaultsGetTvl, vaultsV2GetTvl])

  return totalValueLocked
}

export default useTotalValueLocked
