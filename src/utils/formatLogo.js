import tokens from 'constants/tokens'

export const formatLogo = (token0, token1) => {
  const logo0 = token0.symbol.includes('DDT') ? '/tokens/dfl.png' : `/tokens/${token0.symbol.toLowerCase()}.png`
  const logo1 = token1?.symbol?.includes('DDT') ? '/tokens/dfl.png' : `/tokens/${token1?.symbol?.toLowerCase()}.png`

  if (!token1)
    return {
      src0: logo0,
      alt0: `${token0.symbol} logo`,
    }

  const src0 = token0.symbol === tokens.wkai.symbol || token0.symbol === tokens.kusd.symbol ? logo1 : logo0

  const src1 = token0.symbol === tokens.wkai.symbol || token0.symbol === tokens.kusd.symbol ? logo0 : logo1

  const alt0 =
    token0.symbol === tokens.wkai.symbol || token0.symbol === tokens.kusd.symbol
      ? `${token1.symbol} logo`
      : `${token0.symbol} logo`

  const alt1 =
    token0.symbol === tokens.wkai.symbol || token0.symbol === tokens.kusd.symbol
      ? `${token0.symbol} logo`
      : `${token1.symbol} logo`

  return {
    src0,
    src1,
    alt0,
    alt1,
  }
}

export const formatListLogo = (tokens) => {
  return {
    srcs: tokens.map((token) =>
      token.symbol.includes('DDT') ? '/tokens/dfl.png' : `/tokens/${token.symbol.toLowerCase()}.png`,
    ),
    alts: tokens.map((token) => `${token.symbol} logo`),
  }
}
