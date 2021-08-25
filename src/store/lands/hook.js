import { useDispatch, useSelector } from 'react-redux'
import { transformLand } from './helpers'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { fetchLandDataAsync, fetchLandsPublicDataAsync, fetchLandUserDataAsync } from './index'
import useKardiachain from 'hooks/useKardiachain'

export const useLands = () => {
  let pools = useSelector((state) => state.lands.data)

  return pools
}

export const useFetchUserDataLand = () => {
  let pools = useSelector((state) => state.lands.data)

  return pools.map(transformLand)
}

export const useLandFromIdoId = (idoId) => {
  const pool = useSelector((state) =>
    state.lands.data.find(
      (p) => p.idoId === Number(idoId) || (idoId && idoId?.toString()?.toLowerCase() === p.slug?.toLowerCase()),
    ),
  )
  if (!pool) return undefined
  return pool
}

export const useLandUser = (idoId) => {
  const pool = useSelector((state) => {
    const index = state.lands?.data.findIndex(
      (x) => x.idoId === Number(idoId) || (idoId && idoId?.toString()?.toLowerCase() === x.slug?.toLowerCase()),
    )
    if (index !== -1) {
      return state.lands?.data[index].userData
    }
    return undefined
  })

  return pool
}

export const useFetchLands = () => {
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  const lands = useLands()
  useEffect(() => {
    dispatch(fetchLandsPublicDataAsync(lands))
  }, [dispatch, fastRefresh])
}

export const useFetchLand = (id) => {
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  const land = useLandFromIdoId(id)
  useEffect(() => {
    dispatch(fetchLandDataAsync(land))
  }, [dispatch, fastRefresh, id])
}

export const useFetchActiveLand = () => {
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  const lands = useLands()

  const detectActiveLand = () => {
    let activeLand = undefined
    lands
      ?.filter((land) => !land?.notComplete)
      ?.map((land) => {
        const optionNow = land.options.data
          .filter((option) => option.idoContract.closeTime > Date.now())
          .find((option) => option.idoContract.openTime > Date.now() || option.idoContract.closeTime < Date.now())
        if (
          optionNow &&
          (!activeLand || activeLand?.optionNow?.idoContract?.openTime > optionNow?.idoContract?.openTime)
        ) {
          activeLand = {
            ...land,
            optionNow,
          }
        }
      })
    if (activeLand) {
      return activeLand
    }
    let landOngoing = undefined
    lands
      ?.filter((land) => !land?.notComplete)
      ?.map((land) => {
        const optionNow = land.options.data
          .filter((option) => option.idoContract.closeTime > Date.now())
          .reduce(
            (a, b) => (!a?.idoContract?.closeTime || b?.idoContract?.closeTime > a?.idoContract?.closeTime ? b : a),
            undefined,
          )
        if (
          optionNow &&
          (!landOngoing || landOngoing?.optionNow?.idoContract?.closeTime < optionNow?.idoContract?.closeTime)
        ) {
          landOngoing = {
            ...land,
            optionNow,
          }
        }
      })
    if (landOngoing) {
      return landOngoing
    }
  }
  useEffect(() => {
    const land = detectActiveLand()
    if (land) {
      dispatch(fetchLandDataAsync(land))
    }
  }, [dispatch, fastRefresh])
}

export const useLandActive = () => {
  const lands = useSelector((state) => state.lands.data)
  let activeLand = undefined
  lands
    ?.filter((land) => !land?.notComplete)
    ?.map((land) => {
      const optionNow = land.options.data
        .filter((option) => option.idoContract.closeTime > Date.now())
        .find((option) => option.idoContract.openTime > Date.now() || option.idoContract.closeTime < Date.now())
      if (
        optionNow &&
        (!activeLand || activeLand?.optionNow?.idoContract?.openTime > optionNow?.idoContract?.openTime)
      ) {
        activeLand = {
          ...land,
          optionNow,
        }
      }
    })
  if (activeLand) {
    return activeLand
  }
  let landOngoing = undefined
  lands
    ?.filter((land) => !land?.notComplete)
    ?.map((land) => {
      const optionNow = land.options.data
        .filter((option) => option.idoContract.closeTime > Date.now())
        .reduce(
          (a, b) => (!a?.idoContract?.closeTime || b?.idoContract?.closeTime > a?.idoContract?.closeTime ? b : a),
          undefined,
        )
      if (
        optionNow &&
        (!landOngoing || landOngoing?.optionNow?.idoContract?.closeTime < optionNow?.idoContract?.closeTime)
      ) {
        landOngoing = {
          ...land,
          optionNow,
        }
      }
    })
  if (landOngoing) {
    return landOngoing
  }
  return undefined
}

export const useFetchLandUserData = (idoId) => {
  const dispatch = useDispatch()
  const pool = useLandFromIdoId(idoId)
  const { account } = useKardiachain()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account && pool?.idoId) {
      dispatch(fetchLandUserDataAsync(account, pool))
    }
  }, [dispatch, account, pool?.idoId, fastRefresh])
}
