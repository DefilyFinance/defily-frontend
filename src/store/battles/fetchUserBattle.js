import BigNumber from 'bignumber.js'
import battlesConfig from 'constants/battles'
import address from 'constants/contracts'
import { callHelpers } from 'utils/callHelpers'
import { getERC20Contract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'

import erc20ABI from 'config/abi/erc20.json'

export const fetchBattlesUserAllowance = async (account) => {
  const calls = battlesConfig.map((battle) => ({
    address: address.dragon,
    name: 'allowance',
    params: [account, battle.battleAddress],
  }))

  const allowances = await multicall(erc20ABI, calls)

  return battlesConfig.reduce(
    (acc, pool, index) => ({ ...acc, [index]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchBattleUserAllowance = async (account, battleAddress) => {
  const contract = getERC20Contract()
  const res = await callHelpers(contract, address.dragon, 'allowance', [account, battleAddress])
  return new BigNumber(res).toJSON()
}
