import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFarmsDataAsync } from 'store/farms/index'
import { fetchMiniFarmsDataAsync } from 'store/miniFarms/index'
import {
  fetchCastlesPublicDataAsync,
  fetchCastlesStakingLimitsAsync,
  fetchCastlesV2PublicDataAsync,
} from 'store/castles/index'
import {
  fetchPoolsDataAsync,
  fetchPoolsSouschefPublicDataAsync,
  fetchPoolsSouschefStakingLimitsAsync,
} from 'store/pools/index'
import { getBlockNumber } from 'utils/index'
import { getPrices } from 'utils/priceHelpers'

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await getBlockNumber()

      dispatch(fetchCastlesPublicDataAsync(blockNumber))
      dispatch(fetchPoolsSouschefPublicDataAsync(blockNumber))
      dispatch(fetchCastlesV2PublicDataAsync(blockNumber))
    }

    const fetchCoreFarmData = async () => {
      const prices = await getPrices()

      dispatch(fetchFarmsDataAsync(prices))
      dispatch(fetchMiniFarmsDataAsync(prices))
      dispatch(fetchPoolsDataAsync(prices))
    }

    fetchCoreFarmData()
    fetchPoolsPublicData()

    dispatch(fetchCastlesStakingLimitsAsync())
    dispatch(fetchPoolsSouschefStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}
