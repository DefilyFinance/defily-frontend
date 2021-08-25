import BigNumber from 'bignumber.js'
import { FIELD } from 'constants/miniFarms'
import vaultsConfig, { TYPE_FARM } from 'constants/vaults'
import { getVaultApy, getVaultV2Apy } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'

export const transformVault = (pool) => {
  const { totalStaked, userData, ...rest } = pool

  return {
    ...rest,
    totalStaked: totalStaked ? new BigNumber(totalStaked) : BIG_ZERO,
    userData: transformUserData(userData),
  }
}

export const transformVaultV2 = (pool) => {
  const { totalStaked, totalStakedOfStrategy, totalShare, userData, totalSupply, ...rest } = pool

  return {
    ...rest,
    totalStaked: totalStaked ? new BigNumber(totalStaked) : BIG_ZERO,
    totalStakedOfStrategy: totalStaked ? new BigNumber(totalStakedOfStrategy) : BIG_ZERO,
    totalShare: totalShare ? new BigNumber(totalShare) : BIG_ZERO,
    totalSupply: totalSupply ? new BigNumber(totalSupply) : BIG_ZERO,
    userData: transformUserData(userData),
  }
}

export const transformUserData = (userData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    sharesBalance: userData ? new BigNumber(userData.sharesBalance) : BIG_ZERO,
  }
}

export function getVaultStaked(vaultV2) {
  return vaultsConfig.find(
    (vaultV1) => vaultV1.contractAddress.toLowerCase() === vaultV2.contractVaultStakedAddress.toLowerCase(),
  )
}

export const formatVault = (prices, farms, miniFarms, farmsOutside, vault) => {
  const farmsChosen = {
    [TYPE_FARM.dfl]: farms,
    [TYPE_FARM.ltd]: miniFarms[FIELD.LTD].farmsConfig,
    [TYPE_FARM.chat]: miniFarms[FIELD.CHAT].farmsConfig,
    [TYPE_FARM.beco]: farmsOutside.filter((farm) => farm.type === TYPE_FARM.beco),
    [TYPE_FARM.bds]: farmsOutside.filter((farm) => farm.type === TYPE_FARM.bds),
  }

  const farmsToFind = farmsChosen[vault.typeFarm]

  const farm =
    farmsToFind && farmsToFind?.find((farm) => farm?.lpAddress.toLowerCase() === vault.lpTokenAddress.toLowerCase())

  const apy = getVaultApy(farm?.apr?.weeklyAPR, vault.fees)

  const stakingTokenPrice = getParameterCaseInsensitive(prices, vault.lpTokenAddress)

  const usdTotalStaked = stakingTokenPrice
    ? new BigNumber(getFullDisplayBalance(vault.totalStaked, vault.decimals)).times(stakingTokenPrice).toNumber()
    : 0

  return {
    ...vault,
    apy: apy,
    apr: farm?.apr,
    stakedTvl: usdTotalStaked,
  }
}

export const formatVaultV2 = (prices, farms, miniFarms, farmsOutside, vault) => {
  const farmsChosen = {
    [TYPE_FARM.dfl]: farms,
    [TYPE_FARM.ltd]: miniFarms[FIELD.LTD].farmsConfig,
    [TYPE_FARM.chat]: miniFarms[FIELD.CHAT].farmsConfig,
    [TYPE_FARM.beco]: farmsOutside.filter((farm) => farm.type === TYPE_FARM.beco),
    [TYPE_FARM.bds]: farmsOutside.filter((farm) => farm.type === TYPE_FARM.bds),
  }

  const vaultStaked = getVaultStaked(vault)

  const farmsToFind = farmsChosen[vault.typeFarm]
  const farmsOfVaultStakedToFind = farmsChosen[vaultStaked.typeFarm]

  const farm =
    farmsToFind &&
    farmsToFind?.find((farm) => {
      return farm?.lpAddress.toLowerCase() === vault.lpTokenAddress.toLowerCase()
    })

  const farmOfVaultStaked =
    farmsOfVaultStakedToFind &&
    farmsOfVaultStakedToFind?.find((farm) => {
      return farm?.lpAddress.toLowerCase() === vaultStaked.lpTokenAddress.toLowerCase()
    })

  const apy = getVaultV2Apy(
    farm?.apr?.weeklyAPR,
    farmOfVaultStaked?.apr?.weeklyAPR,
    vault.fees,
    vaultStaked.fees,
    vault.typeStrategy,
  )

  return {
    ...vault,
    apy: apy,
    apr: farm?.apr,
  }
}

export const calculatorStakedBalanceOfVaultV2 = (
  vault,
  userData,
  priceStakingTokenInVaultStaked,
  priceStakingToken,
  decimalsStakingToken,
  decimalsStrategyStakingToken,
) => {
  const stakedBalanceInVaultStaked = new BigNumber(
    userData.sharesBalance.div(vault.totalShare).times(vault.totalStakedOfStrategy),
  )

  const stakedBalanceInVaultStakedFollowStakingToken = stakedBalanceInVaultStaked
    .times(priceStakingTokenInVaultStaked)
    .div(priceStakingToken)
    .div(BIG_TEN.pow(decimalsStrategyStakingToken - decimalsStakingToken))

  const totalStakedBalance = stakedBalanceInVaultStakedFollowStakingToken.plus(userData.stakedBalance)

  return {
    stakedBalanceInVaultStaked:
      stakedBalanceInVaultStaked.isNaN() || !stakedBalanceInVaultStaked.isFinite()
        ? BIG_ZERO
        : stakedBalanceInVaultStaked,
    stakedBalanceOfVault: userData.stakedBalance,
    totalStakedBalance: totalStakedBalance.isNaN() || !totalStakedBalance.isFinite() ? BIG_ZERO : totalStakedBalance,
  }
}
