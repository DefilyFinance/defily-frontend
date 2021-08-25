import BigNumber from 'bignumber.js'
import ActionTool from 'components/ActionTool/ActionTool'
import Back from 'components/Back/Back'
import ContainerPages from 'components/Container/ContainerV2'
import { sortListFarms, sortTypeFarms } from 'constants/farms'
import tokens from 'constants/tokens'
import useDebounce from 'hooks/useDebounce'
import { useMemo, useState } from 'react'
import { isArchivedPid } from 'store/farms/helpers'
import { useFarms } from 'store/farms/hook'
import { updateUserEarningsBalance } from 'store/farms/index'
import { useUserStakedOnly } from 'store/user/hooks/index'
import { getTokenName } from 'utils/tokenHelpers'
import FarmCard from 'views/Farms/components/FarmCard'
import Banner from 'components/Layout/Banner'
import HeaderDetail from 'components/PageHeader/HeaderDetail'
import HarvestCard from 'views/Farms/components/HarvestCard'
import address from 'constants/contracts'

const Farms = () => {
  const { farms, userDataLoaded } = useFarms()
  const activeFarms = useMemo(() => farms.filter((farm) => !isArchivedPid(farm.pid)), [farms])
  const [sortBy, setSortBy] = useState(sortTypeFarms.hot)
  const [search, setSearch] = useState('')
  const debouncedQuery = useDebounce(search, 300)

  const [stakedOnly, setStakedOnly] = useUserStakedOnly()

  const isStakedOnly = stakedOnly?.farms

  const farmsWithStakedBalance = useMemo(() => {
    return activeFarms.filter((farm) => new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
  }, [activeFarms])

  const farmsDisplay = useMemo(() => {
    if (isStakedOnly) return farmsWithStakedBalance

    return activeFarms
  }, [activeFarms, farmsWithStakedBalance, isStakedOnly])

  const filterDataBySearch = useMemo(() => {
    return farmsDisplay.filter((farm) => {
      const nameDisplay = getTokenName(farm.symbol, farm?.t0?.symbol, farm?.t1?.symbol)
      return nameDisplay.toLowerCase().includes(debouncedQuery.toLowerCase())
    })
  }, [debouncedQuery, farmsDisplay])

  const farmsSort = useMemo(() => {
    const farms = [...filterDataBySearch]

    if (sortBy === sortTypeFarms.hot) return farms.sort((farmA, farmB) => farmB.mul - farmA.mul)
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
        <HeaderDetail title="Select Your Fav Farms On Defily">
          <p className="text-white text-xl">Earn tokens by staking LP tokens</p>
        </HeaderDetail>
      </Banner>
      <ContainerPages>
        <div className="container mx-auto max-w-6xl">
          <ActionTool
            className="mb-4"
            isStakedOnly={isStakedOnly}
            setIsStakedOnly={() => setStakedOnly('farms')}
            sortList={sortListFarms}
            sortBy={sortBy}
            setSearch={setSearch}
            setSortBy={setSortBy}
          />
          <HarvestCard
            masterChefAddress={address.masterChef}
            farmsWithStakedBalance={farmsWithStakedBalance}
            earningToken={tokens.defily}
            earningTokenPrice={activeFarms[0]?.earningTokenPrice || 0}
            userDataLoaded={userDataLoaded}
            updateHarvestCallback={updateUserEarningsBalance}
          />
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {farmsSort.map((farm, index) => {
              return <FarmCard key={index} farm={farm} userDataLoaded={userDataLoaded} />
            })}
          </div>
        </div>
      </ContainerPages>
    </>
  )
}

export default Farms
