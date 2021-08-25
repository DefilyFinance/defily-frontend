import BigNumber from 'bignumber.js'
import ActionTool from 'components/ActionTool/ActionTool'
import Back from 'components/Back/Back'
import useDebounce from 'hooks/useDebounce'
import { useMemo, useState } from 'react'
import ContainerPage from 'components/Container/ContainerV2'
import { usePools } from 'store/pools/hook'

import { getTokenName } from 'utils/tokenHelpers'
import ActionCell from 'views/Pools/components/InvestTable/Cells/ActionCell'
import AprCell from 'views/Pools/components/InvestTable/Cells/AprCell'
import AssetsCell from 'views/Pools/components/InvestTable/Cells/AssetsCell'
import RewardsCell from 'views/Pools/components/InvestTable/Cells/RewardsCell'
import TimerCell from 'views/Pools/components/InvestTable/Cells/TimerCell'
import TotalValueLockedCell from 'views/Pools/components/InvestTable/Cells/TotalValueLockedCell'
import PoolsTable from 'views/Pools/components/InvestTable/PoolsTable'
import SkeletonTable from 'views/Pools/components/SkeletonTable/SkeletonTable'
import Banner from 'components/Layout/Banner'
import HeaderDetail from 'components/PageHeader/HeaderDetail'

const sortType = {
  apr: 'apr',
  tvl: 'tvl',
}

const Pools = () => {
  const [sortBy, setSortBy] = useState(sortType.apr)
  const [search, setSearch] = useState('')
  const debouncedQuery = useDebounce(search, 300)

  const pools = usePools()

  const sortList = useMemo(
    () => [
      {
        name: sortType.apr,
        label: 'Apr/Apy',
      },
      {
        name: sortType.tvl,
        label: 'Tvl',
      },
    ],
    [],
  )

  const filterDataBySearch = useMemo(() => {
    return pools.filter((pool) => {
      const nameDisplay = pool.lpAddress
        ? getTokenName(pool.symbol, pool?.t0?.symbol, pool?.t1?.symbol)
        : pool?.stakingToken?.symbol
      return nameDisplay.toLowerCase().includes(debouncedQuery.toLowerCase())
    })
  }, [debouncedQuery, pools])

  const dataSort = useMemo(
    () =>
      filterDataBySearch.sort((poolA, poolB) => {
        if (sortBy === sortType.apr) {
          const aprA = poolA.lpAddress ? poolA?.apy?.yearlyApy || poolA?.apr?.yearlyAPR : poolA.apr

          const aprB = poolB.lpAddress ? poolB?.apy?.yearlyApy || poolB?.apr?.yearlyAPR : poolB.apr

          return new BigNumber(aprB).minus(new BigNumber(aprA)).toNumber()
        } else {
          return poolB.stakedTvl - poolA.stakedTvl
        }
      }),
    [filterDataBySearch, sortBy],
  )

  const columns = useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }) => {
          return row.index + 1
        },
      },
      {
        Header: 'Assets',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <AssetsCell pool={row.original} />,
      },
      {
        Header: 'Tvl',
        accessor: 'stakedTvl',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <TotalValueLockedCell pool={row.original} />,
      },
      {
        Header: 'Apr/Apy',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <AprCell pool={row.original} />,
      },
      {
        Header: 'Starts in/Ends',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <TimerCell pool={row.original} />,
      },
      {
        Header: 'Rewards',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <RewardsCell pool={row.original} />,
      },
      {
        Header: 'Action',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <ActionCell pool={row.original} />,
      },
    ],
    [],
  )

  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-pools.png)">
        <HeaderDetail title="Explore Opportunities">
          <p className="text-white text-xl">Earn tokens by staking LP tokens</p>
        </HeaderDetail>
      </Banner>
      <ContainerPage>
        <ActionTool sortList={sortList} sortBy={sortBy} setSearch={setSearch} setSortBy={setSortBy} hideStakedOnly />
        {pools?.[0]?.apr?.yearlyAPR && pools?.[pools.length - 1]?.apr?.yearlyAPR ? (
          <PoolsTable data={dataSort} columns={columns} />
        ) : (
          <SkeletonTable listHeaders={['#', 'assets', 'Tvl', 'Apr/Apy', 'Starts in/Ends', 'Rewards', 'Action']} />
        )}
      </ContainerPage>
    </>
  )
}

export default Pools
