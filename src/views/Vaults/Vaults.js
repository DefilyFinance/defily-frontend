import BigNumber from 'bignumber.js'
import ActionTool from 'components/ActionTool/ActionTool'
import Back from 'components/Back/Back'
import DoubleLogo from 'components/Logo/DoubleLogo'
import { TabContent, TabPane } from 'components/Tabs/Tabs'
import TabsFinished from 'components/Tabs/TabsFinished'
import Tooltip from 'components/Tooltip/Tooltip'
import Value from 'components/Value/Value'
import { TABS } from 'constants/index'
import { sortListVault, sortTypeVault, TYPE_FARM, TYPE_STRATEGY } from 'constants/vaults'
import useDebounce from 'hooks/useDebounce'
import { useBurnedDeadBalance } from 'hooks/useTokenBalance'
import { useEffect, useMemo, useState } from 'react'
import { usePrices } from 'store/prices/hook'
import { useUserStakedOnly } from 'store/user/hooks/index'
import { formatVault, formatVaultV2 } from 'store/vaults/helpers'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'
import { getTokenName } from 'utils/tokenHelpers'
import ApyCell from 'views/Vaults/components/Table/Cells/ApyCell'
import HoldingsV2Cell from 'views/Vaults/components/Table/Cells/HoldingsV2Cell'
import ToggleShowCell from 'views/Vaults/components/Table/Cells/ToggleShowCell'
import AssetsCell from 'views/Vaults/components/Table/Cells/AssetsCell'
import AvailableDepositCell from 'views/Vaults/components/Table/Cells/AvailableDepositCell'
import FeesCell from 'views/Vaults/components/Table/Cells/FeesCell'
import HoldingsCell from 'views/Vaults/components/Table/Cells/HoldingsCell'
import VaultAssetsCell from 'views/Vaults/components/Table/Cells/VaultAssetsCell'
import Table from 'views/Vaults/components/Table/Table'
import { HelpCircle } from 'react-feather'
import { useVaults } from 'store/vaults/hook'
import { useGetPoolsFarms } from 'store/pools/hook'
import { useMiniFarmsNoAccount } from 'store/miniFarms/hook'
import { useFarmsNoAccount } from 'store/farms/hook'
import Banner from 'components/Layout/Banner'
import HeaderDetail from 'components/PageHeader/HeaderDetail'

