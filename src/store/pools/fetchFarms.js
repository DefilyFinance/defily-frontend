import { poolsConfig } from 'constants/pools'
import { getFarmsAuto } from 'store/pools/helpers'
import { getContract } from 'utils/contractHelpers'

export const fetchFarms = async (pricesFetch) => {
  const data = Promise.all(
    poolsConfig.map(async (pool) => {
      const masterChefContract = getContract(pool.abi)
      return await getFarmsAuto(
        masterChefContract,
        pool.contractAddress,
        pricesFetch,
        pool.earningToken,
        pool.methodPerBlock,
        pool.type,
      )
    }),
  )

  return data
}

export default fetchFarms
