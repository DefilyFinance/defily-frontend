import BigNumber from 'bignumber.js'
import { getPoolPrices, getToken } from 'store/farms/helpers'
import { getFarmApr } from 'utils/apr'
import { BIG_TEN } from 'utils/bigNumber'
import { getParameterCaseInsensitive } from 'utils/index'
import multicall from 'utils/multicall'
import masterChefAbi from 'config/abi/masterchef.json'

export const getFarms = async (farmsToFetch, masterChefAddress, prices = {}, earningToken) => {
  const [[totalAllocPointsRes], [rewardsPerBlockRes]] = await multicall(masterChefAbi, [
    {
      address: masterChefAddress,
      name: 'totalAllocPoint',
    },
    {
      address: masterChefAddress,
      name: 'rewardPerBlock',
    },
  ])

  const totalAllocPoints = new BigNumber(totalAllocPointsRes._hex)
  const rewardsPerBlock = new BigNumber(rewardsPerBlockRes._hex).div(BIG_TEN.pow(earningToken.decimals))

  const poolInfosFetch = await Promise.all(
    farmsToFetch.map(async (pool) => {
      const poolToken = await getToken(pool.lpAddress, masterChefAddress)

      return {
        ...pool,
        ...poolToken,
      }
    }),
  )

  const poolPrices = poolInfosFetch.map((poolInfo) => {
    return {
      ...getPoolPrices(prices, poolInfo),
      ...poolInfo,
    }
  })

  const earningTokenPrice = getParameterCaseInsensitive(prices, earningToken.address)

  const farmsInfo = poolPrices.map((farm) => {
    let stakedTvl = Number.isNaN(farm?.stakedTvl) ? 0 : farm?.stakedTvl ?? 0

    const apr = getFarmApr(totalAllocPoints, farm.allocPoint, rewardsPerBlock, earningTokenPrice, stakedTvl, farm.pid)

    prices[farm.lpAddress] = farm.price

    return {
      apr,
      mul: farm.allocPoint / 100,
      ...farm,
      earningTokenPrice: earningTokenPrice,
    }
  })

  return {
    prices,
    farms: farmsInfo,
  }
}
