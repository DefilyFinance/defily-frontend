import address from 'constants/contracts'
import tokens, { CHAT, DFL, DRAGON, xCHAT } from 'constants/tokens'
import { currencyEquals, ETHER, WETH } from 'defily-v2-sdk'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserStakingBalance } from 'store/farms/index'
import { Field } from 'store/swap/actions'
import { tryParseAmount } from 'store/swap/hooks'
import { useTransactionAdder } from 'store/transactions/hooks'
import { useCurrencyBalance } from 'store/wallet/hooks'
import { sendTransactionToExtension, txDataHelpers, unwrapChat, unwrapDfl, wrapChat, wrapDfl } from 'utils/callHelpers'
import { getDragonContract, getWETHContract, getXChatContract } from 'utils/contractHelpers'

export const WrapType = {
  NOT_APPLICABLE: 0,
  WRAP: 1,
  UNWRAP: 2,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(inputCurrency, outputCurrency, typedValue) {
  const [pendingTx, setPendingTx] = useState(false)
  const { chainId, account } = useKardiachain()
  const wethContract = getWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency === ETHER && currencyEquals(WETH[chainId], outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await sendTransactionToExtension(
                    account,
                    txDataHelpers(wethContract, 'deposit'),
                    address.wKai,
                    {
                      value: `0x${inputAmount.raw.toString(16)}`,
                    },
                  )
                  setPendingTx(false)
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} KAI to WKAI` })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient KAI balance',
        pendingTx,
      }
    }
    if (currencyEquals(WETH[chainId], inputCurrency) && outputCurrency === ETHER) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await sendTransactionToExtension(
                    account,
                    txDataHelpers(wethContract, 'withdraw', [`0x${inputAmount.raw.toString(16)}`]),
                    address.wKai,
                  )
                  setPendingTx(false)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WKAI to KAI` })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient WKAI balance',
        pendingTx,
      }
    }
    return NOT_APPLICABLE
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, pendingTx, account, addTransaction])
}

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */

export function useWrapDragonCallback(inputCurrency, outputCurrency, typedValue) {
  const dispatch = useDispatch()
  const [pendingTx, setPendingTx] = useState(false)
  // const [requestedApproval, setRequestedApproval] = useState(false)
  const { chainId, account } = useKardiachain()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  const dragonContract = getDragonContract()

  const [approval, approveCallback] = useApproveCallback(inputAmount, address.dragon)

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.address === tokens.defily.address && outputCurrency.address === tokens.dragon.address) {
      return {
        isApproved: approval === ApprovalState.APPROVED || approval === ApprovalState.UNKNOWN,
        requestedApproval: approval === ApprovalState.PENDING,
        pendingTx,
        onApprove: approveCallback,
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await wrapDfl(dragonContract, inputAmount.toSignificant(6), account)
                  // farm dragon
                  dispatch(updateUserStakingBalance(account, 6))
                  setPendingTx(false)
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} DFL to DRAGON` })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: inputAmount ? (sufficientBalance ? undefined : 'Insufficient DFL balance') : 'Enter an amount',
      }
    }
    if (outputCurrency.address === tokens.defily.address && inputCurrency.address === tokens.dragon.address) {
      return {
        isApproved: true,
        requestedApproval: approval === ApprovalState.PENDING,
        wrapType: WrapType.UNWRAP,
        pendingTx,
        onApprove: approveCallback,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await unwrapDfl(dragonContract, inputAmount.toSignificant(6), account)
                  // farm dragon
                  dispatch(updateUserStakingBalance(account, 6))
                  setPendingTx(false)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} DRAGON to DFL` })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: inputAmount ? (sufficientBalance ? undefined : 'Insufficient DRAGON balance') : 'Enter an amount',
      }
    }
    return NOT_APPLICABLE
  }, [
    chainId,
    inputCurrency,
    outputCurrency,
    inputAmount,
    balance,
    approval,
    pendingTx,
    approveCallback,
    dragonContract,
    account,
    addTransaction,
  ])
}

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */

export function useWrapChatCallback(inputCurrency, outputCurrency, typedValue) {
  const [pendingTx, setPendingTx] = useState(false)
  // const [requestedApproval, setRequestedApproval] = useState(false)
  const { chainId, account } = useKardiachain()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  const xChatContract = getXChatContract()

  const [approval, approveCallback] = useApproveCallback(inputAmount, address.xChat)

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.address === tokens.chat.address && outputCurrency.address === tokens.xChat.address) {
      return {
        isApproved: approval === ApprovalState.APPROVED || approval === ApprovalState.UNKNOWN,
        requestedApproval: approval === ApprovalState.PENDING,
        pendingTx,
        onApprove: approveCallback,
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await wrapChat(xChatContract, inputAmount.toSignificant(6), account)
                  setPendingTx(false)
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} CHAT to xCHAT` })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: inputAmount ? (sufficientBalance ? undefined : 'Insufficient CHAT balance') : 'Enter an amount',
      }
    }
    if (outputCurrency.address === tokens.chat.address && inputCurrency.address === tokens.xChat.address) {
      return {
        isApproved: true,
        requestedApproval: approval === ApprovalState.PENDING,
        wrapType: WrapType.UNWRAP,
        pendingTx,
        onApprove: approveCallback,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await unwrapChat(xChatContract, inputAmount.toSignificant(6), account)
                  setPendingTx(false)
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} xCHAT to CHAT` })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: inputAmount ? (sufficientBalance ? undefined : 'Insufficient xCHAT balance') : 'Enter an amount',
      }
    }
    return NOT_APPLICABLE
  }, [
    chainId,
    inputCurrency,
    outputCurrency,
    inputAmount,
    balance,
    approval,
    pendingTx,
    approveCallback,
    xChatContract,
    account,
    addTransaction,
  ])
}

