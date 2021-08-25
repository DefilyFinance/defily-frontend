import { useMemo } from 'react'
import TableVaults from './TableVaults'
import AssetsCell from '../../Vaults/components/Table/Cells/AssetsCell'
import { HelpCircle } from 'react-feather'
import Tooltip from '../../../components/Tooltip/Tooltip'
import ApyCell from '../../Vaults/components/Table/Cells/ApyCell'
import VaultAssetsCell from '../../Vaults/components/Table/Cells/VaultAssetsCell'
import { useVaults } from 'store/vaults/hook'
import { usePrices } from 'store/prices/hook'
import { useFarmsNoAccount } from 'store/farms/hook'
import { useMiniFarms, useMiniFarmsNoAccount } from 'store/miniFarms/hook'
import { useGetPoolsFarms } from 'store/pools/hook'
import { formatVault, formatVaultV2 } from 'store/vaults/helpers'
import { useHistory } from 'react-router-dom'
import ButtonViewMore from './ViewMore'

const PopularVaults = () => {
  const history = useHistory()
  const { vaults, vaultsV2 } = useVaults()
  const prices = usePrices()
  const farms = useFarmsNoAccount()
  const miniFarms = useMiniFarmsNoAccount()
  const farmsOutside = useGetPoolsFarms()

  const vaultsV2Format = useMemo(
    () => vaultsV2.map((vault) => formatVaultV2(prices, farms, miniFarms, farmsOutside, vault)),
    [farms, miniFarms, farmsOutside, prices, vaultsV2],
  )

  const vaultsFormat = useMemo(
    () => vaults.map((vault) => formatVault(prices, farms, miniFarms, farmsOutside, vault)),
    [farms, miniFarms, farmsOutside, prices, vaults],
  )

  const vaultsPopular = useMemo(
    () =>
      [...vaultsFormat, ...vaultsV2Format].sort((vaultA, vaultB) => vaultB?.apr?.yearlyAPR - vaultA?.apr?.yearlyAPR),
    [vaultsFormat, vaultsV2Format],
  )

  const columns = useMemo(
    () => [
      {
        id: 'id',
        Header: '#',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => row.index + 1,
      },
      {
        id: 'asset',
        Header: 'Asset',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <AssetsCell row={row} />,
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
      {
        id: 'apy',
        Header: 'Net APY',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <ApyCell vault={row.original} />,
      },

      {
        id: 'expander',
        Header: '',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <span className="text-primary font-bold" onClick={() => history.push('/vaults')}>
            STAKE
          </span>
        ),
      },
    ],
    [],
  )
  return (
    <div className="container max-w-screen-lg-xl mx-auto mb-28 pb-2">
      <h2 className="text-center text-primary text-4xl transform -translate-y-10 font-bold">Popular Vaults</h2>

      <div>
        <TableVaults columns={columns} data={vaultsPopular.slice(0, 7)} />
        {vaultsPopular?.length > 10 ? (
          <div className="flex flex-row justify-center">
            <ButtonViewMore title="View more vaults" route={'/vaults'} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PopularVaults
