import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import farmsConfig from 'constants/farms'
import { CASTLE_TAGS } from 'constants/index'
import miniFarmsConfig, { FIELD } from 'constants/miniFarms'
import castlesConfig, { castlesV2Config } from 'constants/castles'
import vaultsConfig, { vaultsV2Config } from 'constants/vaults'
import useKardiachain from 'hooks/useKardiachain'
import { useEffect, useState } from 'react'
import { BIG_TEN } from 'utils/bigNumber'
import multicall from 'utils/multicall'

import masterChefAbi from 'config/abi/masterchef.json'
import sousChefAbi from 'config/abi/sousChef.json'
import sousChefV2Abi from 'config/abi/sousChefV2.json'
import vaultAbi from 'config/abi/vaultAbi.json'

export const useAllStakedBalance = () => {
  const [balance, setBalance] = useState([])
  const { account } = useKardiachain()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const callsFarms = farmsConfig.map((farm) => ({
          address: address.masterChef,
          name: 'userInfo',
          params: [farm.pid, account],
        }))

        const callsMiniFarmsLtd = miniFarmsConfig[FIELD.LTD].farmsConfig.map((farm) => ({
          address: address.masterChefLtd,
          name: 'userInfo',
          params: [farm.pid, account],
        }))

        const callsMiniFarmsChat = miniFarmsConfig[FIELD.CHAT].farmsConfig.map((farm) => ({
          address: address.masterChefChat,
          name: 'userInfo',
          params: [farm.pid, account],
        }))

        const castleActive = castlesConfig.filter((castle) => !castle.tags.includes(CASTLE_TAGS.ifo))

        const callsPools = castleActive.map((pool) => ({
          address: pool.contractAddress,
          name: 'userInfo',
          params: [account],
        }))

        const callsPoolsV2 = castlesV2Config.map((pool) => ({
          address: pool.contractAddress,
          name: 'userInfo',
          params: [account],
        }))

        const allVaults = [...vaultsConfig, ...vaultsV2Config]

        const callsVaults = allVaults.map((vault) => ({
          address: vault.contractAddress,
          name: 'stakedWantTokens',
          params: [account],
        }))

        const promise = [
          multicall(masterChefAbi, callsFarms),
          multicall(masterChefAbi, callsMiniFarmsLtd),
          multicall(masterChefAbi, callsMiniFarmsChat),
          multicall(sousChefAbi, callsPools),
          multicall(sousChefV2Abi, callsPoolsV2),
          multicall(vaultAbi, callsVaults),
        ]
        const response = await Promise.all(promise)

        const allFarmsStaked = response?.[0]
        const allMiniFarmsLTDStaked = response?.[1]
        const allMiniFarmsChatStaked = response?.[2]
        const allPoolsStaked = response?.[3]
        const allPoolsV2Staked = response?.[4]
        const allVaultsStaked = response?.[5]

        setBalance([
          ...farmsConfig.map((farm, index) => {
            return new BigNumber(allFarmsStaked?.[index]?.amount?._hex || 0).dividedBy(
              BIG_TEN.pow(farm?.token1 ? 18 : farm.token0.decimals),
            )
          }),
          ...miniFarmsConfig[FIELD.LTD].farmsConfig.map((farm, index) => {
            return new BigNumber(allMiniFarmsLTDStaked?.[index]?.amount?._hex || 0).dividedBy(
              BIG_TEN.pow(farm?.token1 ? 18 : farm.token0.decimals),
            )
          }),
          ...miniFarmsConfig[FIELD.CHAT].farmsConfig.map((farm, index) => {
            return new BigNumber(allMiniFarmsChatStaked?.[index]?.amount?._hex || 0).dividedBy(
              BIG_TEN.pow(farm?.token1 ? 18 : farm.token0.decimals),
            )
          }),
          ...castleActive.map((pool, index) => {
            return new BigNumber(allPoolsStaked?.[index]?.amount?._hex || 0).dividedBy(
              BIG_TEN.pow(pool.stakingToken.decimals),
            )
          }),
          ...castlesV2Config.map((pool, index) => {
            return new BigNumber(allPoolsV2Staked?.[index]?.[0]?._hex || 0).dividedBy(
              BIG_TEN.pow(pool.stakingToken.decimals),
            )
          }),
          ...allVaults.map((vault, index) => {
            return new BigNumber(allVaultsStaked?.[index] || 0).dividedBy(BIG_TEN.pow(vault.decimals))
          }),
        ])
      } catch (e) {
        console.log(e)
      }
    }

    if (account) {
      fetchBalance()
    }
  }, [account, setBalance])

  return balance
}