export function useWrapToken(currencies, typedValue) {
  const { account, chainId } = useKardiachain()
  const dispatch = useDispatch()

  const handleWrapDfl = async (inputAmount) => {
    const dragonContract = getDragonContract()
    const txReceipt = await wrapDfl(dragonContract, inputAmount, account)
    // farm dragon
    dispatch(updateUserStakingBalance(account, 6))
    return txReceipt
  }

  const handleUnwrapDfl = async (inputAmount) => {
    const dragonContract = getDragonContract()
    const txReceipt = await unwrapDfl(dragonContract, inputAmount, account)
    // farm dragon
    dispatch(updateUserStakingBalance(account, 6))
    return txReceipt
  }

  const handleWrapChat = async (inputAmount) => {
    const xChatContract = getXChatContract()
    const txReceipt = await wrapChat(xChatContract, inputAmount, account)
    return txReceipt
  }

  const handleUnwrapChat = async (inputAmount) => {
    const xChatContract = getXChatContract()
    const txReceipt = await unwrapChat(xChatContract, inputAmount, account)
    return txReceipt
  }

  const { wrapType: wrapTypeDragon, ...tokenDfl } = useWrapTokenCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue,
    DFL[chainId],
    DRAGON[chainId],
    handleWrapDfl,
    handleUnwrapDfl,
  )

  const { wrapType: wrapTypeChat, ...tokenChat } = useWrapTokenCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue,
    CHAT[chainId],
    xCHAT[chainId],
    handleWrapChat,
    handleUnwrapChat,
  )

  const showWrapDragon = wrapTypeDragon !== WrapType.NOT_APPLICABLE
  const showWrapChat = wrapTypeChat !== WrapType.NOT_APPLICABLE

  return showWrapDragon
    ? {
        wrapType: wrapTypeDragon,
        ...tokenDfl,
      }
    : {
        wrapType: wrapTypeChat,
        ...tokenChat,
      }
}

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */

export function useWrapTokenCallback(
  inputCurrency,
  outputCurrency,
  typedValue,
  tokenBase,
  tokenWrapper,
  callBackWrap,
  callBackUnwrap,
) {
  const [pendingTx, setPendingTx] = useState(false)
  const { chainId, account } = useKardiachain()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  const [approval, approveCallback] = useApproveCallback(inputAmount, tokenWrapper.address)

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.address === tokenBase.address && outputCurrency.address === tokenWrapper.address) {
      return {
        isApproved: approval === ApprovalState.APPROVED || approval === ApprovalState.UNKNOWN,
        requestedApproval: approval === ApprovalState.PENDING,
        pendingTx,
        onApprove: approveCallback,
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await callBackWrap(inputAmount.toSignificant(6))
                  setPendingTx(false)
                  addTransaction(txReceipt, {
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${tokenBase.symbol} to ${tokenWrapper.symbol}`,
                  })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: inputAmount
          ? sufficientBalance
            ? undefined
            : `Insufficient ${tokenBase.symbol} balance`
          : 'Enter an amount',
      }
    }
    if (outputCurrency.address === tokenBase.address && inputCurrency.address === tokenWrapper.address) {
      return {
        isApproved: true,
        requestedApproval: approval === ApprovalState.PENDING,
        wrapType: WrapType.UNWRAP,
        pendingTx,
        onApprove: approveCallback,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  setPendingTx(true)
                  const txReceipt = await callBackUnwrap(inputAmount.toSignificant(6))
                  setPendingTx(false)
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} ${tokenWrapper.symbol} to ${tokenBase.symbol}`,
                  })
                } catch (error) {
                  setPendingTx(false)
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: inputAmount
          ? sufficientBalance
            ? undefined
            : `Insufficient ${tokenWrapper.symbol} balance`
          : 'Enter an amount',
      }
    }
    return NOT_APPLICABLE
  }, [
    chainId,
    inputCurrency,
    outputCurrency,
    inputAmount,
    balance,
    tokenBase.address,
    tokenBase.symbol,
    tokenWrapper.address,
    tokenWrapper.symbol,
    approval,
    pendingTx,
    approveCallback,
    callBackWrap,
    addTransaction,
    callBackUnwrap,
  ])
}