const Vaults = () => {
  const { vaults, userDataLoaded, vaultsV2, userDataLoadedV2 } = useVaults()
  const [tab, setTab] = useState(TABS.live)
  const [sortBy, setSortBy] = useState(sortTypeVault.hot)
  const [search, setSearch] = useState('')
  const debouncedQuery = useDebounce(search, 300)

  const burnedDeadBalance = getBalanceNumber(useBurnedDeadBalance())

  const [stakedOnly, setStakedOnly] = useUserStakedOnly()
  const isStakedOnly = stakedOnly?.vaults

  const prices = usePrices()
  const farms = useFarmsNoAccount()
  const miniFarms = useMiniFarmsNoAccount()
  const farmsOutside = useGetPoolsFarms()

  const vaultsFormat = useMemo(
    () => vaults.map((vault) => formatVault(prices, farms, miniFarms, farmsOutside, vault)),
    [vaults, prices, farms, miniFarms, farmsOutside],
  )

  const vaultsV2Format = useMemo(
    () => vaultsV2.map((vault) => formatVaultV2(prices, farms, miniFarms, farmsOutside, vault)),
    [vaultsV2, prices, farms, miniFarms, farmsOutside],
  )

  const vaultsActive = useMemo(() => {
    if (tab === TABS.live) {
      return vaultsFormat.filter((pool) => !pool.isFinished)
    }

    return vaultsFormat.filter((pool) => pool.isFinished)
  }, [vaultsFormat, tab])

  const vaultsV2Active = useMemo(() => {
    if (tab === TABS.live) {
      return vaultsV2Format.filter((pool) => !pool.isFinished)
    }

    return vaultsV2Format.filter((pool) => pool.isFinished)
  }, [vaultsV2Format, tab])

  const vaultsSingleToken = useMemo(() => {
    const vaultV1Single = vaultsActive.filter((vault) => !vault.token1)
    const sortVaultDFLToTop = [...vaultsV2Active, ...vaultV1Single].sort((vaultA, vaultB) => {
      if (vaultA.typeFarm === TYPE_FARM.dfl) {
        return -1
      }
      return 0
    })

    const vaultDFL = sortVaultDFLToTop.filter((vault) => vault.typeFarm === TYPE_FARM.dfl)

    const sortVaultApy = sortVaultDFLToTop
      .filter((vault) => vault.typeFarm !== TYPE_FARM.dfl)
      .sort((vaultA, vaultB) => {
        return vaultB.apy.yearlyApy - vaultA.apy.yearlyApy
      })

    return [...vaultDFL, ...sortVaultApy]
  }, [vaultsActive, vaultsV2Active])

  const vaultsLpToken = useMemo(() => {
    const vaultLp = vaultsActive.filter((vault) => vault.token1)
    const vaultDFL = vaultLp.filter((vault) => vault.typeFarm === TYPE_FARM.dfl)

    const sortVaultApy = vaultLp
      .filter((vault) => vault.typeFarm !== TYPE_FARM.dfl)
      .sort((vaultA, vaultB) => {
        return vaultB.apy.yearlyApy - vaultA.apy.yearlyApy
      })

    return [...vaultDFL, ...sortVaultApy]
  }, [vaultsActive])

  const tvlAllVaults = useMemo(() => {
    const totalTvlVaultV1 = vaultsFormat.reduce((sum, vault) => {
      return (sum += vault.stakedTvl)
    }, 0)

    const totalTvlVaultV2 = vaultsV2Format.reduce((sum, vault) => {
      return (sum += vault.stakedTvl)
    }, 0)

    return totalTvlVaultV1 + totalTvlVaultV2
  }, [vaultsFormat, vaultsV2Format])

  const vaultsDisplay = useMemo(() => {
    if (isStakedOnly)
      return vaultsLpToken.filter((vault) => {
        const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
        const usdHoldings = priceStakingToken
          ? new BigNumber(getFullDisplayBalance(vault.userData.stakedBalance, vault.decimals))
              .times(priceStakingToken)
              .toNumber()
          : 0

        return usdHoldings && new BigNumber(usdHoldings).isGreaterThan(0.01)
      })
    return vaultsLpToken
  }, [isStakedOnly, vaultsLpToken, prices])

  const vaultsV2Display = useMemo(() => {
    if (isStakedOnly)
      return vaultsSingleToken.filter((vault) => {
        const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
        const usdHoldings = priceStakingToken
          ? new BigNumber(getFullDisplayBalance(vault.userData.stakedBalance, vault.decimals))
              .times(priceStakingToken)
              .toNumber()
          : 0

        return usdHoldings && new BigNumber(usdHoldings).isGreaterThan(0.01)
      })
    return vaultsSingleToken
  }, [isStakedOnly, vaultsSingleToken, prices])

  const filterDataV2BySearch = useMemo(() => {
    return vaultsV2Display.filter((vault) => {
      const nameDisplay = getTokenName(vault?.token1?.symbol ? 'KLP' : '', vault?.token0?.symbol, vault?.token1?.symbol)
      return nameDisplay.toLowerCase().includes(debouncedQuery.toLowerCase())
    })
  }, [debouncedQuery, vaultsV2Display])

  const filterDataBySearch = useMemo(() => {
    return vaultsDisplay.filter((vault) => {
      const nameDisplay = getTokenName(vault?.token1?.symbol ? 'KLP' : '', vault?.token0?.symbol, vault?.token1?.symbol)
      return nameDisplay.toLowerCase().includes(debouncedQuery.toLowerCase())
    })
  }, [debouncedQuery, vaultsDisplay])

  const vaultsV2Sort = useMemo(() => {
    if (sortBy === sortTypeVault.hot) return filterDataV2BySearch
    return filterDataV2BySearch.sort((vaultA, vaultB) => {
      if (sortBy === sortTypeVault.apy) {
        return vaultB.apy.yearlyApy - vaultA.apy.yearlyApy
      }
      if (sortBy === sortTypeVault.tvl) {
        return vaultB.stakedTvl - vaultA.stakedTvl
      }
      if (sortBy === sortTypeVault.available) {
        return vaultB.userData.stakingTokenBalance.minus(vaultA.userData.stakingTokenBalance).toNumber()
      }
      if (sortBy === sortTypeVault.holdings) {
        const priceStakingTokenA = getParameterCaseInsensitive(prices, vaultA.lpTokenAddress)
        const priceStakingTokenB = getParameterCaseInsensitive(prices, vaultB.lpTokenAddress)
        const usdHoldingsA = priceStakingTokenA
          ? new BigNumber(getFullDisplayBalance(vaultA.userData.stakedBalance, vaultA.decimals))
              .times(priceStakingTokenA)
              .toNumber()
          : 0
        const usdHoldingsB = priceStakingTokenB
          ? new BigNumber(getFullDisplayBalance(vaultB.userData.stakedBalance, vaultB.decimals))
              .times(priceStakingTokenB)
              .toNumber()
          : 0

        return usdHoldingsB - usdHoldingsA
      }
    })
  }, [filterDataV2BySearch, prices, sortBy])

  const vaultsSort = useMemo(() => {
    if (sortBy === sortTypeVault.hot) return filterDataBySearch
    return filterDataBySearch.sort((vaultA, vaultB) => {
      if (sortBy === sortTypeVault.apy) {
        return vaultB.apy.yearlyApy - vaultA.apy.yearlyApy
      }
      if (sortBy === sortTypeVault.tvl) {
        return vaultB.stakedTvl - vaultA.stakedTvl
      }
      if (sortBy === sortTypeVault.available) {
        return vaultB.userData.stakingTokenBalance.minus(vaultA.userData.stakingTokenBalance).toNumber()
      }
      if (sortBy === sortTypeVault.holdings) {
        const priceStakingTokenA = getParameterCaseInsensitive(prices, vaultA.lpTokenAddress)
        const priceStakingTokenB = getParameterCaseInsensitive(prices, vaultB.lpTokenAddress)
        const usdHoldingsA = priceStakingTokenA
          ? new BigNumber(getFullDisplayBalance(vaultA.userData.stakedBalance, vaultA.decimals))
              .times(priceStakingTokenA)
              .toNumber()
          : 0
        const usdHoldingsB = priceStakingTokenB
          ? new BigNumber(getFullDisplayBalance(vaultB.userData.stakedBalance, vaultB.decimals))
              .times(priceStakingTokenB)
              .toNumber()
          : 0

        return usdHoldingsB - usdHoldingsA
      }
    })
  }, [filterDataBySearch, prices, sortBy])

  const handleChangeTab = (value) => {
    if (value !== tab) {
      setTab(value)
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 'asset',
        Header: 'Asset',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <AssetsCell row={row} />,
      },
      {
        id: 'strategy',
        Header: () => (
          <a
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
            href="https://docs.defily.io/financial/dungeons/the-dungeons"
            target="_blank"
          >
            Strategy <HelpCircle className="ml-1" size={14} />
          </a>
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <a
            onClick={(e) => e.stopPropagation()}
            href="https://docs.defily.io/financial/dungeons/the-dungeons"
            target="_blank"
          >
            {row.original.token1 ? TYPE_STRATEGY.stratX2 : TYPE_STRATEGY.strat100Back}
          </a>
        ),
      },
      {
        id: 'fees',
        Header: 'Fees',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <FeesCell vault={row.original} index={row.index} />,
      },
      {
        id: 'stakedBalance',
        Header: () => (
          <Tooltip
            className="flex items-center"
            classNameToolTip="w-80"
            tooltip="Your vault holdings are shown below. This is denominated in the underlying token and includes your initial deposit and earnings"
          >
            Holdings <HelpCircle className="ml-1" size={14} />
          </Tooltip>
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <HoldingsCell vault={row.original} />,
      },
      {
        id: 'apy',
        Header: 'Net APY',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <ApyCell vault={row.original} />,
      },
      {
        id: 'tvl',
        Header: () => (
          <Tooltip
            className="flex items-center"
            classNameToolTip="w-80"
            tooltip="Total assets held in the vault and strategy"
          >
            Vault Assets <HelpCircle className="ml-1" size={14} />
          </Tooltip>
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <VaultAssetsCell vault={row.original} />,
      },
      // {
      //   id: 'stakingTokenBalance',
      //   Header: 'Available to deposit',
      //   // eslint-disable-next-line react/prop-types
      //   Cell: ({ row }) => <AvailableDepositCell vault={row.original} />,
      // },
      {
        id: 'farm',
        Header: 'Farm',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <DoubleLogo size={40} src0={`/tokens/${row.original.typeFarm}.png`} alt0={row.original.typeFarm} />
        ),
      },
      {
        id: 'expander',
        Header: '',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <ToggleShowCell row={row} />,
      },
    ],
    [],
  )

  const columnsV2 = useMemo(
    () => [
      {
        id: 'asset',
        Header: 'Asset',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <AssetsCell row={row} />,
      },
      {
        id: 'strategy',
        Header: () => (
          <a
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
            href="https://docs.defily.io/financial/dungeons/the-dungeons"
            target="_blank"
          >
            Strategy <HelpCircle className="ml-1" size={14} />
          </a>
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <a
            onClick={(e) => e.stopPropagation()}
            href="https://docs.defily.io/financial/dungeons/the-dungeons"
            target="_blank"
          >
            {row.original.typeStrategy ?? TYPE_STRATEGY.strat100Back}
          </a>
        ),
      },
      {
        id: 'fees',
        Header: 'Fees',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => {
          return <FeesCell vault={row.original} index={row.index} />
        },
      },
      {
        id: 'stakedBalance',
        Header: () => (
          <Tooltip
            className="flex items-center"
            classNameToolTip="w-80"
            tooltip="Your vault holdings are shown below. This is denominated in the underlying token and includes your initial deposit and earnings"
          >
            Holdings <HelpCircle className="ml-1" size={14} />
          </Tooltip>
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) =>
          row.original?.contractVaultStakedAddress ? (
            <HoldingsV2Cell vault={row.original} />
          ) : (
            <HoldingsCell vault={row.original} />
          ),
      },
      {
        id: 'apy',
        Header: 'Net APY',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <ApyCell vault={row.original} />,
      },
      {
        id: 'tvl',
        Header: () => (
          <Tooltip
            className="flex items-center"
            classNameToolTip="w-80"
            tooltip="Total assets held in the vault and strategy"
          >
            Vault Assets <HelpCircle className="ml-1" size={14} />
          </Tooltip>
        ),
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <VaultAssetsCell vault={row.original} />,
      },
      // {
      //   id: 'stakingTokenBalance',
      //   Header: 'Available to deposit',
      //   // eslint-disable-next-line react/prop-types
      //   Cell: ({ row }) => <AvailableDepositCell vault={row.original} />,
      // },
      {
        id: 'farm',
        Header: 'Farm',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <DoubleLogo size={40} src0={`/tokens/${row.original.typeFarm}.png`} alt0={row.original.typeFarm} />
        ),
      },
      {
        id: 'expander',
        Header: '',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <ToggleShowCell row={row} />,
      },
    ],
    [],
  )

  const handleResizeFirstColumn = () => {
    const firstHeaderCells = document.getElementsByClassName('header-cell-table-0')
    if (firstHeaderCells?.length >= 2 && window?.innerWidth >= 500) {
      if (firstHeaderCells[0].offsetWidth > firstHeaderCells[1].offsetWidth) {
        firstHeaderCells[1].style.width = firstHeaderCells[0].offsetWidth + 'px'
      } else {
        firstHeaderCells[0].style.width = firstHeaderCells[1].offsetWidth + 'px'
      }
    }
  }

  useEffect(() => {
    handleResizeFirstColumn()
    window.addEventListener('resize', handleResizeFirstColumn)
    return () => {
      window.removeEventListener('resize', handleResizeFirstColumn)
    }
  }, [])

  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-vaults.png)">
        <HeaderDetail title="Dragon Dungeons - Smart Vaults">
          <p className="text-white text-xl">Total DFL bought back and burned by Vaults</p>
          <Value
            className="text-white text-xl"
            value={burnedDeadBalance}
            decimals={6}
            unit={<span className="ml-1">DFL</span>}
          />
        </HeaderDetail>
      </Banner>
      <div className="container max-w-screen-xl mx-auto mb-20 md:mb-72 pb-0">
        <div className="flex justify-end text-white mb-2 text-xl px-3 lg:px-0">
          TVL in Vaults:
          {tvlAllVaults ? (
            <Value className="font-bold ml-2" value={tvlAllVaults} prefix="$" decimals={0} />
          ) : (
            <p className="text-white ml-2">...</p>
          )}
        </div>
        <ActionTool
          labelStaked="Hide small balances"
          isStakedOnly={isStakedOnly}
          setIsStakedOnly={() => setStakedOnly('vaults')}
          sortList={sortListVault}
          sortBy={sortBy}
          setSearch={setSearch}
          setSortBy={setSortBy}
        />
        <TabsFinished tab={tab} onChangeTab={handleChangeTab} />
        <div className="relative z-20">
          <TabContent className="mt-4" activeTab={tab}>
            <TabPane tabId={TABS.live}>
              {vaultsV2Sort.length > 0 && (
                <Table columns={columnsV2} data={vaultsV2Sort} userDataLoaded={userDataLoadedV2} />
              )}
              {(vaultsSort.length > 0 || !vaultsV2Sort.length) && (
                <Table columns={columns} data={vaultsSort} userDataLoaded={userDataLoaded} />
              )}
            </TabPane>
            <TabPane tabId={TABS.finished}>
              <p className="mb-2 text-rose-700 text-xl">
                These vaults are no longer distributing rewards. Please Withdraw your tokens.
              </p>
              {vaultsV2Sort.length > 0 && (
                <Table columns={columnsV2} data={vaultsV2Sort} userDataLoaded={userDataLoadedV2} />
              )}
              {(vaultsSort.length > 0 || !vaultsV2Sort.length) && (
                <Table columns={columns} data={vaultsSort} userDataLoaded={userDataLoaded} />
              )}
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  )
}

export default Vaults
