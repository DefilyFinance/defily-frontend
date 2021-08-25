import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import battlesConfig from 'constants/battles'
import address from 'constants/contracts'
import tokens from 'constants/tokens'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useState } from 'react'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getDefilyContract, getERC20Contract, getLpContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

import ercAbi from 'config/abi/erc20.json'

const useTokenBalance = (tokenAddress) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useKardiachain()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    async function fetchTokenBalance() {
      try {
        const contract = getERC20Contract()
        const res = await callHelpers(contract, tokenAddress, 'balanceOf', [account])
        setBalance(new BigNumber(res))
      } catch (e) {
        console.log(e)
      }
    }

    if (account && tokenAddress) {
      fetchTokenBalance()
    }
  }, [account, fastRefresh, tokenAddress])

  return balance
}

export const useTotalTokenDflInMasterChef = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState(BIG_ZERO)

  useEffect(() => {
    async function fetchTotalSupply() {
      try {
        const defilyContract = getDefilyContract()
        const supply = await callHelpers(defilyContract, address.defily, 'balanceOf', [address.masterChef])
        setTotalSupply(new BigNumber(supply))
      } catch (e) {
        console.log(e)
      }
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useLockedBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const battles = [
        ...battlesConfig,
        {
          battleAddress: '0x86aFd55BEaC7bfd8476D00D6aA5e185083ac7A11',
        },
        {
          battleAddress: '0x9928e23CAD2202bD4555d9EC00739D7BC4325c21',
        },
      ]

      const balances = await Promise.all(
        battles.map(async (battle) => {
          const calls = [
            {
              address: address.defily,
              name: 'balanceOf',
              params: [battle.battleAddress],
            },
            {
              address: address.dragon,
              name: 'balanceOf',
              params: [battle.battleAddress],
            },
          ]

          const [balanceDefily, balanceDragon] = await multicall(ercAbi, calls)

          return new BigNumber(balanceDefily?.balance._hex).plus(new BigNumber(balanceDragon?.balance._hex))
        }),
      )

      const sum = balances.reduce((acc, balance) => {
        return acc.plus(balance)
      }, BIG_ZERO)

      setBalance(sum.plus(new BigNumber(4000).times(DEFAULT_TOKEN_DECIMAL)))
    }

    fetchBalance()
  }, [slowRefresh])

  return balance
}

export const useBurnedDeadBalance = () => {
  const { fastRefresh } = useRefresh()
  const [balance, setBalance] = useState(BIG_ZERO)

  useEffect(() => {
    async function fetchTokenBalance() {
      try {
        const contract = getERC20Contract()
        const burnedBalance = await callHelpers(contract, address.defily, 'balanceOf', [
          '0x000000000000000000000000000000000000dEaD',
        ])
        setBalance(burnedBalance)
      } catch (e) {
        console.log(e)
      }
    }

    fetchTokenBalance()
  }, [fastRefresh])

  return balance
}

export const useBurnedBalance = () => {
  const { slowRefresh } = useRefresh()
  const [balance, setBalance] = useState(BIG_ZERO)

  useEffect(() => {
    async function fetchTokenBalance() {
      try {
        const contract = getERC20Contract()
        const lpContract = getLpContract()
        const stakedBalance = await callHelpers(contract, tokens.kaiDflKlp.address, 'balanceOf', [
          '0xe32Be8f73f0093dbef8b01705553ff299D609BF3',
        ])
        const totalSupply = await callHelpers(contract, tokens.kaiDflKlp.address, 'totalSupply')
        const { _reserve1 } = await callHelpers(lpContract, tokens.kaiDflKlp.address, 'getReserves')

        const burnedBalance = new BigNumber(stakedBalance)
          .div(new BigNumber(totalSupply))
          .times(new BigNumber(_reserve1))

        setBalance(burnedBalance)
      } catch (e) {
        console.log(e)
      }
    }

    fetchTokenBalance()
  }, [slowRefresh])

  return balance
}

export const useTreasury = () => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useKardiachain()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    async function fetchTokenBalance() {
      try {
        const contract = getERC20Contract()
        const res = await callHelpers(contract, address.defily, 'balanceOf', [address.treasury])
        setBalance(new BigNumber(res))
      } catch (e) {
        console.log(e)
      }
    }

    fetchTokenBalance()
  }, [account, slowRefresh])

  return balance
}

export default useTokenBalance
