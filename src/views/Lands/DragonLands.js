import Back from 'components/Back/Back'
import ListProjects from './components/ListProjects'
import OverviewIdo from './components/OverviewIdo'
import DescriptionLaunchpad from './components/DescriptionLaunchpad'
import SectionFooter from './components/SectionFooter'
import { useFetchLands, useLands } from 'store/lands/hook'
import Banner from '../../components/Layout/Banner'
import React, { useMemo } from 'react'
import useRefresh from '../../hooks/useRefresh'
import Value from '../../components/Value/Value'

const DragonLands = () => {
  useFetchLands()
  const lands = useLands()
  const { fastRefresh } = useRefresh()
  const countProjects = 2
  const totalFund = 524000
  const totalHolders = useMemo(() => {
    if (Array.isArray(lands)) {
      let total = 0
      lands?.map((land) => {
        if (land?.participants?.isLoaded) {
          total += land?.participants?.holders
        }
      })
      return total
    }
    return null
  }, [lands, fastRefresh])
  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-ido-2.png)">
        <div className="hidden sm:flex items-end">
          <div className="w-full px-6">
            <div className="container max-w-screen-xl mx-auto grid sm:grid-cols-3">
              <div className="text-white text-center py-1 sm:py-6">
                <p className="text-sm-md">Total Funds Raised</p>
                <Value className="text-3xl font-bold" prefix={'$'} value={totalFund} decimals={0} />
              </div>
              <div className="text-white text-center py-1 sm:py-6">
                <p className="text-sm-md">Projects Launched</p>
                <p className="text-3xl font-bold">{countProjects}</p>
              </div>
              <div className="text-white text-center py-1 sm:py-6">
                <p className="text-sm-md">All-time Unique Participants</p>
                {totalHolders !== null ? (
                  <Value className="text-3xl font-bold" value={totalHolders} decimals={0} />
                ) : (
                  '--'
                )}
              </div>
            </div>
          </div>
        </div>
      </Banner>
      <OverviewIdo countProjects={countProjects} totalHolders={totalHolders} totalFund={totalFund} />
      <div className="px-6">
        <div className="container max-w-screen-xl mx-auto">
          <ListProjects title="Upcoming Projects" data={lands} />
        </div>
      </div>
      <DescriptionLaunchpad />
      <SectionFooter />
    </>
  )
}

export default DragonLands
