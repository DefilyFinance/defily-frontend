import address from 'constants/contracts'
import { ChainId, Token } from 'defily-v2-sdk'

export const WKAI = new Token(ChainId.MAINNET, address.wKai, 18, 'WKAI', 'Wrapped KAI')
export const BECO = new Token(ChainId.MAINNET, '0x2Eddba8b949048861d2272068A94792275A51658', 18, 'BECO', 'BECO')

export const BOSSDOGE = new Token(
  ChainId.MAINNET,
  '0x5995F16246DfA676A44B8bD7E751C1226093dcd7',
  9,
  'BossDoge',
  'BossDoge',
)

export const VNDC = new Token(ChainId.MAINNET, '0xeFF34B63f55200a9D635B8ABBBFCC719b4977864', 0, 'VNDC', 'VNDC')

export const DFL = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, address.defily, 18, 'DFL', 'Defily'),
}

export const CHAT = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, address.chat, 18, 'CHAT', 'Chat Token'),
}

export const xCHAT = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, address.xChat, 18, 'xCHAT', 'xCHAT'),
}

export const DRAGON = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, address.dragon, 18, 'DRAGON', 'Defily'),
}
export const KUSD = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x92364Ec610eFa050D296f1EEB131f2139FB8810e', 6, 'KUSD-T', 'KUSD-T'),
}

