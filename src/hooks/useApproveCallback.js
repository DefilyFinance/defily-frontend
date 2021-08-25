import { UINT256_MAX } from 'config/index'
import { TokenAmount, ETHER } from 'defily-v2-sdk'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo, useState } from 'react'
import { ROUTER_ADDRESS } from 'constants/swap'
import { estimatedHelpers, sendTransactionToExtension, txDataHelpers } from 'utils/callHelpers'
import { getERC20Contract } from 'utils/contractHelpers'
import useTokenAllowance from './useTokenAllowance'
import { Field } from 'store/swap/actions'
import { useHasPendingApproval, useTransactionAdder } from 'store/transactions/hooks'
import { computeSlippageAdjustedAmounts } from 'utils/prices'

export const ApprovalState = {
  UNKNOWN: 0,
  NOT_APPROVED: 1,
  PENDING: 2,
  APPROVED: 3,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(amountToApprove, spender) {
  const { account } = useKardiachain()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const [pendingTx, setPendingTx] = useState(false)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval || pendingTx
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender, pendingTx])

  const addTransaction = useTransactionAdder()

  const approve = useCallback(async () => {
    const tokenContract = getERC20Contract()

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    try {
      let useExact = false
      estimatedHelpers(tokenContract, 'approve', [spender, UINT256_MAX]).catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true
        return estimatedHelpers('approve', [spender, amountToApprove.raw.toString()])
      })

      setPendingTx(true)
      const response = await sendTransactionToExtension(
        account,
        txDataHelpers(tokenContract, 'approve', [spender, useExact ? amountToApprove.raw.toString() : UINT256_MAX]),
        token.address,
      )
      setPendingTx(false)
      addTransaction(response, {
        summary: `Approve ${amountToApprove.currency.symbol}`,
        approval: { tokenAddress: token.address, spender },
      })
    } catch (error) {
      setPendingTx(false)
      console.error('Failed to approve token', error)
      throw error
    }
  }, [approvalState, token, amountToApprove, spender, account, addTransaction])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [allowedSlippage, trade],
  )

  return useApproveCallback(amountToApprove, ROUTER_ADDRESS)
}
