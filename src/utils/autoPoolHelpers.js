import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import { getParameterCaseInsensitive } from 'utils/index'
import multicall from 'utils/multicall'

import erc20 from 'config/abi/erc20.json'
import UNIV2PairAbi from 'config/abi/lpToken.json'

export async function getUniPool(abi, poolAddress, masterChefAddress) {
  const calls = [
    {
      address: poolAddress,
      name: 'getReserves',
    },
    {
      address: poolAddress,
      name: 'token0',
    },
    {
      address: poolAddress,
      name: 'token1',
    },
    {
      address: poolAddress,
      name: 'symbol',
    },
    {
      address: poolAddress,
      name: 'decimals',
    },
    {
      address: poolAddress,
      name: 'totalSupply',
    },
    {
      address: poolAddress,
      name: 'balanceOf',
      params: [masterChefAddress],
    },
  ]

  const [reserves, [token0], [token1], [symbol], [decimals], totalSupply, staked] = await multicall(abi, calls)

  return {
    symbol,
    tokens: [token0, token1],
    token0,
    token1,
    decimals,
    address: poolAddress,
    q0: reserves._reserve0._hex,
    q1: reserves._reserve1._hex,
    totalSupply: new BigNumber(totalSupply).div(new BigNumber(10).pow(decimals)),
    // unstaked: new BigNumber(unstaked).div(new BigNumber(10).pow(decimals)),
    staked: new BigNumber(staked).div(new BigNumber(10).pow(decimals)),
  }
}

export async function getErc20(abi, tokenAddress, masterChefAddress) {
  const calls = [
    {
      address: tokenAddress,
      name: 'totalSupply',
    },
    {
      address: tokenAddress,
      name: 'symbol',
    },
    {
      address: tokenAddress,
      name: 'decimals',
    },
    {
      address: tokenAddress,
      name: 'balanceOf',
      params: [masterChefAddress],
    },
  ]

  const [totalSupply, [symbol], [decimals], staked] = await multicall(abi, calls)

  return {
    decimals,
    symbol,
    address: tokenAddress,
    totalSupply: new BigNumber(totalSupply).div(new BigNumber(10).pow(decimals)),
    staked: new BigNumber(staked).div(new BigNumber(10).pow(decimals)),
    tokens: [tokenAddress],
  }
}

export async function getStoredToken(type, tokenAddress, masterChefAddress) {
  switch (type) {
    case 'uniswap':
      return await getUniPool(UNIV2PairAbi, tokenAddress, masterChefAddress)
    case 'erc20':
      return await getErc20(erc20, tokenAddress, masterChefAddress)
  }
}

export async function getToken(tokenAddress, masterChefAddress) {
  let type = window.localStorage.getItem(tokenAddress)

  if (tokenAddress.toLowerCase() === address.wKai.toLowerCase()) {
    type = 'erc20'
  }

  if (type) return getStoredToken(type, tokenAddress, masterChefAddress)

  try {
    const uniPool = await getUniPool(UNIV2PairAbi, tokenAddress, masterChefAddress)
    window.localStorage.setItem(tokenAddress, 'uniswap')
    return uniPool
  } catch (e) {
    console.log('e')
    console.log(e)
  }

  try {
    const erc20tok = await getErc20(erc20, tokenAddress, masterChefAddress)
    window.localStorage.setItem(tokenAddress, 'erc20')
    return erc20tok
  } catch (e) {
    console.log(e)
  }
}

const getUniPrices = (tokens, prices, pool) => {
  var t0 = getParameterCaseInsensitive(tokens, pool.token0)
  var p0 = getParameterCaseInsensitive(prices, pool.token0)
  var t1 = getParameterCaseInsensitive(tokens, pool.token1)
  var p1 = getParameterCaseInsensitive(prices, pool.token1)
  if (p0 == null && p1 == null) {
    console.log(`Missing prices for tokens ${pool.token0} and ${pool.token1}.`)
    return undefined
  }
  if (t0?.decimals == null) {
    console.log(`Missing information for token ${pool.token0}.`)
    return undefined
  }
  if (t1?.decimals == null) {
    console.log(`Missing information for token ${pool.token1}.`)
    return undefined
  }

  var q0 = pool.q0 / 10 ** t0.decimals
  var q1 = pool.q1 / 10 ** t1.decimals
  if (p0 == null) {
    p0 = (q1 * p1) / q0
    prices[pool.token0] = p0
  }
  if (p1 == null) {
    p1 = (q0 * p0) / q1
    prices[pool.token1] = { p1 }
  }
  var tvl = q0 * p0 + q1 * p1
  var price = tvl / pool.totalSupply
  prices[pool.address] = price
  var staked_tvl = pool.staked * price

  return {
    t0: t0,
    p0: p0,
    q0: q0,
    t1: t1,
    p1: p1,
    q1: q1,
    price: price,
    tvl: tvl,
    stakedTvl: staked_tvl,
  }
}

const getErc20Prices = (prices, pool) => {
  var price = getParameterCaseInsensitive(prices, pool?.address)
  var tvl = (pool.totalSupply * price) / 10 ** pool.decimals
  var staked_tvl = pool.staked * price
  return {
    stakedTvl: staked_tvl,
    price: price,
    stakeTokenTicker: pool.symbol,
    tvl: tvl,
  }
}

export function getPoolPricesAuto(tokens, prices, pool) {
  if (pool?.token0 != null) return getUniPrices(tokens, prices, pool)
  return getErc20Prices(prices, pool)
}
