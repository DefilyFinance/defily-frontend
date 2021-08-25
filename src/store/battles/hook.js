import useRefresh from 'hooks/useRefresh'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchBattlesUserDataAsync } from './index'
import { transformBattleUserData } from './helpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

export const useBattles = (account) => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchBattlesUserDataAsync(account))
    }
  }, [account, dispatch, slowRefresh])

  const { battles, userDataLoaded, tokenBalance } = useSelector((state) => ({
    battles: state.battles.data,
    userDataLoaded: state.battles.userDataLoaded,
    tokenBalance: state.battles.tokenBalance,
  }))

  return {
    battles: battles.map((battle) => ({
      ...battle,
      ...transformBattleUserData(battle.userData),
    })),
    userDataLoaded,
    tokenBalance: new BigNumber(tokenBalance),
  }
}

export const useUserBattle = () => {
  const userData = useSelector((state) => state.battles.data)

  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    tokenBalance: userData ? new BigNumber(userData.tokenBalance) : BIG_ZERO,
    userDataLoaded: userData?.userDataLoaded,
  }
}
