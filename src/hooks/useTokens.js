import axios from 'axios'
import tokens from 'constants/tokens'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useMemo, useState } from 'react'

const useTokens = () => {
  const { slowRefresh } = useRefresh()
  const [listTokens, setListTokens] = useState(undefined)
  const [pairs, setPairs] = useState(undefined)

  useEffect(() => {
    const getTokens = async () => {
      const tokens = await axios.get('https://api.info.kaidex.io/api/tokens')
      setListTokens(tokens.data.data)
    }

    const getPairs = async () => {
      const pairs = await axios.get('https://api.info.kaidex.io/api/pairs')
      setPairs(pairs.data.data)
    }

    getTokens()
    getPairs()
  }, [slowRefresh])

  return useMemo(() => {
    if (!listTokens || !pairs) return []
    Object.values(pairs).forEach((pair) => {
      Object.keys(listTokens).forEach((address) => {
        if (pair.base_address === address || pair.quote_address === address) {
          listTokens[address] = {
            ...listTokens[address],
            ...(listTokens[address]?.pairs
              ? {
                  pairs: listTokens[address]?.pairs.find((pairFind) => pairFind.pair_address === pair.pair_address)
                    ? listTokens[address]?.pairs
                    : [...listTokens[address]?.pairs, pair],
                }
              : { pairs: [pair] }),
          }
        }
      })
    })

    const tokensArr = Object.values(listTokens)

    return tokensArr
      .map((token) => {
        const tvl = token.pairs?.reduce((sum, pair) => (sum += +pair.liquidity), 0)
        return {
          ...token,
          price: +token.price,
          price_KAI: +token.price_KAI,
          tvl: tvl / 2,
        }
      })
      .sort((tokenA, tokenB) => (tokenA?.symbol === tokens.defily.symbol ? -1 : tokenB.tvl - tokenA.tvl))
  }, [listTokens, pairs])
}

export default useTokens
