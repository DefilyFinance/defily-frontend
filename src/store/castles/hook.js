import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useMemo } from 'react'
import castlesConfig from 'constants/castles'
import { fetchCastlesUserDataAsync, fetchCastleUserDataAsync } from './index'
import { transformPool } from './helpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

export const useFetchPoolUserData = () => {
  const { pid } = useParams()
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const { slowRefresh } = useRefresh()
  const pool = useMemo(() => {
    return [...castlesConfig].find((p) => {
      return p.sousId === +pid
    })
  }, [pid])

  useEffect(() => {
    if (account && pool) {
      dispatch(fetchCastleUserDataAsync(account, pool))
    }
  }, [dispatch, slowRefresh, account, pool])
}

export const useCastles = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useKardiachain()

  useEffect(() => {
    if (account) {
      dispatch(fetchCastlesUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { castles, userDataLoaded } = useSelector((state) => ({
    castles: state.castles.data,
    userDataLoaded: state.castles.userDataLoaded,
  }))

  return {
    pools: castles.map(transformPool),
    userDataLoaded,
  }
}

export const useCastlesNoAccount = () => {
  const pools = useSelector((state) => state.castles.data)

  return pools.map(transformPool)
}

export const useCastleFromPid = (sousId) => {
  const pool = useSelector((state) => state.castles.data.find((p) => p.sousId === +sousId))

  if (!pool) return undefined

  return transformPool(pool)
}

export const useCastleUser = (sousId) => {
  const userData = useSelector((state) => state.castles.userData?.[sousId])

  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    earnings: userData ? new BigNumber(userData.earnings) : BIG_ZERO,
    earningsTokenBalance: userData ? new BigNumber(userData.earningsTokenBalance) : BIG_ZERO,
    userDataLoaded: userData?.userDataLoaded || false,
  }
}
