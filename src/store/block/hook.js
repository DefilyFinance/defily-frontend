import { useDispatch, useSelector } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { getBlockNumber } from 'utils'
import { setBlock } from './index'
import { useEffect } from 'react'
import { fetchPricesDataAsync } from '../prices'

export const usePollBlockNumber = () => {
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()

  const fetchBlock = async () => {
    const blockNumber = await getBlockNumber()
    dispatch(setBlock(blockNumber))
  }

  useEffect(() => {
    fetchBlock()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchBlock()
    }, 6000)

    dispatch(fetchPricesDataAsync())

    return () => clearInterval(interval)
  }, [dispatch, fastRefresh])
}

export const useBlock = () => {
  return useSelector((state) => state.block)
}

export const useCurrentBlock = () => {
  return useSelector((state) => state.block.currentBlock)
}