const tokens = {
  kai: {
    symbol: 'KAI',
    projectLink: 'https://kardiachain.io/',
    decimals: 18,
  },
  dragon: {
    symbol: 'DRAGON',
    address: address.dragon,
    decimals: 18,
    projectLink: 'https://defily.io/',
  },
  ddtX4Dragon: {
    symbol: 'DDTX4_DRAGON',
    address: '0x8D32Bb508a4c803C859d7a42D8e71AF904cc2761',
    decimals: 18,
    projectLink: 'https://defily.io/',
  },
  defily: {
    symbol: 'DFL',
    address: address.defily,
    decimals: 18,
    projectLink: 'https://defily.io/',
  },
  dpet: {
    symbol: 'DPET',
    address: '0xfb62AE373acA027177D1c18Ee0862817f9080d08',
    decimals: 18,
    projectLink: 'https://mydefipet.com/',
  },
  kusd: {
    symbol: 'KUSD-T',
    address: '0x92364Ec610eFa050D296f1EEB131f2139FB8810e',
    decimals: 6,
    projectLink:
      'https://medium.com/kardiachain/kusd-t-the-first-krc20-usd-pegged-stablecoin-for-the-best-defi-experiences-35550e6ca582',
  },
  wkai: {
    symbol: 'WKAI',
    address: address.wKai,
    decimals: 18,
    projectLink: 'https://kardiachain.io/',
  },
  bossDoge: {
    symbol: 'BossDogeOld',
    address: '0xE7B2ad1AF170405D7c6354D61b32E44EF44b45dE',
    decimals: 9,
    projectLink: 'https://www.bossdoge.finance/',
  },
  bossDogev2: {
    symbol: 'BossDoge',
    address: '0x5995F16246DfA676A44B8bD7E751C1226093dcd7',
    decimals: 9,
    projectLink: 'https://www.bossdoge.finance/',
  },
  ltd: {
    symbol: 'LTD',
    address: '0xf631BdC21A77AFAc69B9B3e966E85d7fBcf00b1f',
    decimals: 18,
    projectLink: 'https://ltd.livetrade.io/en/',
  },
  kaiDflKlp: {
    symbol: 'KAI-DFL',
    address: '0x256B8A99f69DBDBb5aC781E97f11080a336f5507',
    decimals: 18,
    projectLink: 'https://kardiachain.io/',
    token0: {
      symbol: 'WKAI',
    },
    token1: {
      symbol: 'DFL',
    },
  },
  vndc: {
    symbol: 'VNDC',
    address: '0xeFF34B63f55200a9D635B8ABBBFCC719b4977864',
    decimals: 0,
    projectLink: 'https://vndc.io/',
  },
  vidb: {
    symbol: 'VIDB',
    address: '0x75b9d2A0007A6866e32Ac0A976FeF60ccA151f87',
    decimals: 8,
    projectLink: 'https://vndc.io/vidb',
  },
  beco: {
    symbol: 'BECO',
    address: '0x2Eddba8b949048861d2272068A94792275A51658',
    decimals: 18,
    projectLink: 'https://becoswap.com/',
  },
  kaiLtdKlp: {
    symbol: 'KAI-LTD',
    address: '0x1f95bD3A7d5c9DF6bF56504bbA948A7ADF1c3e27',
    decimals: 18,
    projectLink: 'https://kardiachain.io/',
    token0: {
      symbol: 'WKAI',
    },
    token1: {
      symbol: 'LTD',
    },
  },
  sen: {
    symbol: 'SEN',
    address: '0xb697231730C004110A86f51BfF4B8DD085c0CB28',
    decimals: 18,
    projectLink: 'https://sleepearn.finance/',
  },
  tph: {
    symbol: 'TPH',
    address: '0xc1c319434bd861A335752b4b6993C13f139B26fa',
    decimals: 8,
    projectLink: 'https://trustpay.vn/',
  },
  chi: {
    symbol: 'CHI',
    address: '0xf8bB30c912a46f57F2B499111cb536dB13A044c3',
    decimals: 3,
    projectLink: '',
  },
  bami: {
    symbol: 'BAMI',
    address: '0xC0884cCE945fCf7F3AE4471B5A16d83065D35c31',
    decimals: 18,
    projectLink: 'https://app.bami.money/',
  },
  nami: {
    symbol: 'NAMI',
    address: '0xA43B455F935A7f4184B5B8Aa345e22DbA3bBb286',
    decimals: 18,
    projectLink: 'https://nami.io/',
  },
  bds: {
    symbol: 'BDS',
    address: '0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b',
    decimals: 8,
    projectLink: '',
  },
  kphi: {
    symbol: 'KPHI',
    address: '0x6CD689DefCA80f9F2CBED9D0C6f3B2Cf4abc4598',
    decimals: 18,
    projectLink: 'https://www.kephi.io/',
  },
  lpdi: {
    symbol: 'LPDi',
    address: '0x32a6bD9800276be19050bd97459A7a36B26bD899',
    decimals: 18,
    projectLink: '',
  },
  lpdiKusd: {
    symbol: 'LPDi-KUSD-T',
    address: '0x5D6724F4ac40AEb1A47b9CcFe293363D100d4e5f',
    decimals: 18,
    token0: {
      symbol: 'LPDi',
    },
    token1: {
      symbol: 'KUSD-T',
    },
    projectLink: 'https://kardiachain.io/',
  },
  wkaiKusd: {
    symbol: 'KAI-KUSD-T',
    address: '0x7cd3c7aFeDD16A72Fba66eA35B2e2b301d1B7093',
    decimals: 18,
    token0: {
      symbol: 'WKAI',
    },
    token1: {
      symbol: 'KUSD-T',
    },
    projectLink: 'https://kardiachain.io/',
  },
  chat: {
    symbol: 'CHAT',
    address: '0x274064d87952e4782150396153b50b1ab3a81Ca2',
    decimals: 18,
    projectLink: 'https://chattoken.net/',
  },
  vndt: {
    symbol: 'VNDT',
    address: '0xCc0595e6a76da207CCaDf8DC7cF548Af0fF8E22b',
    decimals: 8,
    projectLink: 'https://vndt.com/',
  },
  wDragon: {
    symbol: 'WDRAGON',
    address: '0x18243Ede0EB6479239e2A3799E51585e38A46D79',
    decimals: 18,
    projectLink: 'https://defily.io/',
  },
  xChat: {
    symbol: 'xCHAT',
    address: '0x3d255696Fe96cA5EeD3e16cF25AB3301EbCC2f98',
    decimals: 18,
    projectLink: 'https://chattoken.net/',
  },
  eth: {
    symbol: 'ETH',
    address: '0x1540020a94aA8bc189aA97639Da213a4ca49d9a7',
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
  },
  gdt: {
    symbol: 'GDT',
    address: '0x865Fa6A9DeE299De618A06729DC9e5f7d02055E3',
    decimals: 18,
    projectLink: 'https://getdone.co/',
  },
}

export default tokens
