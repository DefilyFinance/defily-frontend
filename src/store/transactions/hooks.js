import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction } from './actions'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder() {
  const { chainId, account } = useKardiachain()
  const dispatch = useDispatch()

  return useCallback(
    (response, { summary, approval, claim }) => {
      if (!account) return
      if (!chainId) return

      const { transactionHash } = response
      if (!transactionHash) {
        throw Error('No transaction hash found.')
      }
      dispatch(addTransaction({ hash: transactionHash, from: account, chainId, approval, summary, claim }))
    },
    [dispatch, chainId, account],
  )
}

// returns all the transactions for the current chain
export function useAllTransactions() {
  const { chainId } = useKardiachain()

  const state = useSelector((s) => s.transactions)

  return chainId ? state[chainId] ?? {} : {}
}

export function useIsTransactionPending(transactionHash) {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx) {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress, spender) {
  const allTransactions = useAllTransactions()

  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        }
        const { approval } = tx
        if (!approval) return false
        return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
      }),
    [allTransactions, spender, tokenAddress],
  )
}
