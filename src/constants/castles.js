import { CASTLE_TAGS } from 'constants/index'
import tokens from 'constants/tokens'

const castlesConfig = [
  {
    sousId: 12,
    stakingToken: tokens.ltd,
    earningToken: tokens.chi,
    startBlock: '3315445',
    endBlock: '3488245',
    tokenPerBlock: '5',
    contractAddress: '0x636FfF9967Faf21994C1cb772288Bb236d0aB1ff',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isPartner: true,
  },
  {
    sousId: 9,
    stakingToken: tokens.kaiLtdKlp,
    earningToken: tokens.sen,
    startBlock: '3184444',
    endBlock: '3357244',
    tokenPerBlock: '5780000000000000',
    contractAddress: '0x479C5c1A8e7AD5eEAA8Eb9C975032FDf32826B0D',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isPartner: true,
  },
  {
    sousId: 7,
    stakingToken: tokens.dragon,
    earningToken: tokens.wkai,
    startBlock: '3233233',
    endBlock: '3354193',
    tokenPerBlock: '577000000000000000',
    contractAddress: '0x8E4092215Efb94ef2780AEdA51da37679950be4c',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
  },
  {
    sousId: 8,
    stakingToken: tokens.bossDogev2,
    earningToken: tokens.defily,
    startBlock: '3150456',
    endBlock: '3202296',
    tokenPerBlock: '1736000000000000000',
    contractAddress: '0x1a782cB77e8482F2DF27Fc81F9eEE65440FCB911',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
  },
  {
    sousId: 3,
    stakingToken: tokens.dragon,
    earningToken: tokens.bossDogev2,
    startBlock: '2895947',
    endBlock: '3202170',
    tokenPerBlock: '122170781891000000000',
    contractAddress: '0xEac0F9944F1a8AC3859EBfb5b02a363167977c9F',
    harvest: true,
    isFinished: true,
    isEmergencyWithdraw: true,
    tags: [CASTLE_TAGS.fairlaunch],
  },
  {
    sousId: 4,
    stakingToken: tokens.kaiDflKlp,
    earningToken: tokens.ltd,
    startBlock: '3059059',
    endBlock: '3300979',
    tokenPerBlock: '2890000000000000000',
    contractAddress: '0xe32Be8f73f0093dbef8b01705553ff299D609BF3',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.ifo],
  },
  {
    sousId: 6,
    stakingToken: tokens.ltd,
    earningToken: tokens.beco,
    startBlock: '3112311',
    endBlock: '3233271',
    tokenPerBlock: '30000000000000000',
    contractAddress: '0x5B9840e0B57Aa017c2Ef1F510FC881241aE67419',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isPartner: true,
  },
  {
    sousId: 5,
    stakingToken: tokens.ltd,
    earningToken: tokens.kusd,
    startBlock: '3111777',
    endBlock: '3232737',
    tokenPerBlock: '25000',
    contractAddress: '0x993925Fa1721895e8cD5334E8d3de45F8c818333',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isPartner: true,
  },
  {
    sousId: 1,
    stakingToken: tokens.dragon,
    earningToken: tokens.kusd,
    startBlock: '2891397',
    endBlock: '3012357',
    tokenPerBlock: '11574',
    contractAddress: '0xC4383f73d69f1e670FB533314301de600f2BEb04',
    harvest: false,
    isFinished: true,
    tags: [CASTLE_TAGS.ended],
  },
  {
    sousId: 2,
    stakingToken: tokens.dragon,
    earningToken: tokens.dpet,
    startBlock: '3012357',
    endBlock: '3133317',
    tokenPerBlock: '17361111110000000',
    contractAddress: '0x991220C24837a58aFCA359C1afDDD2B68C94baD6',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
  },
  {
    sousId: 0,
    stakingToken: tokens.dragon,
    earningToken: tokens.bossDoge,
    startBlock: '2894277',
    endBlock: '2894792',
    tokenPerBlock: '1425000000000000000000000',
    contractAddress: '0xE21004227fE23B27dCF1f1dEbA9E07ac307254ae',
    harvest: false,
    isFinished: true,
    isHide: true,
    tags: [CASTLE_TAGS.replaced],
  },
]

