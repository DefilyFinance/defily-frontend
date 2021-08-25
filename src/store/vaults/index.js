import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import vaultsConfig, { vaultsV2Config } from 'constants/vaults'
import { setPricesData } from 'store/prices/index'
import {
  fetchVaultsTotalStaked,
  fetchVaultsTotalSupply,
  fetchVaultsV2TotalShares,
  fetchVaultsV2TotalStakedOfStrategy,
} from 'store/vaults/fetchVaults'
import {
  fetchUserBalance,
  fetchUserSharesBalance,
  fetchUserStakeBalance,
  fetchVaultAllowance,
  fetchVaultUserAllowances,
  fetchVaultUserStakedBalances,
  fetchVaultUserTokenBalances,
  fetchVaultV2UserShares,
} from 'store/vaults/fetchVaultUser'
import { getVaultStaked } from 'store/vaults/helpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'
import { getPrices } from 'utils/priceHelpers'

const initialState = {
  data: vaultsConfig,
  dataV2: vaultsV2Config,
  userDataLoaded: false,
  userDataLoadedV2: false,
}

export const vaultsSlice = createSlice({
  name: 'vaults',
  initialState,
  reducers: {
    setVaultsPublicData: (state, action) => {
      const liveVaultsData = action.payload
      state.data = state.data.map((vault) => {
        const liveVaultData = liveVaultsData.find((entry) => entry.vid === vault.vid)
        return { ...vault, ...liveVaultData }
      })
    },
    setVaultsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((vault) => {
        const userVaultData = userData.find((entry) => entry.vid === vault.vid)
        return { ...vault, userData: userVaultData }
      })
      state.userDataLoaded = true
    },
    updateVaultsUserData: (state, action) => {
      const { field, value, vid } = action.payload
      const index = state.data.findIndex((p) => p.vid === vid)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
    setVaultsV2PublicData: (state, action) => {
      const liveVaultsData = action.payload
      state.dataV2 = state.dataV2.map((vault) => {
        const liveVaultData = liveVaultsData.find((entry) => entry.vid === vault.vid)
        return { ...vault, ...liveVaultData }
      })
    },
    setVaultsV2UserData: (state, action) => {
      const userData = action.payload
      state.dataV2 = state.dataV2.map((vault) => {
        const userVaultData = userData.find((entry) => entry.vid === vault.vid)
        return { ...vault, userData: userVaultData }
      })
      state.userDataLoadedV2 = true
    },
    updateVaultsV2UserData: (state, action) => {
      const { field, value, vid } = action.payload
      const index = state.dataV2.findIndex((p) => p.vid === vid)

      if (index >= 0) {
        state.dataV2[index] = { ...state.dataV2[index], userData: { ...state.dataV2[index].userData, [field]: value } }
      }
    },
  },
})

// async action

export const fetchVaultsTotalStakedDataAsync = () => async (dispatch) => {
  try {
    const totalStakeds = await fetchVaultsTotalStaked(vaultsConfig)
    const totalStakedsData = vaultsConfig.map((vault, index) => {
      const totalStaked = totalStakeds[index] || BIG_ZERO
      return {
        vid: vault.vid,
        totalStaked: totalStaked.toJSON(),
      }
    })

    dispatch(setVaultsPublicData(totalStakedsData))
  } catch (error) {
    console.log(error)
  }
}

export const fetchVaultUserDataAsync = (account) => async (dispatch) => {
  const promise = [
    fetchVaultUserAllowances(account, vaultsConfig),
    fetchVaultUserTokenBalances(account, vaultsConfig),
    fetchVaultUserStakedBalances(account, vaultsConfig),
  ]
  const response = await Promise.all(promise)

  const allowances = response?.[0]
  const stakingTokenBalances = response?.[1]
  const stakedBalances = response?.[2]

  const userData = vaultsConfig.map((vault, index) => ({
    vid: vault.vid,
    allowance: allowances[index],
    stakingTokenBalance: stakingTokenBalances[index],
    stakedBalance: stakedBalances[index],
  }))

  dispatch(setVaultsUserData(userData))
}

export const updateUserAllowance = (account, vault, isV2) => async (dispatch) => {
  const allowance = await fetchVaultAllowance(account, vault)
  if (isV2) return dispatch(updateVaultsV2UserData({ vid: vault.vid, field: 'allowance', value: allowance }))
  dispatch(updateVaultsUserData({ vid: vault.vid, field: 'allowance', value: allowance }))
}

export const updateUserBalance = (account, vault, isV2) => async (dispatch) => {
  const tokenBalance = await fetchUserBalance(account, vault)
  if (isV2)
    return dispatch(updateVaultsV2UserData({ vid: vault.vid, field: 'stakingTokenBalance', value: tokenBalance }))
  dispatch(updateVaultsUserData({ vid: vault.vid, field: 'stakingTokenBalance', value: tokenBalance }))
}

export const updateUserStakedBalance = (account, vault, isV2) => async (dispatch) => {
  const stakedBalance = await fetchUserStakeBalance(account, vault)
  if (isV2) return dispatch(updateVaultsV2UserData({ vid: vault.vid, field: 'stakedBalance', value: stakedBalance }))
  dispatch(updateVaultsUserData({ vid: vault.vid, field: 'stakedBalance', value: stakedBalance }))
}

