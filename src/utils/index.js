import { BigNumber } from 'ethers'
import kardiaClient from 'plugin/kardia-dx'
import { showToastError } from 'components/CustomToast/CustomToast'
import { getAddress } from '@ethersproject/address'
import { JSBI, Percent } from 'defily-v2-sdk'

export function isAddress(value) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function getParameterCaseInsensitive(object, key) {
  if (object instanceof Object && key) {
    return object[Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase())]
  }
  return undefined
}

export const getLink = (link) => {
  if (link) {
    if (link?.match(/^http[s]?:\/\//)) {
      return link
    }
    return 'http://' + link
  }
  return ''
}

export const getBlockNumber = async () => {
  const BLOCK_NUMBER = 'latest'
  const blockResponse = await kardiaClient.kaiChain.getBlockByBlockNumber(BLOCK_NUMBER)
  return blockResponse.height
}

export const formatNumberMinifiedCharacters = (number, decimals = 2) => {
  if (isNaN(number)) {
    return {
      value: '???',
      unit: '',
    }
  }
  if (number === Infinity) {
    return {
      value: number,
      unit: '',
    }
  }
  // billion
  if (number > 1000 * 1000 * 1000000000) {
    return {
      value: (number / 1000000000)?.toExponential(decimals),
      unit: 'B',
    }
  }
  if (number > 100 * 1000000000) {
    return {
      value: (number / 1000000000)?.toFixed(decimals),
      unit: 'B',
    }
  }
  // million
  if (number > 100 * 1000000) {
    return {
      value: (number / 1000000)?.toFixed(decimals),
      unit: 'M',
    }
  }
  return {
    value: number?.toFixed(decimals),
    unit: '',
  }
}

export const handleToastError = (error) => {
  console.log(error)
  if (error?.response?.data?.errors?.[0]?.msg) {
    showToastError(error.response.data.errors[0].msg)
  } else {
    showToastError('Some error occurred, please try again!')
  }
}

export const tokenEarnedPerThousandDaily = (stakedTvl, apr) => {
  const userDailyRewards = Number(apr?.userDailyRewards ? +apr?.userDailyRewards : 0)
  if (stakedTvl) {
    const rewards = (1000 * Number(userDailyRewards)) / Number(stakedTvl)
    return rewards <= userDailyRewards ? rewards : userDailyRewards
  }
  return userDailyRewards
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num) {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

export function calculateSlippageAmount(value, slippage) {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}
