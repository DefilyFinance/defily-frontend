import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { isTransactionRecent, useAllTransactions } from 'store/transactions/hooks'
import { clearAllTransactions } from 'store/transactions/actions'
import Transaction from './Transaction'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a, b) {
  return b.addedTime - a.addedTime
}

function renderTransactions(transactions) {
  return (
    <div>
      {transactions.map((tx) => {
        return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
      })}
    </div>
  )
}

const TransactionsModal = ({ open, onDismiss }) => {
  const { account, chainId } = useKardiachain()
  const dispatch = useDispatch()
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <Modal open={open} onClose={onDismiss}>
      <ModalTitle onClose={onDismiss}>Recent Transactions</ModalTitle>
      {account && (
        <div>
          {!!pending.length || !!confirmed.length ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <p>Recent Transactions</p>
                <Button onClick={clearAllTransactionsCallback}>clear all</Button>
              </div>
              {renderTransactions(pending)}
              {renderTransactions(confirmed)}
            </>
          ) : (
            <p>No recent transactions</p>
          )}
        </div>
      )}
    </Modal>
  )
}

export default TransactionsModal
