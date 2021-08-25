import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, GAS_LIMIT_DEFAULT, UINT256_MAX } from 'config/index'
import address from 'constants/contracts'
import kardiaClient from 'plugin/kardia-dx'
import { BIG_TEN } from 'utils/bigNumber'

export const callHelpers = (contract, addressContract, method, params = []) => {
  const invoke = contract.invokeContract(method, params)
  return invoke.call(addressContract, {}, 'latest')
}

export const estimatedHelpers = (contract, method, params = []) => {
  const invoke = contract.invokeContract(method, params)
  return invoke.estimateGas(invoke.txData())
}

export const txDataHelpers = (contract, methodName, params = []) => {
  return contract.invokeContract(methodName, params).txData()
}

export const sendTransactionToExtension = async (account, txData, toAddress, params = {}) => {
  const kardiaTransaction = kardiaClient.transaction

  const res = await kardiaTransaction.sendTransactionToExtension(
    {
      from: account,
      gas: GAS_LIMIT_DEFAULT,
      data: txData,
      to: toAddress,
      ...params,
    },
    true,
  )

  if (res.status === 0) throw new Error('Transaction Failed!')

  return res
}

export const approve = async (contract, masterChefAddress, tokenAddress, account) => {
  const txData = contract.invokeContract('approve', [masterChefAddress, UINT256_MAX]).txData()

  const response = await sendTransactionToExtension(account, txData, tokenAddress)

  return response.transactionHash
}

export const approveDragon = async (contract, account) => {
  const txData = contract.invokeContract('approve', [address.dragon, UINT256_MAX]).txData()

  const response = await sendTransactionToExtension(account, txData, address.defily)

  return response.transactionHash
}

export const approveDragonBattle = async (contract, account, battleAddress) => {
  const txData = contract.invokeContract('approve', [battleAddress, UINT256_MAX]).txData()

  const response = await sendTransactionToExtension(account, txData, address.dragon)

  return response.transactionHash
}

export const approveSousChef = async (contract, tokenAddress, poolAddress, account) => {
  const txData = contract.invokeContract('approve', [poolAddress, UINT256_MAX]).txData()

  const response = await sendTransactionToExtension(account, txData, tokenAddress)

  return response.transactionHash
}

export const approveVault = async (contract, contractAddress, poolAddress, account) => {
  const txData = contract.invokeContract('approve', [contractAddress, UINT256_MAX]).txData()

  const response = await sendTransactionToExtension(account, txData, poolAddress)

  return response.transactionHash
}

export const stake = async (masterChefContract, masterChefAddress, pid, amount, account, decimals = 18) => {
  const txData = masterChefContract
    .invokeContract('deposit', [pid, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed()])
    .txData()

  const response = await sendTransactionToExtension(account, txData, masterChefAddress)

  return response.transactionHash
}

export const sousStake = async (souschefContract, poolAddress, amount, decimals, account) => {
  const txData = souschefContract
    .invokeContract('deposit', [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed()])
    .txData()

  const response = await sendTransactionToExtension(account, txData, poolAddress)

  return response.transactionHash
}

export const unstake = async (masterChefContract, masterChefAddress, pid, amount, account, decimals = 18) => {
  const txData = masterChefContract
    .invokeContract('withdraw', [pid, new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed()])
    .txData()

  const response = await sendTransactionToExtension(account, txData, masterChefAddress)

  return response.transactionHash
}

export const sousUnstake = async (souschefContract, poolAddress, amount, decimals, account) => {
  const txData = souschefContract
    .invokeContract('withdraw', [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed()])
    .txData()

  const response = await sendTransactionToExtension(account, txData, poolAddress)

  return response.transactionHash
}

export const sousUnstakeEmergency = async (souschefContract, poolAddress, account) => {
  const txData = souschefContract.invokeContract('emergencyWithdraw', []).txData()

  const response = await sendTransactionToExtension(account, txData, poolAddress)

  return response.transactionHash
}

