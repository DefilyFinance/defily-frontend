import BigNumber from 'bignumber.js'
import tokens, { WKAI } from 'constants/tokens'
import { currencyEquals, ETHER, JSBI, Token } from 'defily-v2-sdk'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactOut } from 'hooks/Trades'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useTotalSupply from 'hooks/useTotalSupply'
import { usePrices } from 'store/prices/hook'
import { getParameterCaseInsensitive, isAddress } from 'utils/index'
import { calculatorPriceLp } from 'utils/priceHelpers'
import { wrappedCurrencyAmount } from 'utils/wrappedCurrency'

import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput, selectCurrency, switchZapFlow, ZAP_FLOW, replaceZapState } from 'store/zap/actions'

const ZERO = JSBI.BigInt(0)

export function useZapState() {
  return useSelector((state) => state.zap)
}

export function useZapActionHandlers(noLiquidity) {
  const dispatch = useDispatch()

  const onFieldAInput = useCallback(
    (typedValue) => {
      dispatch(typeInput({ field: Field.INPUT, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )

  const onFieldBInput = useCallback(
    (typedValue) => {
      dispatch(typeInput({ field: Field.OUTPUT, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )

  const onSwitchFlow = useCallback(() => {
    dispatch(switchZapFlow())
  }, [dispatch])

  const onCurrencySelection = useCallback(
    (field, currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'KAI' : '',
          pairId: currency?.liquidityToken?.address,
        }),
      )
    },
    [dispatch],
  )

  return {
    onFieldAInput,
    onFieldBInput,
    onSwitchFlow,
    onCurrencySelection,
  }
}

export function useDerivedZapInfo(pairs) {
  const { account, chainId } = useKardiachain()
  const prices = usePrices()

  const {
    independentField,
    typedValue,
    flow,
    [Field.INPUT]: { currencyId: inputCurrencyId, pairId: inputPairId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId, pairId: outputPairId },
  } = useZapState()

  const dependentField = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const inputCurrency = useCurrency(flow === ZAP_FLOW.PAIR_OUTPUT ? inputCurrencyId : inputPairId)
  const outputCurrency = useCurrency(flow === ZAP_FLOW.PAIR_OUTPUT ? outputPairId : outputCurrencyId)
  const inputPair = inputPairId
    ? pairs.find((pair) => pair.liquidityToken.address.toLowerCase() === inputPairId.toLowerCase())
    : undefined
  const outputPair = outputPairId
    ? pairs.find((pair) => pair.liquidityToken.address.toLowerCase() === outputPairId.toLowerCase())
    : undefined

  // tokens
  const currencies = useMemo(
    () => ({
      [Field.INPUT]: flow === ZAP_FLOW.PAIR_OUTPUT ? inputCurrency ?? undefined : inputPair,
      [Field.OUTPUT]: flow === ZAP_FLOW.PAIR_OUTPUT ? outputPair ?? undefined : outputCurrency,
    }),
    [flow, inputCurrency, inputPair, outputCurrency, outputPair],
  )

  const isTokenInputEther = currencies[Field.INPUT] === ETHER
  const isTokenOutputEther = currencies[Field.OUTPUT] === ETHER

  let usdcValues = {
    [isTokenInputEther ? tokens.wkai.address : currencies[Field.INPUT]?.address]: getParameterCaseInsensitive(
      prices,
      isTokenInputEther ? tokens.wkai.address : currencies[Field.INPUT]?.address,
    ),
    [currencies[Field.INPUT]?.token0?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.INPUT]?.token0?.address,
    ),
    [currencies[Field.INPUT]?.token1?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.INPUT]?.token1?.address,
    ),
    [isTokenOutputEther ? tokens.wkai.address : currencies[Field.OUTPUT]?.address]: getParameterCaseInsensitive(
      prices,
      isTokenOutputEther ? tokens.wkai.address : currencies[Field.OUTPUT]?.address,
    ),
    [currencies[Field.OUTPUT]?.token0?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.OUTPUT]?.token0?.address,
    ),
    [currencies[Field.OUTPUT]?.token1?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.OUTPUT]?.token1?.address,
    ),
  }

  const totalSupplyA = useTotalSupply(inputPair?.liquidityToken)
  const totalSupplyB = useTotalSupply(outputPair?.liquidityToken)

  const noLiquidity =
    flow === ZAP_FLOW.PAIR_OUTPUT
      ? Boolean(totalSupplyB && JSBI.equal(totalSupplyB.raw, ZERO))
      : Boolean(totalSupplyA && JSBI.equal(totalSupplyA.raw, ZERO))

  // balances
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  let outputToken0Amount
  let outputToken1Amount
  let outputTokenAmount

  // amounts
  const independentAmount = tryParseAmount(
    typedValue,
    flow === ZAP_FLOW.PAIR_OUTPUT ? currencies[independentField] : currencies[independentField]?.liquidityToken,
  )
  const dependentAmount = useMemo(() => {
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      const pricePairA = calculatorPriceLp(
        currencies[Field.INPUT],
        totalSupplyA,
        usdcValues[currencies[Field.INPUT]?.token0?.address],
        usdcValues[currencies[Field.INPUT]?.token1?.address],
      )

      const pricePairB = calculatorPriceLp(
        currencies[Field.OUTPUT],
        totalSupplyB,
        usdcValues[currencies[Field.OUTPUT]?.token0?.address],
        usdcValues[currencies[Field.OUTPUT]?.token1?.address],
      )

      if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
        if (flow === ZAP_FLOW.PAIR_OUTPUT && pricePairB) {
          const priceTokenInput = usdcValues[isTokenInputEther ? tokens.wkai.address : currencies[Field.INPUT]?.address]
          const priceOfIndependent = new BigNumber(wrappedIndependentAmount.toExact()).times(priceTokenInput)
          const dependentCurrency = new BigNumber(priceOfIndependent).div(pricePairB)

          usdcValues[Field.OUTPUT] = tryParseAmount(
            priceOfIndependent.toFixed(currencies[Field.OUTPUT]?.liquidityToken.decimals),
            currencies[Field.OUTPUT]?.liquidityToken,
          )
          usdcValues[Field.INPUT] = tryParseAmount(
            priceOfIndependent.toFixed(currencies[Field.INPUT]?.decimals),
            currencies[Field.INPUT],
          )

          outputToken0Amount = tryParseAmount(
            priceOfIndependent
              .div(2)
              .div(usdcValues[currencies[Field.OUTPUT]?.token0?.address])
              .toFixed(currencies[Field.OUTPUT].token0.decimals),
            currencies[Field.OUTPUT].token0,
          ) // fake amount

          outputToken1Amount = tryParseAmount(
            priceOfIndependent
              .div(2)
              .div(usdcValues[currencies[Field.OUTPUT]?.token1?.address])
              .toFixed(currencies[Field.OUTPUT].token1.decimals),
            currencies[Field.OUTPUT].token1,
          ) // fake amount

          return dependentCurrency.toString()
        } else if (flow === ZAP_FLOW.CURRENCY_OUTPUT && pricePairA) {
          const priceTokenOutput =
            usdcValues[isTokenOutputEther ? tokens.wkai.address : currencies[Field.OUTPUT]?.address]
          const priceOfIndependent = new BigNumber(wrappedIndependentAmount.toExact()).times(pricePairA)
          const dependentCurrency = new BigNumber(priceOfIndependent).div(priceTokenOutput)

          usdcValues[Field.INPUT] = tryParseAmount(
            priceOfIndependent.toFixed(currencies[Field.INPUT]?.liquidityToken.decimals),
            currencies[Field.INPUT]?.liquidityToken,
          )
          usdcValues[Field.OUTPUT] = tryParseAmount(
            priceOfIndependent.toFixed(currencies[Field.OUTPUT]?.decimals),
            currencies[Field.OUTPUT],
          )

          if (+dependentCurrency.toFixed(currencies[Field.OUTPUT].decimals) === 0) {
            return undefined
          }

          outputTokenAmount = tryParseAmount(
            dependentCurrency.toFixed(currencies[Field.OUTPUT].decimals),
            currencies[Field.OUTPUT],
          ) // fake amount

          return dependentCurrency.toString()
        }
        return undefined
      }
      return undefined
    }
    return undefined
  }, [independentAmount, chainId, currencies, totalSupplyA, usdcValues, totalSupplyB, flow])

  const parsedAmounts = useMemo(
    () => ({
      [Field.INPUT]: independentField === Field.INPUT ? independentAmount : dependentAmount,
      [Field.OUTPUT]: dependentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  const inputToken0Trade = useTradeExactOut(
    currencies[Field.INPUT] ?? undefined,
    chainId === 1 ? outputToken0Amount : undefined,
  )

  const inputToken1Trade = useTradeExactOut(
    currencies[Field.INPUT] ?? undefined,
    chainId === 1 ? outputToken1Amount : undefined,
  )

  const outputToken0Trade = useTradeExactOut(
    currencies[Field.INPUT]?.token0 ?? undefined,
    chainId === 1 ? outputTokenAmount : undefined,
  )

  const outputToken1Trade = useTradeExactOut(
    currencies[Field.INPUT]?.token1 ?? undefined,
    chainId === 1 ? outputTokenAmount : undefined,
  )

  let pathTokenAtoToken0Output
  let pathTokenAtoToken1Output
  let pathToken0toTokenOutput
  let pathToken1toTokenOutput

  if (flow === ZAP_FLOW.PAIR_OUTPUT) {
    const tokenAIsETH = currencies[Field.INPUT] === ETHER
    const currentACompare = tokenAIsETH ? WKAI : currencies[Field.INPUT]

    pathTokenAtoToken0Output = currencyEquals(currentACompare, currencies[Field.OUTPUT]?.token0)
      ? []
      : inputToken0Trade
      ? inputToken0Trade.route.path.map((token) => token.address)
      : []
    pathTokenAtoToken1Output = currencyEquals(currentACompare, currencies[Field.OUTPUT]?.token1)
      ? []
      : inputToken1Trade
      ? inputToken1Trade.route.path.map((token) => token.address)
      : []
  }

  if (flow === ZAP_FLOW.CURRENCY_OUTPUT) {
    const tokenBIsETH = currencies[Field.OUTPUT] === ETHER
    const currentBCompare = tokenBIsETH ? WKAI : currencies[Field.OUTPUT]

    pathToken0toTokenOutput = currencyEquals(currentBCompare, currencies[Field.INPUT]?.token0)
      ? []
      : outputToken0Trade
      ? outputToken0Trade.route.path.map((token) => token.address)
      : []
    pathToken1toTokenOutput = currencyEquals(currentBCompare, currencies[Field.INPUT]?.token1)
      ? []
      : outputToken1Trade
      ? outputToken1Trade.route.path.map((token) => token.address)
      : []
  }

  const path = {
    pathTokenAtoToken0Output,
    pathTokenAtoToken1Output,
    pathToken0toTokenOutput,
    pathToken1toTokenOutput,
  }

  let error
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmounts[Field.INPUT]) {
    error = error ?? 'Enter an amount'
  }

  if (!currencies[Field.INPUT] && flow === ZAP_FLOW.PAIR_OUTPUT) {
    error = error ?? 'Select a token'
  }

  if (!currencies[Field.OUTPUT] && flow === ZAP_FLOW.PAIR_OUTPUT) {
    error = error ?? 'Select a pair'
  }

  if (!currencies[Field.INPUT] && flow === ZAP_FLOW.CURRENCY_OUTPUT) {
    error = error ?? 'Select a pair'
  }

  if (!currencies[Field.OUTPUT] && flow === ZAP_FLOW.CURRENCY_OUTPUT) {
    error = error ?? 'Select a token'
  }

  const { [Field.INPUT]: currencyAAmount } = parsedAmounts

  const symbol = {
    [Field.INPUT]:
      flow === ZAP_FLOW.CURRENCY_OUTPUT
        ? `${currencies[Field.INPUT]?.token0.symbol}/${currencies[Field.INPUT]?.token1.symbol}`
        : currencies[Field.INPUT]?.symbol,
    [Field.OUTPUT]:
      flow === ZAP_FLOW.PAIR_OUTPUT
        ? `${currencies[Field.OUTPUT]?.token0.symbol}/${currencies[Field.OUTPUT]?.token1.symbol}`
        : currencies[Field.OUTPUT]?.symbol,
  }

  if (currencyAAmount && currencyBalances?.[Field.INPUT]?.lessThan(currencyAAmount)) {
    error = `Insufficient ${symbol[Field.INPUT]} balance`
  }

  return {
    path,
    dependentField,
    currencies,
    currencyBalances,
    parsedAmounts,
    noLiquidity,
    error,
    symbol,
    usdcValues,
  }
}

function parseCurrencyFromURLParameter(urlParam) {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'KAI') return 'KAI'
    if (valid === false) return ''
  }
  return ''
}

