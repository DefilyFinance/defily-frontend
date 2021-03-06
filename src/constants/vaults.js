import tokens from 'constants/tokens'

export const sortTypeVault = {
  hot: 'hot',
  apy: 'apy',
  tvl: 'tvl',
  available: 'available',
  holdings: 'holdings',
}

export const TYPE_STRATEGY = {
  stratX4: 'StratX4',
  strat100X4: 'Strat100X4',
  stratX2: 'StratX2',
  strat100Back: 'Strat100',
  dragon: 'DRAGON',
}

export const sortListVault = [
  {
    name: sortTypeVault.hot,
    label: 'Hot',
  },
  {
    name: sortTypeVault.apy,
    label: 'Apy',
  },
  {
    name: sortTypeVault.tvl,
    label: 'Tvl',
  },
  {
    name: sortTypeVault.available,
    label: 'Available',
  },
  {
    name: sortTypeVault.holdings,
    label: 'Holdings',
  },
]

export const TYPE_FARM = {
  dfl: 'dfl',
  beco: 'beco',
  ltd: 'ltd',
  bds: 'bds',
  chat: 'chat',
}

const vaultsConfig = [
  {
    vid: 6,
    contractAddress: '0x8d30BF83575c8794Fc736b928Ba1eEDEfb5e50AF',
    lpTokenAddress: tokens.dragon.address,
    decimals: tokens.dragon.decimals,
    token0: tokens.dragon,
    fees: 1,
    logo: '/tokens/dragon.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 0,
    contractAddress: '0xE5D8F93F49837E3Dd0B35db906afa5344A77D198',
    lpTokenAddress: '0x256b8a99f69dbdbb5ac781e97f11080a336f5507',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.defily,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 1,
    contractAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: '0x3e82F9290A28D4296d34d0c1e6E5366c4220248a',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.defily,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 10,
    contractAddress: '0x6CC7203dEaB0e2ce2c7A17c556173c2Ab3d61b3a',
    lpTokenAddress: '0x5b60a5761047b3a9ec340941d904231be85f5c0b',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.bossDogev2,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 19,
    contractAddress: '0x2FA4AdA7B508f7063CD12bE8c241A9936AE2b871',
    lpTokenAddress: '0x6c98542a41b820491a4a8B7a71dA26b8eA524b07',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.nami,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 20,
    contractAddress: '0x430f7ED29972329ee0858ba80F9395EBC83D12e2',
    lpTokenAddress: '0x5D6724F4ac40AEb1A47b9CcFe293363D100d4e5f',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.lpdi,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 24,
    contractAddress: '0x593BF2862E825c0F6426529ECdBf90e7bf84e1Ed',
    lpTokenAddress: '0xD17459b9CFc1D7010f7538F123Cd68f8aB042e12',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.lpdi,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
  },
  {
    vid: 25,
    contractAddress: '0xfD1c1A88C0A1a19E01F0c179A75d2a1fea47bc87',
    lpTokenAddress: '0x05D6aE694d44B4005aCBF18a701ec7C84CDB82Df',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.chat,
    fees: 1.5,
    logo: '/tokens/chat.png',
    typeFarm: TYPE_FARM.chat,
  },
  {
    vid: 21,
    contractAddress: '0x5B6c4c3014F3f5CFE5E56a71e635a17FE556D830',
    lpTokenAddress: '0x909Eb13A77Be16FD6D4A763b701b3aA82A5AFF9D',
    decimals: 18,
    token0: tokens.vndc,
    token1: tokens.bds,
    fees: 1.5,
    logo: '/tokens/bds.png',
    typeFarm: TYPE_FARM.bds,
  },
  {
    vid: 22,
    contractAddress: '0xC66EECD4344ECa1cdEa34FB12035eC2F3E920649',
    lpTokenAddress: '0xab951b7c56682040DC62FFf35c8Bdb8fdEca8861',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.bds,
    fees: 1.5,
    logo: '/tokens/bds.png',
    typeFarm: TYPE_FARM.bds,
  },
  {
    vid: 23,
    contractAddress: '0x4CeCDfD360f7C71061Cb6bf6297022C9680464E3',
    lpTokenAddress: '0x3737a7362A6D5bDd39573F3844ca704B61A8a06E',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.bds,
    fees: 1.5,
    logo: '/tokens/bds.png',
    typeFarm: TYPE_FARM.bds,
  },
  {
    vid: 26,
    contractAddress: '0x19Cba5F6fA5361e128B01CDF6762E261eA4B3E51',
    lpTokenAddress: '0xD17459b9CFc1D7010f7538F123Cd68f8aB042e12',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.lpdi,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 27,
    contractAddress: '0x651AA337C7045727dcB7f0eB0192E3FC1c744Bc3',
    lpTokenAddress: '0x3737a7362A6D5bDd39573F3844ca704B61A8a06E',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.bds,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 7,
    contractAddress: '0xA603387e4db508d1Ea0c9d004144726b6D205965',
    lpTokenAddress: tokens.wkai.address,
    decimals: tokens.wkai.decimals,
    token0: tokens.wkai,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 8,
    contractAddress: '0xd8Df0C76237f957A3D0CfAB94492d142a2aFBC1e',
    lpTokenAddress: tokens.dpet.address,
    decimals: tokens.dpet.decimals,
    token0: tokens.dpet,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 9,
    contractAddress: '0xC192C55848A968779f37E3FdeF8d96D7AAe516A8',
    lpTokenAddress: tokens.sen.address,
    decimals: tokens.sen.decimals,
    token0: tokens.sen,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 11,
    contractAddress: '0x889b6eF56787c8AD2c0343e5CedcF4B3a56F2a6f',
    lpTokenAddress: '0xDb504f611Ae0230bDc60A8F58FE89d3593EB28cE',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.dpet,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 12,
    contractAddress: '0xf4d4474E5Bf7b3E4931Fd250159F0E99dBD72e30',
    lpTokenAddress: '0x43951c209003A70dCA94c2a5b09342C9c84E58Ac',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.sen,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 2,
    contractAddress: '0xF85Ce3b95AD4F183ceD89F4302A691d152270497',
    lpTokenAddress: '0x1eBbF8080149FF07381AFd148bA0AF007f78cD3c',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.beco,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 13,
    contractAddress: '0x99B99e7cb536F456DAFB28dB6f02241723e4721A',
    lpTokenAddress: '0xD94e4431061cA7fc69fcB75353204285174AD185',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.tph,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 14,
    contractAddress: '0x405dA31DB4d9b86f0Cb9e60A4447dAC8C2310EF3',
    lpTokenAddress: '0x7cd3c7aFeDD16A72Fba66eA35B2e2b301d1B7093',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.kusd,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
  },
  {
    vid: 17,
    contractAddress: '0xbC008509A84C317e98b3a9C244bBa08Fe6311383',
    lpTokenAddress: '0xab951b7c56682040DC62FFf35c8Bdb8fdEca8861',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.bds,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    isFinished: true,
  },
  {
    vid: 18,
    contractAddress: '0xcAD9ED60a88f27f668B25b7eE54c092bB8B0Fc7d',
    lpTokenAddress: '0xd91E71E3486900Eaa41fa37BdD2a161bcDf0AB7e',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.kphi,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    docs: 'Half of rewards will be sold to buy KPHI, other half will be sold to WKAI to add more KPHI-KAI LP to compound',
  },
  {
    vid: 3,
    contractAddress: '0x16115851DaCceB0f22cF266Ee326705345A9f8C3',
    lpTokenAddress: '0x1f95bD3A7d5c9DF6bF56504bbA948A7ADF1c3e27',
    decimals: 18,
    token0: tokens.wkai,
    token1: tokens.ltd,
    fees: 1.5,
    logo: '/tokens/ltd.png',
    typeFarm: TYPE_FARM.ltd,
  },
  {
    vid: 4,
    contractAddress: '0xFCA1AC33a211ABe4c0371317387e36124Cf8949c',
    lpTokenAddress: '0x44F22875E07c98354Dd0A8D165e7f82f7c73b02d',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.ltd,
    fees: 1.5,
    logo: '/tokens/ltd.png',
    typeFarm: TYPE_FARM.ltd,
  },
  {
    vid: 5,
    contractAddress: '0x29519D6E37545b2c58be68f3A69d5b3326a8300F',
    lpTokenAddress: '0xe504898459c682b95B60feD35de410a74216Fc92',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.vndc,
    fees: 1.5,
    logo: '/tokens/ltd.png',
    typeFarm: TYPE_FARM.ltd,
  },
  {
    vid: 15,
    contractAddress: '0xd9dc3f9859989F3d2085778409A7fFB7d0517F65',
    lpTokenAddress: '0x53E6a1271D89A067055DCD66bAA9dc3a15e18FC4',
    decimals: 18,
    token0: tokens.kai,
    token1: tokens.bami,
    fees: 1.5,
    logo: '/tokens/ltd.png',
    typeFarm: TYPE_FARM.ltd,
  },
  {
    vid: 16,
    contractAddress: '0xf63446946C92F4Fb6B448C5449eAd65B7E9E60D8',
    lpTokenAddress: '0x687ce55E06A90FD75b6B8fd13468973eeA2c6513',
    decimals: 18,
    token0: tokens.kusd,
    token1: tokens.chi,
    fees: 1.5,
    logo: '/tokens/ltd.png',
    typeFarm: TYPE_FARM.ltd,
  },
]

