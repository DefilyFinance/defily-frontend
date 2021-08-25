import { JSBI, Percent, Router, TradeType } from 'defily-v2-sdk'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo } from 'react'
import {
  BIPS_BASE,
  DEFAULT_DEADLINE_FROM_NOW,
  INITIAL_ALLOWED_SLIPPAGE,
  ROUTER_ADDRESS,
  swapSupportFeesTokens,
} from 'constants/swap'
import { useTransactionAdder } from 'store/transactions/hooks'
import { estimatedHelpers, sendTransactionToExtension, txDataHelpers } from 'utils/callHelpers'
import { getRouterContract } from 'utils/contractHelpers'
import isZero from '../utils/isZero'

export const SwapCallbackState = {
  INVALID: 0,
  LOADING: 1,
  VALID: 2,
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline
 */
function useSwapCallArguments(
  trade, // trade to execute, required
  allowedSlippage = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline = DEFAULT_DEADLINE_FROM_NOW,
) {
  const { account, chainId, library } = useKardiachain()

  return useMemo(() => {
    if (!trade || !library || !account || !chainId || !deadline) return []

    const contract = getRouterContract()
    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient: account,
        ttl: deadline,
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient: account,
          ttl: deadline,
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, trade])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade, // trade to execute, required
  allowedSlippage = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline = DEFAULT_DEADLINE_FROM_NOW,
) {
  const { account, chainId, library } = useKardiachain()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, deadline)

  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap() {
        const estimatedCalls = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return estimatedHelpers(contract, methodName, args)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)
                    const reason = callError.reason || callError.data?.message || callError.message
                    const errorMessage = `The transaction cannot succeed due to error: ${
                      reason ?? 'Unknown error, check the logs'
                    }.`

                    return { call, error: new Error(errorMessage) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = swapSupportFeesTokens.find(
          (token) => trade?.inputAmount?.token?.address === token.address,
        )
          ? estimatedCalls[1]
          : estimatedCalls.find(
              (el, ix, list) => 'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
            )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call) => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
        } = successfulEstimation

        return sendTransactionToExtension(account, txDataHelpers(contract, methodName, args), ROUTER_ADDRESS, {
          ...(value && !isZero(value) ? { value } : {}),
        })
          .then((response) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const inputAmount = trade.inputAmount.toSignificant(3)
            const outputAmount = trade.outputAmount.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`

            addTransaction(response, {
              summary: base,
            })

            return response.transactionHash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [trade, library, account, chainId, swapCalls, addTransaction])
}