export const updateUserSharesBalance = (account, vault) => async (dispatch) => {
  const sharesBalance = await fetchUserSharesBalance(account, vault)
  dispatch(updateVaultsV2UserData({ vid: vault.vid, field: 'sharesBalance', value: sharesBalance }))
}

export const fetchVaultsV2TotalStakedDataAsync = () => async (dispatch) => {
  try {
    const promise = [
      fetchVaultsTotalStaked(vaultsV2Config),
      fetchVaultsV2TotalStakedOfStrategy(),
      fetchVaultsV2TotalShares(),
    ]
    const response = await Promise.all(promise)

    const totalStakeds = response?.[0]
    const totalStakedsOfStrategy = response?.[1]
    const totalShares = response?.[2]

    const totalStakedsData = vaultsV2Config.map((vault, index) => {
      const totalStaked = totalStakeds[index] || BIG_ZERO
      const totalStakedOfStrategy = totalStakedsOfStrategy[index] || BIG_ZERO
      const totalShare = totalShares[index] || BIG_ZERO
      return {
        vid: vault.vid,
        totalStaked: totalStaked.toJSON(),
        totalStakedOfStrategy: totalStakedOfStrategy.toJSON(),
        totalShare: totalShare.toJSON(),
      }
    })

    dispatch(setVaultsV2PublicData(totalStakedsData))
  } catch (error) {
    console.log(error)
  }
}

export const fetchVaultsV2PublicDataAsync = () => async (dispatch, getState) => {
  const promise = [
    fetchVaultsTotalStaked(vaultsV2Config),
    fetchVaultsV2TotalStakedOfStrategy(),
    fetchVaultsV2TotalShares(),
    fetchVaultsTotalSupply(vaultsV2Config),
  ]

  const response = await Promise.all(promise)

  const totalStakings = response?.[0]
  const totalStakingOfStrategy = response?.[1]
  const totalShares = response?.[2]
  const totalSupplys = response?.[3]

  const prices = getState()?.prices?.data || (await getPrices())
  const newPrices = { ...prices }

  const liveData = vaultsV2Config.map((vault, index) => {
    const vaultStaked = getVaultStaked(vault)
    const totalStaked = totalStakings[index] || BIG_ZERO
    const totalStakedOfStrategy = totalStakingOfStrategy[index] || BIG_ZERO
    const totalShare = totalShares[index] || BIG_ZERO
    const totalSupply = totalSupplys.find((entry) => entry.vid === vault.vid).totalSupply

    const stakingTokenPrice = getParameterCaseInsensitive(prices, vault.lpTokenAddress) || 0
    const stakingTokenPriceInVaultStaked = getParameterCaseInsensitive(prices, vaultStaked.lpTokenAddress)

    const usdTotalStakedInVault = stakingTokenPrice
      ? new BigNumber(getFullDisplayBalance(totalStaked, vault.decimals)).times(stakingTokenPrice).toNumber()
      : 0

    const usdTotalStakedStrategyInVaultStaked = stakingTokenPriceInVaultStaked
      ? new BigNumber(getFullDisplayBalance(totalStakedOfStrategy, vaultStaked.decimals))
          .times(stakingTokenPriceInVaultStaked)
          .toNumber()
      : 0

    const stakedTvl = usdTotalStakedInVault + usdTotalStakedStrategyInVaultStaked

    const receiptTokenPrice = new BigNumber(stakedTvl).div(totalSupply).times(DEFAULT_TOKEN_DECIMAL).toNumber()

    newPrices[vault.contractAddress] = receiptTokenPrice

    return {
      ...vault,
      stakedTvl,
      totalSupply,
      receiptTokenPrice: receiptTokenPrice,
      totalStaked: totalStaked.toJSON(),
      totalStakedOfStrategy: totalStakedOfStrategy.toJSON(),
      totalShare: totalShare.toJSON(),
    }
  })

  dispatch(setVaultsV2PublicData(liveData))
  dispatch(setPricesData(newPrices))
}

export const fetchVaultV2UserDataAsync = (account) => async (dispatch) => {
  const promise = [
    fetchVaultUserAllowances(account, vaultsV2Config),
    fetchVaultUserTokenBalances(account, vaultsV2Config),
    fetchVaultUserStakedBalances(account, vaultsV2Config),
    fetchVaultV2UserShares(account, vaultsV2Config),
  ]
  const response = await Promise.all(promise)

  const allowances = response?.[0]
  const stakingTokenBalances = response?.[1]
  const stakedBalances = response?.[2]
  const sharesBalances = response?.[3]

  const userData = vaultsV2Config.map((vault, index) => ({
    vid: vault.vid,
    allowance: allowances[index],
    stakingTokenBalance: stakingTokenBalances[index],
    stakedBalance: stakedBalances[index],
    sharesBalance: sharesBalances[index],
  }))

  dispatch(setVaultsV2UserData(userData))
}

// Actions
export const {
  setVaultsPublicData,
  setVaultsUserData,
  updateVaultsUserData,
  setVaultsV2PublicData,
  setVaultsV2UserData,
  updateVaultsV2UserData,
} = vaultsSlice.actions
export default vaultsSlice.reducer
