import erc20ABI from 'config/abi/erc20.json'
import vaultABI from 'config/abi/vaultAbi.json'
import ido1Abi from 'config/abi/IDO1.json'
import ido2Abi from 'config/abi/IDO2.json'
import ido3Abi from 'config/abi/IDO3.json'
import address from 'constants/contracts'
import kardiaClient from 'plugin/kardia-dx'
import { callHelpers } from 'utils/callHelpers'
import { getERC20Contract, getLandContract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import dragonAbi from '../../config/abi/dragon.json'
import { BIG_TEN } from '../../utils/bigNumber'

const IDO_ABI = {
  ido1Abi: ido1Abi,
  ido2Abi: ido2Abi,
  ido3Abi: ido3Abi,
}
export const fetchLandUserAllowances = async (account, pool) => {
  const calls = pool.options.data.map((option) => {
    return {
      address: pool.stakingToken.address,
      name: 'allowance',
      params: [account, option.poolContract.address],
    }
  })

  const rawPoolAllowances = await multicall(erc20ABI, calls)

  const parsedPoolAllowances = rawPoolAllowances.map((poolBalance) => {
    return new BigNumber(poolBalance).toJSON()
  })

  return parsedPoolAllowances
}

export const fetchInvestmentBalances = async (account, pool) => {
  const promise = pool.options.data.map(async (option) => {
    const calls = [
      {
        address: option.idoContract.address,
        name: 'investments',
        params: [account],
      },

      {
        address: option.idoContract.address,
        name: 'claimed',
        params: [account],
      },
      {
        address: option.idoContract.address,
        name: 'claimAllowed',
      },
      {
        address: option.idoContract.address,
        name: 'refundAllowed',
      },
      {
        address: option.idoContract.address,
        name: 'totalCollectedWei',
      },
    ]
    if (option?.idoContract?.multipleClaim) {
      calls.push({
        address: option.idoContract.address,
        name: 'getCurrentPeriod',
      })
    }
    const [investments, claimed, [claimAllowed], [refundAllowed], totalCollectedWei, getCurrentPeriod] =
      await multicall(IDO_ABI[option?.idoContract?.abiKey], calls)
    const data = {
      investments: new BigNumber(investments).toJSON(),
      claimed: typeof claimed?.[0] === 'boolean' ? claimed?.[0] : new BigNumber(claimed).toNumber(),
      claimAllowed,
      refundAllowed,
      totalCollected: new BigNumber(totalCollectedWei).dividedBy(BIG_TEN.pow(pool?.buyToken?.decimals)).toNumber(),
    }
    if (option?.idoContract?.multipleClaim) {
      data.currentPeriod = new BigNumber(getCurrentPeriod).toNumber()
    }
    return data
  })
  const response = await Promise.all(promise)
  return response
}

export const fetchTotalCollectedIdo = async (pool) => {
  const promise = pool.options.data.map(async (option) => {
    const calls = [
      {
        address: option.idoContract.address,
        name: 'totalCollectedWei',
      },
    ]
    const [totalCollectedWei] = await multicall(IDO_ABI[option?.idoContract?.abiKey], calls)

    return new BigNumber(totalCollectedWei).dividedBy(BIG_TEN.pow(pool?.buyToken?.decimals)).toNumber()
  })
  const response = await Promise.all(promise)
  return response
}

export const fetchTotalInvestorsCount = async (pool) => {
  const promise = pool.options.data.map(async (option) => {
    const calls = [
      {
        address: option.idoContract.address,
        name: 'totalInvestorsCount',
      },
    ]
    const [totalInvestorsCount] = await multicall(IDO_ABI[option?.idoContract?.abiKey], calls)
    return new BigNumber(totalInvestorsCount).toNumber()
  })
  const response = await Promise.all(promise)
  return response
}

export const fetchBalanceHolders = async (pool) => {
  const calls = pool.options.data.map((option) => {
    return {
      address: pool.stakingToken.address,
      name: 'balanceOf',
      params: [option.poolContract.address],
    }
  })
  const res = await multicall(dragonAbi, calls)

  const balanceHolders = res.map((poolBalance) => {
    return new BigNumber(poolBalance).toJSON()
  })

  return balanceHolders
}

export const fetchBalanceIdo = async (pool) => {
  const calls = pool.options.data.map((option) => {
    return {
      address: pool?.token?.address,
      name: 'balanceOf',
      params: [option.idoContract.address],
    }
  })
  const res = await multicall(erc20ABI, calls)

  const idoBalances = res.map((poolBalance) => {
    return new BigNumber(poolBalance).toJSON()
  })

  return idoBalances
}

export const fetchLandUserStakingTokenBalance = async (account, pool) => {
  const contract = getERC20Contract()
  const balance = await callHelpers(contract, pool.stakingToken.address, 'balanceOf', [account])
  return new BigNumber(balance).toJSON()
}

export const fetchLandUserTokenBalance = async (account) => {
  const accountModule = kardiaClient.account
  const balance = await accountModule.getBalance(account)
  return new BigNumber(balance).toJSON()
}

export const fetchLandUserStakedBalances = async (account, pool) => {
  const calls = pool.options.data.map((option) => {
    return {
      address: option.poolContract.address,
      name: 'userInfo',
      params: [account],
    }
  })

  const rawStakedBalances = await multicall(vaultABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance).toJSON()
  })

  return parsedStakedBalances
}

export const fetchLandAllowance = async (account, poolAddress) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, address.defily, 'allowance', [account, poolAddress])
  return new BigNumber(res).toJSON()
}

export const fetchDragonUserBalance = async (account) => {
  const contract = getERC20Contract()
  const balance = await callHelpers(contract, address.dragon, 'balanceOf', [account])

  return new BigNumber(balance).toJSON()
}

export const fetchLandUserInvestedBalance = async (account, poolAddress) => {
  const landContract = getLandContract()

  const balance = await callHelpers(landContract, poolAddress, 'investments', [account])

  return new BigNumber(balance).toJSON()
}

export const fetchLandUserClaimedBalance = async (account, poolAddress) => {
  const landContract = getLandContract()

  const balance = await callHelpers(landContract, poolAddress, 'claimed', [account])

  return new BigNumber(balance).toJSON()
}