export const castlesV2Config = [
  {
    sousId: 10,
    stakingToken: tokens.dragon,
    earningTokens: [tokens.wkai, tokens.kusd],
    startBlock: '3318046',
    endBlock: '3439006',
    tokensPerBlock: ['289351851840000000', '14467'],
    contractAddress: '0x5a18a804F20c63B23C39853F0E8162a1Ab7e4390',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 2,
  },
  {
    sousId: 11,
    stakingToken: tokens.defily,
    earningTokens: [tokens.dpet, tokens.sen],
    startBlock: '3338755',
    endBlock: '3459715',
    tokensPerBlock: ['4340000000000000', '5787000000000000'],
    contractAddress: '0xCc965e3E77906317063c93B1Ccc5E63fe17f5C27',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 13,
    stakingToken: tokens.ltd,
    earningTokens: [tokens.beco, tokens.defily],
    startBlock: 3470323,
    endBlock: 3643123,
    tokensPerBlock: ['173600000000000000', '23148000000000000'],
    contractAddress: '0x9ecA708d033e376A5E2DE153BA7e7EcE3292AEEE',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 18,
    stakingToken: tokens.ltd,
    earningTokens: [tokens.beco, tokens.defily],
    startBlock: 3505910,
    endBlock: 3678710,
    stakingBlock: 3505910,
    stakingEndBlock: 3678710,
    unStakingBlock: 3505910,
    tokensPerBlock: ['17360000000000000', '231480000000000000'],
    contractAddress: '0xF1Fb4dB5F05f6ACA0fb37d406EFC20836A3fC1b9',
    harvest: true,
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 14,
    stakingToken: tokens.dragon,
    earningTokens: [tokens.beco],
    startBlock: 3499376,
    endBlock: 4017776,
    stakingBlock: 3499376,
    stakingEndBlock: 4017776,
    unStakingBlock: 3499376,
    tokensPerBlock: ['5787000000000000'],
    blockPeriod: 51840,
    contractAddress: '0x43A6CbefE25E686F61dD26C4DFd45ca1DAC6f359',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
    fees: {
      withdrawalFee: 0.1,
    },
  },
  {
    sousId: 15,
    stakingToken: tokens.dragon,
    earningTokens: [tokens.dpet],
    startBlock: 3551216,
    endBlock: 4069616,
    stakingBlock: 3551216,
    stakingEndBlock: 4069616,
    unStakingBlock: 3551216,
    tokensPerBlock: ['578700000000000'],
    blockPeriod: 51840,
    contractAddress: '0x2f56B538e5938c1119D149BAFEcCD500fF2131E5',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
    fees: {
      withdrawalFee: 0.1,
    },
  },
  {
    sousId: 16,
    stakingToken: tokens.dragon,
    earningTokens: [tokens.kusd],
    startBlock: 3603056,
    endBlock: 4121456,
    stakingBlock: 3603056,
    stakingEndBlock: 4121456,
    unStakingBlock: 3499700,
    tokensPerBlock: ['5787'],
    blockPeriod: 51840,
    contractAddress: '0xc69ddF0B0c0C181bCcEc1b20cc141CEF60279587',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
    fees: {
      withdrawalFee: 0.1,
    },
  },
  {
    sousId: 17,
    stakingToken: tokens.dragon,
    earningTokens: [tokens.vndc],
    startBlock: 3654896,
    endBlock: 4173296,
    stakingBlock: 3654896,
    stakingEndBlock: 4173296,
    unStakingBlock: 3499777,
    tokensPerBlock: ['115'],
    blockPeriod: 51840,
    contractAddress: '0xec3CB3585788A3626fE0F29B5CB385ad039c9e81',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
    fees: {
      withdrawalFee: 0.1,
    },
  },
  {
    sousId: 19,
    stakingToken: tokens.ddtX4Dragon,
    earningTokens: [tokens.defily],
    startBlock: 3594061,
    endBlock: 3715021,
    stakingBlock: 3577645,
    stakingEndBlock: 3715021,
    unStakingBlock: 3577645,
    tokensPerBlock: ['289350000000000000'],
    blockPeriod: 51840,
    contractAddress: '0xa57e8706d360E389FEc97bAa29340a81855E4B53',
    isFinished: true,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
    fees: {
      withdrawalFee: 0.1,
    },
  },
  {
    sousId: 20,
    stakingToken: tokens.lpdiKusd,
    earningTokens: [tokens.ltd],
    startBlock: 3580520,
    endBlock: 4098920,
    stakingBlock: 3580520,
    stakingEndBlock: 4098920,
    unStakingBlock: 3580520,
    tokensPerBlock: ['37905092590000000'],
    contractAddress: '0xE5D81FBdb87E2e61043368fa8960F38abd718Cd3',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 21,
    stakingToken: tokens.ltd,
    earningTokens: [tokens.beco, tokens.nami, tokens.vidb],
    startBlock: 3701165,
    endBlock: 4219565,
    stakingBlock: 3701165,
    stakingEndBlock: 4219565,
    unStakingBlock: 3701165,
    tokensPerBlock: ['57870370000000000', '57870370000000000', '1157407'],
    contractAddress: '0xB6609047d58feDc27fEed8Adf112Ab48165cE594',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 22,
    stakingToken: tokens.wkaiKusd,
    earningTokens: [tokens.chat],
    startBlock: 3855973,
    endBlock: 3976933,
    stakingBlock: 3734149,
    stakingEndBlock: 3855109,
    unStakingBlock: 3971305,
    tokensPerBlock: ['826719576719000000000'],
    contractAddress: '0xf9369B38D8CF7A9C3da9742170415FcA358cBE2e',
    isFinished: false,
    tags: [CASTLE_TAGS.ifo, CASTLE_TAGS.soldOut],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 23,
    stakingToken: tokens.lpdiKusd,
    earningTokens: [tokens.nami],
    startBlock: 3814900,
    endBlock: 4333300,
    stakingBlock: 3814900,
    stakingEndBlock: 4333300,
    unStakingBlock: 3814900,
    tokensPerBlock: ['289351851850000000'],
    contractAddress: '0x000b22873C6D4d577440a14393A5d3e00b8AAbae',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
  },
  {
    sousId: 24,
    stakingToken: tokens.dragon,
    earningTokens: [tokens.eth],
    startBlock: 3894495,
    endBlock: 4412895,
    stakingBlock: 3877215,
    stakingEndBlock: 4412895,
    unStakingBlock: 3877215,
    tokensPerBlock: ['1929010000000'],
    contractAddress: '0x180fb2e91d2b119e7a4Ff7805757F2B2CE4FcEFD',
    isFinished: false,
    tags: [CASTLE_TAGS.exclusive],
    isV2: true,
    sortId: 1,
    blockPeriod: 51840,
    fees: {
      withdrawalFee: 0.1,
    },
  },
]

export default castlesConfig
