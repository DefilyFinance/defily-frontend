import BigNumber from 'bignumber.js'
import ActionTool from 'components/ActionTool/ActionTool'
import Back from 'components/Back/Back'
import Button from 'components/Button/Button'
import { TabContent, TabPane } from 'components/Tabs/Tabs'
import TabsFinished from 'components/Tabs/TabsFinished'
import { sortListFarms, sortTypeFarms } from 'constants/farms'
import { CASTLE_TAGS, TABS } from 'constants/index'
import useDebounce from 'hooks/useDebounce'
import { useMemo, useState } from 'react'
import { useCastles } from 'store/castles/hook'
import { useUserStakedOnly } from 'store/user/hooks/index'
import CastleCard from 'views/Castles/components/CastleCard'
import Banner from 'components/Layout/Banner'
import HeaderDetail from 'components/PageHeader/HeaderDetail'
import ContainerPage from 'components/Container/ContainerV2'
import HarvestCard from 'views/Castles/components/HarvestCard'

const Castles = () => {
  const { pools, userDataLoaded } = useCastles()
  const [tab, setTab] = useState(TABS.live)
  const [sortBy, setSortBy] = useState(sortTypeFarms.hot)
  const [search, setSearch] = useState('')
  const debouncedQuery = useDebounce(search, 300)

  const [stakedOnly, setStakedOnly] = useUserStakedOnly()
  const isStakedOnly = stakedOnly?.pools

  const handleChangeTab = (value) => {
    if (value !== tab) {
      setTab(value)
    }
  }

  const poolsActive = useMemo(() => {
    if (tab === TABS.live) {
      return pools
        .filter((pool) => !pool.isHide)
        .filter((pool) => !pool.isFinished)
        .sort((poolA) => {
          if (poolA.sortId) {
            return -1
          }
          return 1
        })
    }

    return pools
      .filter((pool) => !pool.isHide)
      .filter((pool) => pool.isFinished)
      .sort((pool) => (pool.isV2 ? -1 : 0))
  }, [pools, tab])

  const poolsWithStakedBalance = useMemo(() => {
    return pools
      .filter((pool) => !pool.isHide)
      .filter((pool) => !pool.isFinished)
      .filter((pool) => !pool.tags.includes(CASTLE_TAGS.ifo))
      .filter((farm) => new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
  }, [pools])

  const poolsDisplay = useMemo(() => {
    if (isStakedOnly) return poolsActive.filter((pool) => new BigNumber(pool.userData.stakedBalance).isGreaterThan(0))

    return poolsActive
  }, [poolsActive, isStakedOnly])

  const filterDataBySearch = useMemo(() => {
    return poolsDisplay.filter((pool) => {
      const nameDisplay = pool.stakingToken.symbol
      return nameDisplay.toLowerCase().includes(debouncedQuery.toLowerCase())
    })
  }, [debouncedQuery, poolsDisplay])

  const poolsSort = useMemo(() => {
    const farms = [...filterDataBySearch]

    if (sortBy === sortTypeFarms.hot) return farms
    return farms.sort((poolA, poolB) => {
      if (sortBy === sortTypeFarms.apr) {
        return poolB?.apr - poolA?.apr
      }
      if (sortBy === sortTypeFarms.tvl) {
        return poolB.stakedTvl - poolA.stakedTvl
      }
    })
  }, [filterDataBySearch, sortBy])

  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-stake.png)">
        <HeaderDetail title="Dragon Castles">
          <p className="text-white text-xl">Deposit Tokens, Earn Tokens</p>
        </HeaderDetail>
      </Banner>
      <div>
        <ContainerPage>
          <div className="mx-auto max-w-7xl">
            <ActionTool
              isStakedOnly={isStakedOnly}
              setIsStakedOnly={() => setStakedOnly('pools')}
              sortList={sortListFarms}
              sortBy={sortBy}
              setSearch={setSearch}
              setSortBy={setSortBy}
            />
            <HarvestCard userDataLoaded={userDataLoaded} poolsWithStakedBalance={poolsWithStakedBalance} />
            <div className="relative z-20">
              <TabsFinished tab={tab} onChangeTab={handleChangeTab} />
              <TabContent className="mt-4" activeTab={tab}>
                <TabPane tabId={TABS.live}>
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {poolsSort.map((pool, index) => {
                      return <CastleCard key={index} pool={pool} index={index} userDataLoaded={userDataLoaded} />
                    })}
                  </div>
                </TabPane>
                <TabPane tabId={TABS.finished}>
                  <p className="mb-2 text-rose-700 text-xl">
                    These pools are no longer distributing rewards. Please unstake your tokens.
                  </p>
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {poolsSort.map((pool, index) => {
                      return <CastleCard key={index} pool={pool} index={index} userDataLoaded={userDataLoaded} />
                    })}
                  </div>
                </TabPane>
              </TabContent>
            </div>
            <Button
              className="mx-auto relative z-20 my-12"
              onClick={() =>
                window.open(
                  'https://docs.google.com/forms/d/e/1FAIpQLScm0CQ1Sf7eitj1pG_H2VoisNnQSjxjVAE9bAaVRNSAS0DNDw/viewform?usp=send_form',
                  '_blank',
                )
              }
            >
              Apply for listing
            </Button>
          </div>
        </ContainerPage>
      </div>
    </>
  )
}

export default Castles
