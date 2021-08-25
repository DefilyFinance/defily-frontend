import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import kardiaClient from 'plugin/kardia-dx'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import updateBlockNumber from 'store/application/actions'
import { getKardiachainLink } from 'utils/getUrl'
import { useBlockNumber } from '../application/hooks'
import { checkedTransaction, finalizeTransaction } from './actions'

export function shouldCheck(lastBlockNumber, tx) {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater() {
  const { library, chainId } = useKardiachain()
  const { fastRefresh } = useRefresh()

  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch()
  const state = useSelector((s) => s.transactions)

  const transactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])

  useEffect(() => {
    dispatch(updateBlockNumber({ chainId, blockNumber: lastBlockNumber }))
  }, [chainId, dispatch, fastRefresh, lastBlockNumber])

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        kardiaClient.transaction
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockHeight,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )

              const toast = receipt.status === 1 ? showToastSuccess : showToastError
              toast(
                'Transaction receipt',
                <div>
                  <p>{transactions[hash]?.summary ?? `Hash: ${hash.slice(0, 8)}...${hash.slice(58, 65)}`}</p>
                  {chainId && (
                    <a target="_blank" href={getKardiachainLink(hash, 'transaction')}>
                      View on Kardiachain
                    </a>
                  )}
                </div>,
              )

              // the receipt was fetched before the block, fast forward to that block to trigger balance updates
              // if (receipt.blockHeight > lastBlockNumber) {
              dispatch(updateBlockNumber({ chainId, blockNumber: receipt.blockHeight }))
              // }
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, lastBlockNumber, dispatch])

  return null
}
