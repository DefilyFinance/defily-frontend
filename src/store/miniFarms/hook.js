import miniFarmsConfig, { FIELD } from 'constants/miniFarms'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { transformUserData } from 'store/farms/helpers'
import { fetchMiniFarmUserDataAsync } from 'store/miniFarms/index'

export const useMiniFarms = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const [tab, setTab] = useState(FIELD.CHAT)

  const handleChangeTab = (tabSelected) => {
    if (tab !== tabSelected) return setTab(tabSelected)
  }

  useEffect(() => {
    if (account) {
      dispatch(
        fetchMiniFarmUserDataAsync(
          account,
          miniFarmsConfig[FIELD.LTD].farmsConfig,
          miniFarmsConfig[FIELD.LTD].contractAddress,
          FIELD.LTD,
        ),
      )
      dispatch(
        fetchMiniFarmUserDataAsync(
          account,
          miniFarmsConfig[FIELD.CHAT].farmsConfig,
          miniFarmsConfig[FIELD.CHAT].contractAddress,
          FIELD.CHAT,
        ),
      )
    }
  }, [account, dispatch, fastRefresh])

  const { dataStore } = useSelector((state) => ({
    dataStore: state.miniFarms.data,
  }))

  const farms = useMemo(() => {
    if (tab === FIELD.LTD)
      return dataStore[FIELD.LTD].farmsConfig.map((farm) => ({
        ...farm,
        userData: transformUserData(farm.userData),
      }))
    return dataStore[FIELD.CHAT].farmsConfig.map((farm) => ({ ...farm, userData: transformUserData(farm.userData) }))
  }, [dataStore, tab])

  const data = useMemo(() => {
    if (tab === FIELD.LTD) return dataStore[FIELD.LTD]
    return dataStore[FIELD.CHAT]
  }, [dataStore, tab])

  return {
    data,
    farms,
    userDataLoaded: data.userDataLoaded,
    tab,
    onChangeTab: handleChangeTab,
  }
}

export const useMiniFarmsNoAccount = () => {
  const farms = useSelector((state) => state.miniFarms.data)
  return farms
}
