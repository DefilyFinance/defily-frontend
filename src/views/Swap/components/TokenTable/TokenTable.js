import classnames from 'classnames'
import Loader from 'components/Loader/Loader'
import useTokens from 'hooks/useTokens'
import { Fragment, useCallback, useMemo } from 'react'
import { useExpanded, useTable, useSortBy } from 'react-table'
import { formatNumber } from 'utils/formatBalance'
import TokenCell from 'views/Swap/components/TokenTable/Cell/TokenCell'
import Pairs from 'views/Swap/components/TokenTable/Pairs/Pairs'
import ToggleShowCell from 'views/Vaults/components/Table/Cells/ToggleShowCell'
import { ChevronDown, ChevronUp } from 'react-feather'

const TokenTable = () => {
  const tokens = useTokens()

  const columns = useMemo(
    () => [
      {
        id: 'id',
        Header: '',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => row.index + 1,
      },
      {
        id: 'token',
        Header: 'Token',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <TokenCell token={row.original} />,
      },
      {
        id: 'price',
        Header: 'Price',
        accessor: 'price',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) =>
          row.original.price < 0.000001 ? '$ < 0,000001' : `$${formatNumber(row.original.price, 2, 6)}`,
      },
      {
        id: 'priceKai',
        Header: 'Price Kai',
        accessor: 'price_KAI',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) =>
          row.original.price_KAI < 0.000001 ? '$ < 0,000001' : formatNumber(row.original.price_KAI, 2, 6),
      },
      {
        id: 'tvl',
        Header: 'Tvl',
        accessor: 'tvl',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (row.original.tvl < 0.000001 ? '$ < 0,000001' : `$${formatNumber(row.original.tvl, 0, 0)}`),
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    {
      columns,
      data: tokens,
      autoResetExpanded: false,
    },
    useSortBy,
    useExpanded,
  )

  const renderRowSubComponent = useCallback(({ row }) => <Pairs token={row.original} />, [])

  return (
    <div>
      <table className="min-w-full" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <th
                    scope="col"
                    className={classnames(
                      'px-6 py-3 text-left font-medium text-primary tracking-wider',
                      column.id === 'priceKai' && 'hidden lg:table-cell',
                      column.id === 'id' && 'hidden lg:table-cell',
                      column.id === 'tvl' && 'hidden sm:table-cell',
                      `header-cell-table-${index}`,
                    )}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDown className="inline-block" size={18} />
                        ) : (
                          <ChevronUp className="inline-block" size={18} />
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row, i) => {
              prepareRow(row)
              return (
                <Fragment key={i}>
                  <tr className="bg-blue1" {...row.getRowProps()} {...row.getToggleRowExpandedProps()}>
                    {row.cells.map((cell, index) => {
                      return (
                        <td
                          className={classnames(
                            'px-4 py-1 sm:px-6 sm:py-4 sm:text-md text-white whitespace-nowrap',
                            cell.column.id === 'priceKai' && 'hidden lg:table-cell',
                            cell.column.id === 'id' && 'hidden lg:table-cell',
                            cell.column.id === 'tvl' && 'hidden sm:table-cell',
                            index === 0 && 'rounded-l-md',
                            index === row.cells.length - 1 && 'rounded-r-md',
                          )}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                  {row.isExpanded ? (
                    <tr className="bg-blue1">
                      <td colSpan={visibleColumns.length}>{renderRowSubComponent({ row })}</td>
                    </tr>
                  ) : null}
                  <tr className="bg-transparent	">
                    <td className="py-2" colSpan={visibleColumns.length} />
                  </tr>
                </Fragment>
              )
            })
          ) : (
            <tr className="text-white text-center">
              <td className="py-2" colSpan={visibleColumns.length}>
                <Loader className="border-t-4 mt-2 h-10 w-10 mx-auto" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TokenTable
