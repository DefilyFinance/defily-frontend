import axios from 'axios'
import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import tokens from 'constants/tokens'
// import { TOKENS } from 'constants/index'
// import tokens from 'constants/tokens'

const chunk = (arr, n) => (arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [])

const lookUpPrices = async function (id_array) {
  const prices = {}
  for (const id_chunk of chunk(id_array, 50)) {
    let ids = id_chunk.join('%2C')
    let res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd')

    for (const [key, v] of Object.entries(res.data)) {
      if (v.usd) prices[key] = v.usd
    }
  }
  return prices
}

const TOKENS = [{ id: 'ethereum', symbol: 'ETH', contract: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' }]

export async function getPrices() {
  const prices = {}
  // const idPrices = await lookUpPrices(TOKENS.map((x) => x.id))
  //
  const res = await axios.get('https://api.info.kaidex.io/api/tokens')
  for (const [key, v] of Object.entries(res.data.data)) {
    if (v.price) prices[key.toLowerCase()] = +v.price
  }

  return {
    ...prices,
    [address.dragon]: prices?.[address.defily.toLowerCase()],
    [address.xChat]: prices?.[address.chat.toLowerCase()],
    [tokens.wDragon.address]: prices?.[address.defily.toLowerCase()] * 100,
  }

  // const prices = {}
  // for (const bt of TOKENS) if (idPrices[bt.id]) prices[bt.contract] = idPrices[bt.id]
  //
  // return {
  //   ...prices,
  //   [tokens.kusd.address.toLowerCase()]: 1,
  // }
}

export const calculatorPriceLp = (pair, totalSupply, tokenPrice0, tokenPrice1) => {
  if (!pair || !totalSupply) return undefined

  const q0 = new BigNumber(pair.reserve0.toExact()).toNumber()
  const q1 = new BigNumber(pair.reserve1.toExact()).toNumber()
  const tvl = q0 * tokenPrice0 + q1 * tokenPrice1
  const price = tvl / totalSupply.toExact()
  return price
}
