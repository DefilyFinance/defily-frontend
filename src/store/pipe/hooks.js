import BigNumber from 'bignumber.js'
import { WKAI } from 'constants/tokens'
import { currencyEquals, ETHER, JSBI } from 'defily-v2-sdk'
import { useTradeExactOut } from 'hooks/Trades'
import useKardiachain from 'hooks/useKardiachain'
import useTotalSupply from 'hooks/useTotalSupply'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, typeInput } from 'store/pipe/actions'
import { usePrices } from 'store/prices/hook'
import { getParameterCaseInsensitive } from 'utils/index'
import { calculatorPriceLp } from 'utils/priceHelpers'
import { wrappedCurrencyAmount } from 'utils/wrappedCurrency'

import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'

const ZERO = JSBI.BigInt(0)

export function usePipeState() {
  return useSelector((state) => state.pipe)
}

export function usePipeActionHandlers(noLiquidity) {
  const dispatch = useDispatch()

  const onFieldAInput = useCallback(
    (typedValue) => {
      dispatch(typeInput({ field: Field.PAIR_A, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )
  const onFieldBInput = useCallback(
    (typedValue) => {
      dispatch(typeInput({ field: Field.PAIR_B, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )

  return {
    onFieldAInput,
    onFieldBInput,
  }
}

export function useDerivedPipeInfo(pairA, pairB) {
  const { account, chainId } = useKardiachain()
  const prices = usePrices()

  const { independentField, typedValue, otherTypedValue } = usePipeState()

  const dependentField = independentField === Field.PAIR_A ? Field.PAIR_B : Field.PAIR_A

  // tokens
  const currencies = useMemo(
    () => ({
      [Field.PAIR_A]: pairA ?? undefined,
      [Field.PAIR_B]: pairB ?? undefined,
    }),
    [pairA, pairB],
  )

  const totalSupplyA = useTotalSupply(pairA?.liquidityToken)
  const totalSupplyB = useTotalSupply(pairB?.liquidityToken)

  let usdcValues = {
    [currencies[Field.PAIR_A]?.token0?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.PAIR_A]?.token0?.address,
    ),
    [currencies[Field.PAIR_A]?.token1?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.PAIR_A]?.token1?.address,
    ),
    [currencies[Field.PAIR_B]?.token0?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.PAIR_B]?.token0?.address,
    ),
    [currencies[Field.PAIR_B]?.token1?.address]: getParameterCaseInsensitive(
      prices,
      currencies[Field.PAIR_B]?.token1?.address,
    ),
  }

  const noLiquidity =
    Boolean(totalSupplyA && JSBI.equal(totalSupplyA.raw, ZERO)) ||
    Boolean(totalSupplyB && JSBI.equal(totalSupplyB.raw, ZERO))

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.PAIR_A]?.liquidityToken,
    currencies[Field.PAIR_B]?.liquidityToken,
  ])

  const currencyBalances = {
    [Field.PAIR_A]: balances[0],
    [Field.PAIR_B]: balances[1],
  }

  let outputToken0Amount
  let outputToken1Amount

  // amounts
  const independentAmount = tryParseAmount(typedValue, currencies[independentField]?.liquidityToken)
  const dependentAmount = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      const pricePairA = calculatorPriceLp(
        currencies[Field.PAIR_A],
        totalSupplyA,
        usdcValues[currencies[Field.PAIR_A]?.token0?.address],
        usdcValues[currencies[Field.PAIR_A]?.token1?.address],
      )
      const pricePairB = calculatorPriceLp(
        currencies[Field.PAIR_B],
        totalSupplyB,
        usdcValues[currencies[Field.PAIR_B]?.token0?.address],
        usdcValues[currencies[Field.PAIR_B]?.token1?.address],
      )

      if (currencies[Field.PAIR_A] && currencies[Field.PAIR_B] && pricePairA && pricePairB) {
        const priceOfIndependent =
          dependentField === Field.PAIR_B
            ? new BigNumber(wrappedIndependentAmount.toExact()).times(pricePairA)
            : new BigNumber(wrappedIndependentAmount.toExact()).times(pricePairB)

        usdcValues[Field.PAIR_A] = tryParseAmount(
          priceOfIndependent.toFixed(currencies[Field.PAIR_A]?.liquidityToken.decimals),
          currencies[Field.PAIR_A]?.liquidityToken,
        )
        usdcValues[Field.PAIR_B] = tryParseAmount(
          priceOfIndependent.toFixed(currencies[Field.PAIR_B]?.liquidityToken.decimals),
          currencies[Field.PAIR_B]?.liquidityToken,
        )

        const dependentCurrency =
          dependentField === Field.PAIR_B
            ? new BigNumber(priceOfIndependent).div(pricePairB)
            : new BigNumber(priceOfIndependent).div(pricePairA)

        outputToken0Amount = tryParseAmount(
          priceOfIndependent
            .div(2)
            .div(usdcValues[currencies[Field.PAIR_B]?.token0?.address])
            .toFixed(currencies[Field.PAIR_B].token0.decimals),
          currencies[Field.PAIR_B].token0,
        ) // fake amount

        outputToken1Amount = tryParseAmount(
          priceOfIndependent
            .div(2)
            .div(usdcValues[currencies[Field.PAIR_B]?.token1?.address])
            .toFixed(currencies[Field.PAIR_B].token1.decimals),
          currencies[Field.PAIR_B].token1,
        ) // fake amount

        return dependentCurrency.toString()
      }
      return undefined
    }
    return undefined
  }, [
    noLiquidity,
    independentAmount,
    otherTypedValue,
    currencies,
    dependentField,
    chainId,
    totalSupplyA,
    usdcValues,
    totalSupplyB,
  ])

  const parsedAmounts = useMemo(
    () => ({
      [Field.PAIR_A]: independentField === Field.PAIR_A ? independentAmount : dependentAmount,
      [Field.PAIR_B]: dependentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  const inputToken0Trade = useTradeExactOut(
    currencies[Field.PAIR_A] ? currencies[Field.PAIR_A].token0 : undefined,
    chainId === 1 ? outputToken0Amount : undefined,
  )
  const inputToken1Trade = useTradeExactOut(
    currencies[Field.PAIR_A] ? currencies[Field.PAIR_A].token1 : undefined,
    chainId === 1 ? outputToken0Amount : undefined,
  )
  const outputToken0Trade = useTradeExactOut(
    currencies[Field.PAIR_B] ? currencies[Field.PAIR_B].token0 : undefined,
    chainId === 1 ? outputToken1Amount : undefined,
  )

  const pairAToken0IsETH = currencies[Field.PAIR_A]?.token0 === ETHER
  const pairBToken1IsETH = currencies[Field.PAIR_B]?.token0 === ETHER

  const pairAToken0Compare = pairAToken0IsETH ? WKAI : currencies[Field.PAIR_A]?.token0
  const pairAToken1Compare = pairBToken1IsETH ? WKAI : currencies[Field.PAIR_A]?.token1

  const pathToken0InputToToken0Output = currencyEquals(pairAToken0Compare, currencies[Field.PAIR_B]?.token0)
    ? []
    : inputToken0Trade
    ? inputToken0Trade.route.path.map((token) => token.address)
    : []

  const pathToken1InputToToken0Output = currencyEquals(pairAToken1Compare, currencies[Field.PAIR_B]?.token0)
    ? []
    : inputToken1Trade
    ? inputToken1Trade.route.path.map((token) => token.address)
    : []

  const pathToken0OutputToToken1Output = outputToken0Trade
    ? outputToken0Trade.route.path.map((token) => token.address)
    : []

  const path = {
    pathToken0InputToToken0Output,
    pathToken1InputToToken0Output,
    pathToken0OutputToToken1Output,
  }

  let error
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmounts[Field.PAIR_A]) {
    error = error ?? 'Enter an amount'
  }

  if (!currencies[Field.PAIR_A] || !currencies[Field.PAIR_B]) {
    error = error ?? 'Select a pair'
  }

  const { [Field.PAIR_A]: currencyAAmount } = parsedAmounts

  if (currencyAAmount && currencyBalances?.[Field.PAIR_A]?.lessThan(currencyAAmount)) {
    error = `Insufficient ${currencies[Field.PAIR_A].token0?.symbol}/${currencies[Field.PAIR_A].token1?.symbol} balance`
  }

  return {
    usdcValues,
    dependentField,
    path,
    currencies,
    currencyBalances,
    parsedAmounts,
    noLiquidity,
    error,
  }
}
