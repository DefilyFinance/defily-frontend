import { useAllLists } from 'store/lists/hooks'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { acceptListUpdate } from './actions'
import { useActiveListUrls } from './hooks'

export default function Updater(): null {
  const dispatch = useDispatch()

  // get all loaded lists, and the active urls
  const lists = useAllLists()
  const activeListUrls = useActiveListUrls()

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        // eslint-disable-next-line default-case
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          // update any active or inactive lists
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl))
        }
      }
    })
  }, [dispatch, lists, activeListUrls])

  return null
}
