import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Fragment, useCallback } from 'react'
import { useTable, useExpanded } from 'react-table'
import ActionPanel from 'views/Vaults/components/Table/ActionPanel/ActionPanel'
import ActionPanelV2 from 'views/Vaults/components/Table/ActionPanel/ActionPanelV2'

const Table = ({ columns, data, userDataLoaded }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    {
      columns,
      data: data,
      autoResetExpanded: false,
    },
    useExpanded,
  )

  const renderRowSubComponent = useCallback(
    ({ row }) =>
      row.original?.contractVaultStakedAddress ? (
        <ActionPanelV2 vault={row.original} userDataLoaded={userDataLoaded} />
      ) : (
        <ActionPanel vault={row.original} userDataLoaded={userDataLoaded} />
      ),
    [userDataLoaded],
  )

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
                      column.id === 'tvl' && 'hidden lg:table-cell',
                      column.id === 'fees' && 'hidden lg:table-cell',
                      column.id === 'stakedBalance' && 'hidden lg:table-cell',
                      column.id === 'farm' && 'hidden lg:table-cell',
                      column.id === 'strategy' && 'hidden lg:table-cell',
                      `header-cell-table-${index}`,
                    )}
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
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
                            cell.column.id === 'tvl' && 'hidden lg:table-cell',
                            cell.column.id === 'fees' && 'hidden lg:table-cell',
                            cell.column.id === 'stakedBalance' && 'hidden lg:table-cell',
                            cell.column.id === 'farm' && 'hidden lg:table-cell',
                            cell.column.id === 'strategy' && 'hidden lg:table-cell',
                            cell.column.id === 'expander' && 'text-right',
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
              <td className="py-2" colSpan={99999}>
                <p className="text-white text-center">No Data</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  userDataLoaded: PropTypes.bool.isRequired,
}

export default Table
