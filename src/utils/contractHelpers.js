// Addresses

// ABI
import erc20Abi from 'config/abi/erc20.json'
import defilyAbi from 'config/abi/defily.json'
import defilyMasterchef from 'config/abi/masterchef.json'
import dragonAbi from 'config/abi/dragon.json'
import xchatAbi from 'config/abi/xchat.json'
import sousChefAbi from 'config/abi/sousChef.json'
import sousChefV2Abi from 'config/abi/sousChefV2.json'
import dragonBattleAbi from 'config/abi/dragonBattle.json'
import dragonBattleBossAbi from 'config/abi/dragonBattleBoss.json'
import multicallAbi from 'config/abi/multicall.json'
import lpContractAbi from 'config/abi/lpToken.json'
import cdoAbi from 'config/abi/cdo.json'
import vaultAbi from 'config/abi/vaultAbi.json'
import routerAbi from 'config/abi/router.json'
import wethAbi from 'config/abi/weth.json'
import zapAbi from 'config/abi/zap.json'
import ido1Abi from 'config/abi/IDO1.json'
import ido2Abi from 'config/abi/IDO2.json'
import ido3Abi from 'config/abi/IDO3.json'
import { RPC_ENDPOINT } from 'config/index'
import { KardiaContract } from 'kardia-js-sdk'

export const getContract = (abi) => {
  const contract = new KardiaContract({
    provider: RPC_ENDPOINT,
    abi: abi,
  })
  return contract
}

export const getERC20Contract = () => {
  return getContract(erc20Abi)
}

export const getWETHContract = () => {
  return getContract(wethAbi)
}

export const getDefilyContract = () => {
  return getContract(defilyAbi)
}

export const getMasterChefContract = () => {
  return getContract(defilyMasterchef)
}

export const getSouschefContract = () => {
  return getContract(sousChefAbi)
}

export const getSouschefV2Contract = () => {
  return getContract(sousChefV2Abi)
}

export const getDragonContract = () => {
  return getContract(dragonAbi)
}

export const getXChatContract = () => {
  return getContract(xchatAbi)
}

export const getDragonBattleContract = () => {
  return getContract(dragonBattleAbi)
}

export const getDragonBattleBossContract = () => {
  return getContract(dragonBattleBossAbi)
}

export const getMulticallContract = () => {
  return getContract(multicallAbi)
}

export const getLpContract = () => {
  return getContract(lpContractAbi)
}

export const getLandContract = () => {
  return getContract(cdoAbi)
}

export const getVaultContract = () => {
  return getContract(vaultAbi)
}

export const getIdoContract = (option) => {
  switch (option) {
    case 1:
      return getContract(ido1Abi)
    case 2:
      return getContract(ido2Abi)
    case 3:
      return getContract(ido3Abi)
    default:
      return undefined
  }
}

export function getRouterContract() {
  return getContract(routerAbi)
}

export function getZapContract() {
  return getContract(zapAbi)
}