export const vaultsV2Config = [
  {
    vid: 10,
    contractAddress: '0x2Cff3D83494311268DD7600b49F0eA532befEDaB',
    strategyContractAddress: '0x72a60F1d17aa51d4AC0dD11f132B2948216780AA',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.nami.address,
    decimals: tokens.nami.decimals,
    token0: tokens.nami,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into NAMI , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 11,
    contractAddress: '0xb5F029B94C60b3Fa59E713D2E61F730fE4f9FB24',
    strategyContractAddress: '0x01b662F1274cD8e64B432446DD3F74B1b02BB352',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.ltd.address,
    decimals: tokens.ltd.decimals,
    token0: tokens.ltd,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into LTD , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 12,
    contractAddress: '0x062D0992926DDD316e6855bC35755Bac9f64c7c6',
    strategyContractAddress: '0xa05476bB8B007B5cF5Ad59C129B02D03Ae7cCfca',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.lpdi.address,
    decimals: tokens.lpdi.decimals,
    token0: tokens.lpdi,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into LPDI , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 7,
    contractAddress: '0x2a1FA42AF3f8323b9A92a8528f01cF2E0D4E4A33',
    strategyContractAddress: '0xBcEC4670A1D064D03dE7795FEd289cba68056D69',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.kusd.address,
    decimals: tokens.kusd.decimals,
    token0: tokens.kusd,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into KUSD-T , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 8,
    contractAddress: '0x44B1bBc999E63e40341049b7a83521f67A2F3730',
    strategyContractAddress: '0x2c4a3834d8aE498a67627d752d36Ec1928eB7Ba4',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.vndc.address,
    decimals: tokens.vndc.decimals,
    token0: tokens.vndc,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into VNDC , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 9,
    contractAddress: '0xDad1aa941E0C1b3A08a2f68a419154f998a5DBB1',
    strategyContractAddress: '0xf6649165d2cc8501a4d47EA73A24da589974B1aD',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.vndt.address,
    decimals: tokens.vndt.decimals,
    token0: tokens.vndt,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into VNDT , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 13,
    contractAddress: '0x5700261141bB0a2dD88FFdf55C45A187D7314866',
    strategyContractAddress: '0x13708aC2F787dFb89Efd9671b792e0841904f329',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.chat.address,
    decimals: tokens.chat.decimals,
    token0: tokens.chat,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into CHAT , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 14,
    contractAddress: '0x04b928e0E3B485A80eCc6F15D9B1ce6D534D3bb5',
    strategyContractAddress: '0x76169e51Fb13687d2d236Dcf2727e88fd87272Ff',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.chat.address,
    decimals: tokens.chat.decimals,
    token0: tokens.chat,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Sell half rewards into CHAT , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
    isFinished: true,
  },
  {
    vid: 6,
    contractAddress: '0xd0Ff1cAA3135A2529A7110BD3056266C84c93227',
    strategyContractAddress: '0xAD84eDb13EA7bBc019A4861C6E8e895CB6Cf4a3B',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.wkai.address,
    decimals: tokens.wkai.decimals,
    token0: tokens.wkai,
    fees: 1.5,
    logo: '/tokens/dfl.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.dragon,
    docs: '3. Sell half rewards into KUSD-T , use the other half of DFL to add DFL-KUSD-T LP to put in the highest APY Vault of DFL-KUSD-T LP',
  },
  {
    vid: 5,
    contractAddress: '0x8D32Bb508a4c803C859d7a42D8e71AF904cc2761',
    strategyContractAddress: '0x046C1a67D0103aCC5f66705067e9821a82aC0480',
    contractVaultStakedAddress: '0x181CaFef6277870d082D484dB0C1b27c3B1366e4',
    lpTokenAddress: tokens.dragon.address,
    decimals: tokens.dragon.decimals,
    token0: tokens.dragon,
    fees: 1,
    logo: '/tokens/dragon.png',
    typeFarm: TYPE_FARM.dfl,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docsExpand:
      'This vault automatically performs a multi-step transaction for you:\n' +
      '\n' +
      '1. Make a deposit into DRAGON farm of Defily.\n' +
      '2. Auto-harvest rewards every 5 minutes or whenever someone deposit/withdraw.\n' +
      '3. Cut rewards into 2 half\n' +
      '4. Make a deposit of the first half back into DRAGON farm of Defily to compound.\n' +
      '5. Pipe the second half into DFL-KUSD-T LP token and make a deposit into DFL-KUSD-T farm of Defily\n' +
      '6. When you withdraw, the vault converts everything you have back into DRAGON token.',
  },
  {
    vid: 3,
    contractAddress: '0x91AAd8D2cd0b73b2C951c70648A82459BA6877c4',
    strategyContractAddress: '0x2d82E6867Ad01ecEE6f91e2b4FF3c76f139279DB',
    contractVaultStakedAddress: '0xF85Ce3b95AD4F183ceD89F4302A691d152270497',
    lpTokenAddress: tokens.wkai.address,
    decimals: tokens.wkai.decimals,
    token0: tokens.wkai,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    typeStrategy: TYPE_STRATEGY.strat100X4,
  },
  {
    vid: 0,
    contractAddress: '0xFFF8c502D5818d3A74E2C36A0A6525f0cA1171a3',
    strategyContractAddress: '0xF3Ea1de61b7f86372E3568dAe6a18Ba4a2C43436',
    contractVaultStakedAddress: '0xF85Ce3b95AD4F183ceD89F4302A691d152270497',
    lpTokenAddress: tokens.wkai.address,
    decimals: tokens.wkai.decimals,
    token0: tokens.wkai,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    typeStrategy: TYPE_STRATEGY.stratX4,
  },
  {
    vid: 1,
    contractAddress: '0xb8f89078Be2b1cc0e0F04254887839cEF05Ad56d',
    strategyContractAddress: '0xC484B41B05D9A9Ce3814BBd24F7870E0f0C2F062',
    contractVaultStakedAddress: '0xF85Ce3b95AD4F183ceD89F4302A691d152270497',
    lpTokenAddress: tokens.sen.address,
    decimals: tokens.sen.decimals,
    token0: tokens.sen,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    typeStrategy: TYPE_STRATEGY.stratX4,
  },
  {
    vid: 2,
    contractAddress: '0x6a533bccd0d30E97029B2DbDdFE6681eFf14a076',
    strategyContractAddress: '0x0DE659e54E3E8FcCEEDc5dd1f45a932aFC166160',
    contractVaultStakedAddress: '0xF85Ce3b95AD4F183ceD89F4302A691d152270497',
    lpTokenAddress: tokens.dpet.address,
    decimals: tokens.dpet.decimals,
    token0: tokens.dpet,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    typeStrategy: TYPE_STRATEGY.stratX4,
  },
  {
    vid: 4,
    contractAddress: '0x13EDDC8a228b1707Aa23eB5cE2C2682EfFC120a3',
    strategyContractAddress: '0x9885eaA68fd165224825D89F6561723adD6A0cda',
    contractVaultStakedAddress: '0xF85Ce3b95AD4F183ceD89F4302A691d152270497',
    lpTokenAddress: tokens.beco.address,
    decimals: tokens.beco.decimals,
    token0: tokens.beco,
    fees: 1.5,
    logo: '/tokens/beco.png',
    typeFarm: TYPE_FARM.beco,
    typeStrategy: TYPE_STRATEGY.stratX4,
    docs: '3. Use half rewards as BECO to compound back, other half will be sold another half into WKAI to add BECO-KAI LP to deposit into BECO-KAI Vault',
  },
]

export default vaultsConfig