export const harvest = async (masterChefContract, masterChefAddress, pid, account) => {
  const txData = masterChefContract.invokeContract('deposit', [pid, '0']).txData()

  const response = await sendTransactionToExtension(account, txData, masterChefAddress)

  return response.transactionHash
}

export const harvestWithdraw = async (masterChefContract, masterChefAddress, pid, account) => {
  const txData = masterChefContract.invokeContract('withdraw', [pid, '1']).txData()

  const response = await sendTransactionToExtension(account, txData, masterChefAddress)

  return response.transactionHash
}

export const soushHarvest = async (souschefContract, poolAddress, account) => {
  const txData = souschefContract.invokeContract('deposit', ['0']).txData()

  const response = await sendTransactionToExtension(account, txData, poolAddress)

  return response.transactionHash
}

export const soushHarvestWithdraw = async (souschefContract, poolAddress, account) => {
  const txData = souschefContract.invokeContract('withdraw', ['0']).txData()

  const response = await sendTransactionToExtension(account, txData, poolAddress)

  return response.transactionHash
}

export const wrapDfl = async (dragonContract, amount, account) => {
  const txData = dragonContract
    .invokeContract('wrapAmountDFL', [new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toFixed()])
    .txData()

  return await sendTransactionToExtension(account, txData, address.dragon)
}

export const unwrapDfl = async (dragonContract, amount, account) => {
  const txData = dragonContract
    .invokeContract('unwrapAmountDFL', [new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toFixed()])
    .txData()

  return await sendTransactionToExtension(account, txData, address.dragon)
}

export const wrapChat = async (dragonContract, amount, account) => {
  const txData = dragonContract
    .invokeContract('wrapAmountCHAT', [new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toFixed()])
    .txData()

  return await sendTransactionToExtension(account, txData, address.xChat)
}

export const unwrapChat = async (dragonContract, amount, account) => {
  const txData = dragonContract
    .invokeContract('unwrapAmountCHAT', [new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toFixed()])
    .txData()

  return await sendTransactionToExtension(account, txData, address.xChat)
}

export const fight = async (dragonBattleContract, account, battleAddress, method) => {
  const txData = dragonBattleContract.invokeContract(method, []).txData()

  const response = await sendTransactionToExtension(account, txData, battleAddress)

  return response.transactionHash
}

export const deposit = async (vaultContract, vaultAddress, amount, account, decimals = 18) => {
  const txData = vaultContract
    .invokeContract('deposit', [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed()])
    .txData()

  const response = await sendTransactionToExtension(account, txData, vaultAddress)

  return response.transactionHash
}

export const investKai = async (idoContract, idoAddress, amount, account, decimals) => {
  const txData = idoContract.invokeContract('invest', []).txData()
  const response = await sendTransactionToExtension(account, txData, idoAddress, {
    value: new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed(),
  })

  return response.transactionHash
}

export const claimIdo = async (idoContract, idoAddress, account) => {
  const txData = idoContract.invokeContract('claimTokens', []).txData()
  const response = await sendTransactionToExtension(account, txData, idoAddress)

  return response.transactionHash
}

export const refundIdo = async (idoContract, idoAddress, account) => {
  const txData = idoContract.invokeContract('getRefund', []).txData()
  const response = await sendTransactionToExtension(account, txData, idoAddress)

  return response.transactionHash
}

export const withdraw = async (vaultContract, vaultAddress, amount, account, decimals = 18) => {
  const txData = vaultContract
    .invokeContract('withdraw', [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed()])
    .txData()

  const response = await sendTransactionToExtension(account, txData, vaultAddress)

  return response.transactionHash
}

export const getStakedV2 = async (masterChefContract, pid, account) => {
  const { amount } = await callHelpers(masterChefContract, address.masterChefLtd, 'userInfo', [pid, account])

  return amount
}
