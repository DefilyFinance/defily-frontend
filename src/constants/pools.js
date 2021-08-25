import masterChefBecoAbi from 'config/abi/masterchefBeco.json'
import masterChefBDSAbi from 'config/abi/masterchefBds.json'
import address from 'constants/contracts'
import tokens from 'constants/tokens'
import { TYPE_FARM } from 'constants/vaults'

export const poolsConfig = [
  {
    abi: masterChefBecoAbi,
    contractAddress: address.masterChefBeco,
    earningToken: tokens.beco,
    methodPerBlock: 'becoPerBlock',
    type: TYPE_FARM.beco,
  },
  {
    abi: masterChefBDSAbi,
    contractAddress: address.masterChefBds,
    earningToken: tokens.bds,
    methodPerBlock: 'KRC20TokenPerBlock',
    type: TYPE_FARM.bds,
  },
]

export const poolsSousChefConfig = [
  {
    sousId: 0,
    contractAddress: '0x78A69C055BcA3E2F072203f814aE6968E3f8bB8A',
    stakingToken: tokens.beco,
    earningToken: tokens.sen,
    harvest: true,
    isFinished: false,
  },
]
