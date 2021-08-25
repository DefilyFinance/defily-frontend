import { FIELD } from 'constants/miniFarms'
import { TYPE_FARM } from 'constants/vaults'
import { useVaultsNoAccount } from '../vaults/hook'
import { useSelector } from 'react-redux'
import { isArchivedPid } from '../farms/helpers'
import { formatVault, formatVaultV2 } from '../vaults/helpers'
import { useMemo } from 'react'
import { useCurrentBlock } from '../block/hook'
import { useCastlesNoAccount } from '../castles/hook'
import { useMiniFarmsNoAccount } from '../miniFarms/hook'
import { useFarmsNoAccount } from '../farms/hook'
import { usePrices } from '../prices/hook'

export const usePools = () => {
  const currentBlock = useCurrentBlock()
  const prices = usePrices()
  const farms = useFarmsNoAccount()
  const miniFarms = useMiniFarmsNoAccount()
  const castles = useCastlesNoAccount()
  const { vaults, vaultsV2 } = useVaultsNoAccount()
  const farmsOutside = useSelector((state) => state.pools.farms)
  const pools = useSelector((state) => state.pools.pools)

  const farmsActive = farms
    .filter((farm) => !isArchivedPid(farm.pid))
    .map((farm) => ({
      ...farm,
      logo: 'dfl.png',
      route: `/farms`,
    }))

  // include beco farm,..
  const farmsOutsideActive = farmsOutside.map((farm) => ({
    ...farm,
    logo: farm.type === TYPE_FARM.beco ? 'beco.png' : 'bds.png',
    icon: `${farm.symbol.toLowerCase()}.png`,
    lpAddress: farm.lpToken,
    link:
      farm.type === TYPE_FARM.beco
        ? farm.symbol.includes('KLP')
          ? 'https://becoswap.com/farms' + ''
          : `https://becoswap.com/pools`
        : 'https://dapp.bigbds.io/farms',
  }))

  const poolsActive = pools
    .filter((pool) => !pool.isFinished)
    .map((pool) => ({
      ...pool,
      link: 'https://becoswap.com/pools',
      currentBlock,
    }))

  const castlesActive = castles
    .filter((pool) => !pool.isHide)
    .filter((pool) => !pool.isFinished)
    .map((pool) => ({
      ...pool,
      route: `/castles`,
      currentBlock,
    }))

  const miniFarmsActiveLTD = miniFarms[FIELD.LTD].farmsConfig.map((farm) => ({
    ...farm,
    logo: 'ltd.png',
    route: `/mini-farm`,
  }))

  const miniFarmsActiveCHAT = miniFarms[FIELD.CHAT].farmsConfig.map((farm) => ({
    ...farm,
    logo: 'chat.png',
    route: `/mini-farm`,
  }))

  const vaultsActive = vaults.map((vault) => {
    const vaultFormat = formatVault(prices, farms, miniFarms, farmsOutsideActive, vault)

    return {
      symbol: vault.token1 ? 'KLP' : '',
      ...vaultFormat,
      isVault: true,
      t0: vault.token0,
      t1: vault.token1,
      lpAddress: vault.lpTokenAddress,
      route: `/vaults`,
    }
  })

  const vaultsV2Active = vaultsV2.map((vault) => {
    const vaultFormat = formatVaultV2(prices, farms, miniFarms, farmsOutsideActive, vault)

    return {
      symbol: vault.token1 ? 'KLP' : '',
      ...vaultFormat,
      isVault: true,
      t0: vault.token0,
      t1: vault.token1,
      lpAddress: vault.lpTokenAddress,
      route: `/vaults`,
    }
  })

  return useMemo(
    () => [
      ...farmsActive,
      ...miniFarmsActiveLTD,
      ...miniFarmsActiveCHAT,
      ...vaultsActive,
      ...vaultsV2Active,
      ...castlesActive,
      ...poolsActive,
      ...farmsOutsideActive,
    ],
    [
      farmsActive,
      miniFarmsActiveLTD,
      miniFarmsActiveCHAT,
      farmsOutsideActive,
      castlesActive,
      poolsActive,
      vaultsActive,
      vaultsV2Active,
    ],
  )
}

export const useGetPoolsFarms = () => {
  const farms = useSelector((state) => state.pools.farms)
  return farms
}
