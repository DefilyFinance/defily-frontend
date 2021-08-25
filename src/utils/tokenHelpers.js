export const getTokenName = (tokenSymbol, t0Symbol, t1Symbol) => {
  let lpTokenName = ''
  if (t1Symbol) {
    lpTokenName = `${t1Symbol}-${t0Symbol} ${tokenSymbol === 'KLP' ? '' : tokenSymbol}`
  } else {
    lpTokenName = `${t1Symbol ? `${t1Symbol}-` : ''}${t0Symbol || ''} ${tokenSymbol === 'KLP' ? '' : tokenSymbol}`
  }

  if (tokenSymbol === 'KLP') {
    return lpTokenName.replace('WKAI', 'KAI')
  }

  return lpTokenName
}

export const getNameLpToken = (token0, token1) => {
  const lpTokenName = token1 ? `${token0.symbol}-${token1.symbol}` : token0.symbol

  return lpTokenName
}

export const getPoolName = (earningTokens) => {
  return earningTokens.reduce((acc, earningToken, index) => {
    return acc + `${index !== 0 ? ', ' : ''}${earningToken.symbol}`
  }, '')
}
