import { useDispatch, useSelector } from 'react-redux'
import { transformUserData } from 'store/farms/helpers'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { fetchFarmUserDataAsync } from './index'

export const useFarms = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useKardiachain()

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { farms, userDataLoaded } = useSelector((state) => ({
    farms: state.farms.data,
    userDataLoaded: state.farms.userDataLoaded,
  }))

  return {
    farms: farms.map((farm) => ({ ...farm, userData: transformUserData(farm.userData) })),
    userDataLoaded,
  }
}

export const useFarmsNoAccount = () => {
  const farms = useSelector((state) => state.farms.data)

  return farms
}

export const useFarmsByLpAddress = (address) => {
  const farms = useSelector((state) => state.farms.data?.filter((item) => address.includes(item?.lpAddress)))

  const farmSorts = address.reduce((result, current) => {
    const farm = farms?.find((item) => item.lpAddress === current)
    if (farm) return [...result, farm]
    return result
  }, [])
  return farmSorts
}
