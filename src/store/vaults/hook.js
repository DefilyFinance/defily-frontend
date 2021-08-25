import useKardiachain from 'hooks/useKardiachain'
import { useDispatch, useSelector } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import {
  fetchVaultsTotalStakedDataAsync,
  fetchVaultsV2PublicDataAsync,
  fetchVaultUserDataAsync,
  fetchVaultV2UserDataAsync,
} from './index'
import { transformVault, transformVaultV2 } from './helpers'

export const useFetchVaultsPublicData = () => {
  const { account } = useKardiachain()
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchVaultsTotalStakedDataAsync())
    dispatch(fetchVaultsV2PublicDataAsync())
  }, [dispatch, slowRefresh, account])
}

export const useVaults = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useKardiachain()

  useEffect(() => {
    if (account) {
      dispatch(fetchVaultUserDataAsync(account))
      dispatch(fetchVaultV2UserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { vaults, userDataLoaded, vaultsV2, userDataLoadedV2 } = useSelector((state) => ({
    vaults: state.vaults.data,
    vaultsV2: state.vaults.dataV2,
    userDataLoaded: state.vaults.userDataLoaded,
    userDataLoadedV2: state.vaults.userDataLoadedV2,
  }))

  return {
    vaults: vaults.map(transformVault),
    userDataLoaded,
    vaultsV2: vaultsV2.map(transformVaultV2),
    userDataLoadedV2,
  }
}

export const useVaultsNoAccount = () => {
  const { vaults, vaultsV2 } = useSelector((state) => ({
    vaults: state.vaults.data,
    vaultsV2: state.vaults.dataV2,
  }))

  return { vaults: vaults.map(transformVault), vaultsV2: vaultsV2.map(transformVaultV2) }
}
