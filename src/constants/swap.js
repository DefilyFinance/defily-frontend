import tokens, { BOSSDOGE, DFL, KUSD, VNDC, WKAI } from 'constants/tokens'
import { ChainId, JSBI, Percent, WETH } from 'defily-v2-sdk'

export const ROUTER_ADDRESS = '0x66153fDc998252C0A98764933e2fC8D1B1009C2B'
export const ZAP_ADDRESS = '0x2Eb8dF4B8Be0bf611330adc4531E4e04f9E1f2b4'

export const BIG_INT_ZERO = JSBI.BigInt(0)
// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 10
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
// use token symbol
export const TOKENS_HOT = [
  tokens.wkai.symbol,
  tokens.defily.symbol,
  tokens.dragon.symbol,
  tokens.kusd.symbol,
  tokens.vndc.symbol,
  tokens.lpdi.symbol,
]

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], VNDC, KUSD[ChainId.MAINNET], DFL[ChainId.MAINNET], BOSSDOGE],
}

export const PINNED_PAIRS = {
  [ChainId.MAINNET]: [
    [DFL[ChainId.MAINNET], WKAI],
    [DFL[ChainId.MAINNET], KUSD[ChainId.MAINNET]],
    [KUSD[ChainId.MAINNET], VNDC],
    [BOSSDOGE, WKAI],
  ],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], DFL[ChainId.MAINNET], KUSD[ChainId.MAINNET], WKAI],
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES = {
  [ChainId.MAINNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES = {
  [ChainId.MAINNET]: {},
}

// used to ensure the user doesn't send so much BNB so they end up with <.1
export const MIN_KAI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(17)) // .1 KAI
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES = {
  [ChainId.MAINNET]: [KUSD[ChainId.MAINNET], DFL[ChainId.MAINNET]],
}

export const swapSupportFeesTokens = [BOSSDOGE]
