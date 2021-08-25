import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'constants/swap'
import { Pair, Token } from 'defily-v2-sdk'
import { useAllTokens } from 'hooks/Tokens'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deserializeToken, serializeToken } from 'store/user/hooks/helpers'
import {
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserSingleHopOnly,
  addSerializedPair,
  updateUserStakedOnly,
} from '../actions'

export function useIsExpertMode() {
  return useSelector((state) => state.user.userExpertMode)
}

export function useExpertModeManager() {
  const dispatch = useDispatch()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useUserDeadline(): [number, (slippage: number) => void] {
  const dispatch = useDispatch()
  const userDeadline = useSelector((state) => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }))
    },
    [dispatch],
  )

  return [userDeadline, setUserDeadline]
}

export function useUserSingleHopOnly() {
  const dispatch = useDispatch()

  const singleHopOnly = useSelector((state) => state.user.userSingleHopOnly)

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch],
  )

  return [singleHopOnly, setSingleHopOnly]
}

export function useUserSlippageTolerance() {
  const dispatch = useDispatch()
  const userSlippageTolerance = useSelector((state) => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (slippage) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserTransactionTTL() {
  const dispatch = useDispatch()
  const userDeadline = useSelector((state) => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (deadline) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }))
    },
    [dispatch],
  )

  return [userDeadline, setUserDeadline]
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]) {
  return new Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'KLP', 'KAIDEX LP Token')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs() {
  const { chainId } = useKardiachain()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs = useMemo(
    () =>
      chainId
        ? Object.keys(tokens).flatMap((tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  }
                  return [base, token]
                })
                .filter((p) => p !== null)
            )
          })
        : [],
    [tokens, chainId],
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector(({ user: { pairs } }) => pairs)

  const userPairs = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

function serializePair(pair) {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  }
}

export function usePairAdder() {
  const dispatch = useDispatch()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch],
  )
}

export function useUserStakedOnly() {
  const dispatch = useDispatch()

  const stakedOnly = useSelector((state) => state.user.userStakedOnly)

  const setStakedOnly = useCallback(
    (field) => {
      dispatch(updateUserStakedOnly({ field }))
    },
    [dispatch],
  )

  return [stakedOnly, setStakedOnly]
}
