import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import UNIV2PairAbi from 'config/abi/lpToken.json'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import address from 'constants/contracts'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getParameterCaseInsensitive } from 'utils/index'
import multicall from 'utils/multicall'

export const transformUserData = (userData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    earnings: userData ? new BigNumber(userData.earnings) : BIG_ZERO,
  }
}

export async function getStoredToken(type, tokenAddress, masterChefAddress) {
  switch (type) {
    case 'uniswap':
      return await getPool(UNIV2PairAbi, tokenAddress, masterChefAddress)
    case 'erc20':
      return await getErc20(erc20, tokenAddress, masterChefAddress)
  }
}

export async function getPool(abi, poolAddress, masterChefAddress) {
  const calls = [
    {
      address: poolAddress,
      name: 'getReserves',
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
    {
      address: poolAddress,
      name: 'decimals',
    },
  ]

  const [reserves, totalSupply, staked] = await multicall(abi, calls)

  return {
    q0: reserves._reserve0._hex,
    q1: reserves._reserve1._hex,
    totalSupply: new BigNumber(totalSupply).div(DEFAULT_TOKEN_DECIMAL).toJSON(),
    staked: new BigNumber(staked).div(DEFAULT_TOKEN_DECIMAL).toJSON(),
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
      name: 'balanceOf',
      params: [masterChefAddress],
    },
    {
      address: tokenAddress,
      name: 'decimals',
    },
  ]

  const [totalSupply, staked, [decimals]] = await multicall(abi, calls)

  return {
    decimals,
    address: tokenAddress,
    totalSupply: new BigNumber(totalSupply).div(BIG_TEN.pow(decimals)).toJSON(),
    staked: new BigNumber(staked).div(BIG_TEN.pow(decimals)).toJSON(),
    tokens: [tokenAddress],
  }
}

export async function getToken(tokenAddress, masterChefAddress) {
  let type = window.localStorage.getItem(tokenAddress)

  if (tokenAddress.toLowerCase() === address.wKai.toLowerCase()) {
    type = 'erc20'
  }

  if (type) return getStoredToken(type, tokenAddress, masterChefAddress)

  try {
    const uniPool = await getPool(UNIV2PairAbi, tokenAddress, masterChefAddress)
    window.localStorage.setItem(tokenAddress, 'uniswap')
    return uniPool
  } catch (e) {
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

const getUniPrices = (prices, pool) => {
  var t0 = pool.token0
  var p0 = getParameterCaseInsensitive(prices, pool.token0.address)
  var t1 = pool.token1
  var p1 = getParameterCaseInsensitive(prices, pool.token1.address)

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
    prices[pool.token0.address] = p0
  }
  if (p1 == null) {
    p1 = (q0 * p0) / q1
    prices[pool.token1.address] = p1
  }
  var tvl = q0 * p0 + q1 * p1
  var price = tvl / pool.totalSupply
  prices[pool.lpAddress] = price
  var stakedTvl = pool.staked * price

  return {
    t0: t0,
    p0: p0,
    q0: q0,
    t1: t1,
    p1: p1,
    q1: q1,
    price: price,
    tvl: tvl,
    stakedTvl: stakedTvl,
  }
}

const getErc20Prices = (prices, pool) => {
  var price = getParameterCaseInsensitive(prices, pool.address)
  var tvl = (pool.totalSupply * price) / 10 ** pool.decimals
  var stakedTvl = pool.staked * price
  return {
    stakedTvl: stakedTvl,
    price: price,
    stakeTokenTicker: pool.symbol,
    tvl: tvl,
  }
}

export function getPoolPrices(prices, pool) {
  if (pool.token1) return getUniPrices(prices, pool)
  return getErc20Prices(prices, pool)
}

const ARCHIVED_FARMS_PID = [2]

export const isArchivedPid = (pid) => ARCHIVED_FARMS_PID.includes(pid)
