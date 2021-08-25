import BigNumber from 'bignumber.js'
import ActionTool from 'components/ActionTool/ActionTool'
import Back from 'components/Back/Back'
import ContainerPages from 'components/Container/ContainerV2'
import { sortListFarms, sortTypeFarms } from 'constants/farms'
import { FIELD } from 'constants/miniFarms'
import useDebounce from 'hooks/useDebounce'
import { useMemo, useState } from 'react'
import { updateUserEarningsBalance } from 'store/miniFarms/index'
import { useMiniFarms } from 'store/miniFarms/hook'
import { useUserStakedOnly } from 'store/user/hooks/index'
import { getTokenName } from 'utils/tokenHelpers'
import HarvestCard from 'views/Farms/components/HarvestCard'
import FarmCard from 'views/MiniFarms/components/FarmCard'
import Banner from 'components/Layout/Banner'
import HeaderDetail from 'components/PageHeader/HeaderDetail'
import StartCountdown from 'views/MiniFarms/components/StartCountdown'
import TabsMiniFarms from 'views/MiniFarms/components/TabsMiniFarms'

const MiniFarms = () => {
  const { farms, userDataLoaded, data, tab, onChangeTab } = useMiniFarms()
  const [sortBy, setSortBy] = useState(sortTypeFarms.hot)
  const [search, setSearch] = useState('')
  const debouncedQuery = useDebounce(search, 300)

  const [stakedOnly, setStakedOnly] = useUserStakedOnly()
  const isStakedOnly = stakedOnly?.miniFarms

  const farmsWithStakedBalance = useMemo(() => {
    return farms.filter((farm) => new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
  }, [farms])

  const farmsDisplay = useMemo(() => {
    if (isStakedOnly) return farmsWithStakedBalance

    return farms
  }, [farms, farmsWithStakedBalance, isStakedOnly])

  const filterDataBySearch = useMemo(() => {
    return farmsDisplay.filter((farm) => {
      const nameDisplay = getTokenName(farm.symbol, farm?.t0?.symbol, farm?.t1?.symbol)
      return nameDisplay.toLowerCase().includes(debouncedQuery.toLowerCase())
    })
  }, [debouncedQuery, farmsDisplay])

  const farmsSort = useMemo(() => {
    const farms = [...filterDataBySearch]

    if (sortBy === sortTypeFarms.hot) return farms
    return farms.sort((farmA, farmB) => {
      if (sortBy === sortTypeFarms.apr) {
        return farmB?.apr?.yearlyAPR - farmA?.apr?.yearlyAPR
      }
      if (sortBy === sortTypeFarms.tvl) {
        return farmB.stakedTvl - farmA.stakedTvl
      }
    })
  }, [filterDataBySearch, sortBy])

  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-earn.png)">
        <HeaderDetail title="Farms on Mini Farm">
          <p className="text-white text-xl">
            This Mini Farm Token is from Partner of Defily. Please farm at your own risk.
          </p>
        </HeaderDetail>
      </Banner>
      <ContainerPages>
        <div className="container mx-auto max-w-6xl">
          <ActionTool
            className="mb-4"
            isStakedOnly={isStakedOnly}
            setIsStakedOnly={() => setStakedOnly('miniFarms')}
            sortList={sortListFarms}
            sortBy={sortBy}
            setSearch={setSearch}
            setSortBy={setSortBy}
          />
          <TabsMiniFarms tab={tab} onChangeTab={onChangeTab} />
          <HarvestCard
            nameFarm={tab}
            farmsConfig={data.farmsConfig}
            masterChefAddress={data.contractAddress}
            earningToken={data.earningToken}
            farmsWithStakedBalance={farmsWithStakedBalance}
            userDataLoaded={userDataLoaded}
            updateHarvestCallback={updateUserEarningsBalance}
          />
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {farmsSort.map((farm, index) => {
              return (
                <FarmCard
                  key={index}
                  farm={farm}
                  userDataLoaded={userDataLoaded}
                  tab={tab}
                  earningToken={data.earningToken}
                  masterChefAddress={data.contractAddress}
                />
              )
            })}
          </div>
        </div>
      </ContainerPages>
    </>
  )
}

export default MiniFarms
