import { BIG_TEN } from 'utils/bigNumber'

export const UINT256_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const KAI_BLOCK_TIME = 5
export const KAI_BLOCK_PER_YEAR = 6311520
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const START_BLOCK = 2747474
export const RPC_ENDPOINT = process.env.REACT_APP_RPC_ENDPOINT
export const MAX_SUPPLY = 1000000000
export const GAS_LIMIT_DEFAULT = 5000000
export const TRADING_FEE = 0.25
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const VAULTS_GET_TVL = [0, 1, 2, 3, 4]
export const pathBgFooter = ['/pools', '/swap', '/vaults', '/battles', '/castles', '/farms', '/mini-farms']

export const pathNoDragon = [
  '/',
  '/dashboard',
  '/lands',
  '/ido',
  '/castles',
  '/swap',
  '/liquidity',
  '/find',
  '/remove',
  '/landing-page',
  '/zap',
  '/pipe',
]
export const subPathNoDragon = ['land', 'ido-detail', 'remove', 'add', 'zap', 'pipe']
