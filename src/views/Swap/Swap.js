import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import CurrencyInputPanel from 'components/CurrencyInputPanel/index'
import UnlockButton from 'components/UnlockButton/UnlockButton'
import { INITIAL_ALLOWED_SLIPPAGE } from 'constants/swap'
import { CHAT, DFL, DRAGON, xCHAT } from 'constants/tokens'
import { CurrencyAmount, JSBI, Percent } from 'defily-v2-sdk'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import useKardiachain from 'hooks/useKardiachain'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import useWrapCallback, { WrapType, useWrapToken } from 'hooks/useWrapCallback'
import { useCallback, useEffect, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { Field } from 'store/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'store/swap/hooks'
import {
  useExpertModeManager,
  useUserDeadline,
  useUserSingleHopOnly,
  useUserSlippageTolerance,
} from 'store/user/hooks/index'
import { computeFiatValuePriceImpact } from 'utils/computeFiatValuePriceImpact'
import maxAmountSpend from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import AdvancedSwapDetailsDropdown from 'views/Swap/components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'views/Swap/components/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from 'views/Swap/components/ConfirmSwapModal'
import PercentPicker from 'components/PercentPicker/PercentPicker'
import { SwapCallbackError } from 'views/Swap/components/SwapCallbackError'
import TradePrice from 'views/Swap/components/TradePrice'

const Swap = () => {
  const { account, chainId } = useKardiachain()

  useDefaultsFromURLSearch()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()
  // get custom setting values for user
  const [deadline] = useUserDeadline()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue } = useSwapState()

  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
    pendingTx: isLoadingWrap,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const {
    wrapType: wrapTypeToken,
    execute: onWrapToken,
    inputError: wrapTokenInputError,
    pendingTx: isLoadingWrapToken,
    requestedApproval: isLoadingApproveToken,
    isApproved: approvalToken,
    onApprove: onApproveToken,
  } = useWrapToken(currencies, typedValue)

  const showWrap = wrapType !== WrapType.NOT_APPLICABLE
  const showToken = wrapTypeToken !== WrapType.NOT_APPLICABLE

  const trade = showWrap || showToken ? undefined : v2Trade

  const parsedAmounts =
    showWrap || showToken
      ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
      : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        }

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])

  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )

  const handleTypeOutput = useCallback(
    (value) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]:
      showWrap || showToken
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput = maxAmountSpend(currencyBalances[Field.INPUT])
  // const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, deadline)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, showConfirm])

  const handleWrap = useCallback(async () => {
    if (showWrap) {
      await onWrap()
    } else {
      await onWrapToken()
    }
    // clear input after wrap success
    onUserInput(Field.INPUT, '')
  }, [onUserInput, onWrap, onWrapToken, showWrap])

  // errors
  const [showInverted, setShowInverted] = useState(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [tradeToConfirm, attemptingTxn, swapErrorMessage, txHash, onUserInput])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  const checkSwapToken = (currency, otherCurrency, onCurrencySelection, tokenBase, tokenWrapper, Field) => {
    const isSwapToken = currency.address === tokenBase.address || currency.address === tokenWrapper.address
    const isWrapToken = currency.address === tokenBase.address
    const isTokenWrapperIsOtherCurrency = otherCurrency?.address === tokenWrapper.address

    if (isSwapToken && !isWrapToken) {
      onCurrencySelection(Field, tokenBase)
    }
    if (!isSwapToken && isTokenWrapperIsOtherCurrency) {
      onCurrencySelection(Field, undefined)
    }
  }

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals

      checkSwapToken(
        inputCurrency,
        currencies[Field.OUTPUT],
        onCurrencySelection,
        DFL[chainId],
        DRAGON[chainId],
        Field.OUTPUT,
      )

      checkSwapToken(
        inputCurrency,
        currencies[Field.OUTPUT],
        onCurrencySelection,
        CHAT[chainId],
        xCHAT[chainId],
        Field.OUTPUT,
      )

      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [chainId, currencies, onCurrencySelection],
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      checkSwapToken(
        outputCurrency,
        currencies[Field.INPUT],
        onCurrencySelection,
        DFL[chainId],
        DRAGON[chainId],
        Field.INPUT,
      )

      checkSwapToken(
        outputCurrency,
        currencies[Field.INPUT],
        onCurrencySelection,
        CHAT[chainId],
        xCHAT[chainId],
        Field.INPUT,
      )

      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [chainId, currencies, onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handlePercentInput = useCallback(
    (percent) => {
      if (!currencyBalances[Field.INPUT]) return
      if (maxAmountInput && percent.equalTo(new Percent('100'))) {
        onUserInput(Field.INPUT, maxAmountInput.toExact())
      } else {
        onUserInput(
          Field.INPUT,
          new CurrencyAmount(currencies[Field.INPUT], percent.multiply(maxAmountInput.raw).quotient).toExact(),
        )
      }
    },
    [currencies, currencyBalances, maxAmountInput, onUserInput],
  )

  return (
    <>
      <ConfirmSwapModal
        open={showConfirm}
        onDismiss={handleConfirmDismiss}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
      />
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader title="Swap" />
        <CurrencyInputPanel
          label={independentField === Field.OUTPUT && !showWrap && !showToken && trade ? 'From (estimated)' : 'From'}
          value={formattedAmounts[Field.INPUT]}
          onMax={handleMaxInput}
          currency={currencies[Field.INPUT]}
          onUserInput={handleTypeInput}
          onCurrencySelect={handleInputSelect}
          otherCurrency={currencies[Field.OUTPUT]}
          fiatValue={fiatValueInput ?? undefined}
          id="swap-currency-input"
        />
        <PercentPicker onChangePercentInput={handlePercentInput} />
        <div className="flex justify-center" style={{ padding: '0 1rem' }}>
          <div className="rounded-lg p-1 cursor-pointer my-2 hover:bg-blue2">
            <ArrowDown
              size={20}
              onClick={() => {
                setApprovalSubmitted(false) // reset 2 step UI for approvals
                onSwitchTokens()
              }}
              color="white"
            />
          </div>
        </div>
        <CurrencyInputPanel
          value={formattedAmounts[Field.OUTPUT]}
          onUserInput={handleTypeOutput}
          label={independentField === Field.INPUT && !showWrap && !showToken && trade ? 'To (estimated)' : 'To'}
          showMaxButton={false}
          currency={currencies[Field.OUTPUT]}
          onCurrencySelect={handleOutputSelect}
          otherCurrency={currencies[Field.INPUT]}
          fiatValue={fiatValueOutput ?? undefined}
          priceImpact={priceImpact}
          id="swap-currency-output"
        />
        {showWrap ? null : (
          <div className="mt-2 text-white">
            {Boolean(trade) && (
              <div className="flex items-center justify-between flex-wrap">
                <p>Price</p>
                <TradePrice
                  price={trade?.executionPrice}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              </div>
            )}
            {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
              <div className="flex items-center justify-center">
                <p>Slippage Tolerance:</p>
                <p className="font-bold primary ml-2">{allowedSlippage / 100}%</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-2">
          {!account ? (
            <UnlockButton />
          ) : showWrap || showToken ? (
            <>
              {showWrap && (
                <Button
                  isLoading={isLoadingWrap}
                  className="w-full"
                  disabled={Boolean(wrapInputError) || isLoadingWrap}
                  onClick={handleWrap}
                >
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                </Button>
              )}
              {showToken && (
                <>
                  {!approvalToken && (
                    <Button
                      isLoading={isLoadingApproveToken}
                      className="w-full mb-2"
                      disabled={isLoadingApproveToken}
                      onClick={onApproveToken}
                    >
                      Approve Contract
                    </Button>
                  )}
                  <Button
                    isLoading={isLoadingWrapToken}
                    className="w-full"
                    disabled={Boolean(wrapTokenInputError) || isLoadingWrapToken || !approvalToken}
                    onClick={handleWrap}
                  >
                    {wrapTokenInputError ??
                      (wrapTypeToken === WrapType.WRAP ? 'Wrap' : wrapTypeToken === WrapType.UNWRAP ? 'Unwrap' : null)}
                  </Button>
                </>
              )}
            </>
          ) : noRoute && userHasSpecifiedInputOutput ? (
            <Button className="w-full">
              <p>
                Insufficient liquidity for this trade.
                {singleHopOnly && <span className="mb-2 block">Try enabling multi-hop trades.</span>}
              </p>
            </Button>
          ) : showApproveFlow ? (
            <>
              <Button
                className="w-full"
                variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                onClick={approveCallback}
                disabled={approval !== ApprovalState.NOT_APPROVED}
                isLoading={approval === ApprovalState.PENDING}
              >
                {approval === ApprovalState.PENDING ? (
                  <div>Approving...</div>
                ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                  `You can now trade ${currencies[Field.INPUT]?.symbol}`
                ) : (
                  `Approve ${currencies[Field.INPUT]?.symbol ?? ''}`
                )}
              </Button>
              <Button
                className="w-full mt-2"
                color={priceImpactSeverity > 2 || priceImpactSeverity > 3 ? 'red' : 'primary'}
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap()
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    })
                  }
                }}
                disabled={!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)}
              >
                {priceImpactSeverity > 3 && !isExpertMode
                  ? 'Price Impact High'
                  : priceImpactSeverity > 2
                  ? 'Swap Anyway'
                  : 'Swap'}
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                if (isExpertMode) {
                  handleSwap()
                } else {
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined,
                  })
                }
              }}
              id="swap-button"
              width="100%"
              disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
            >
              {swapInputError ||
                (priceImpactSeverity > 3 && !isExpertMode
                  ? `Price Impact Too High`
                  : priceImpactSeverity > 2
                  ? 'Swap Anyway'
                  : 'Swap')}
            </Button>
          )}
          {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        </div>
      </Card>
      <AdvancedSwapDetailsDropdown trade={trade} />
    </>
  )
}

export default Swap