export function checkParametersToZapState(pairs, currencyIdA, currencyIdB, currencyA, currencyB) {
  let inputPair = currencyA ? (currencyA.symbol === 'KLP' ? currencyIdA : '') : ''

  let outputPair = currencyB ? (currencyB.symbol === 'KLP' ? currencyIdB : '') : ''

  let inputCurrency = parseCurrencyFromURLParameter(currencyIdA)
  let outputCurrency = parseCurrencyFromURLParameter(currencyIdB)

  if (inputCurrency === outputCurrency) {
    if (typeof currencyIdB === 'string') {
      inputCurrency = ''
    } else {
      inputCurrency = ''
    }
  }

  if (inputPair === outputPair) {
    if (typeof currencyIdB === 'string') {
      inputPair = ''
    } else {
      inputPair = ''
    }
  }

  if (inputPair && outputPair) {
    outputPair = ''
  }

  if (inputCurrency && outputCurrency && !inputPair && !outputPair) {
    outputCurrency = ''
  }

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
      pairId: inputPair,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
      pairId: outputPair,
    },
    typedValue: '',
    independentField: '',
    flow: outputPair || (inputCurrency && !inputPair && !outputPair) ? ZAP_FLOW.PAIR_OUTPUT : ZAP_FLOW.CURRENCY_OUTPUT,
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch(currencyIdA, currencyIdB) {
  const dispatch = useDispatch()
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  useEffect(() => {
    const parsed = checkParametersToZapState(currencyIdA, currencyIdB, currencyA, currencyB)

    dispatch(
      replaceZapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        inputPairId: parsed[Field.INPUT].pairId,
        outputPairId: parsed[Field.OUTPUT].pairId,
        flow: parsed.flow,
      }),
    )
    // setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
  }, [currencyA, currencyB, currencyIdA, currencyIdB, dispatch])
}
