import classnames from 'classnames'
import Button from 'components/Button/Button'
import Pagination from 'components/Pagination/index'
import { useHistory } from 'react-router-dom'
import { usePagination, useTable } from 'react-table'
import 'styles/invest.scss'
import PropTypes from 'prop-types'
import { Fragment } from 'react'

const PoolsTable = ({ columns, data }) => {
  const history = useHistory()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 50 },
      autoResetPage: false,
    },
    usePagination,
  )

  return (
    <>
      <div className="relative z-10">
        <table className="min-w-full" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      scope="col"
                      className={classnames(
                        'px-6 py-3 text-left font-medium text-primary uppercase tracking-wider',
                        column.Header === 'Tvl' && 'hidden lg:table-cell',
                        column.Header === 'Action' && 'hidden lg:table-cell',
                        column.Header === 'Rewards' && 'hidden lg:table-cell',
                        column.Header === 'Starts in/Ends' && 'hidden lg:table-cell',
                        column.Header === '#' && 'hidden sm:table-cell',
                        column.Header === 'Apr/Apy' && 'text-right sm:text-left',
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
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <Fragment key={i}>
                  <tr className="bg-blue1" {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          className={classnames(
                            'px-2 py-1 sm:px-6 sm:py-4 text-sm sm:text-md text-white whitespace-nowrap',
                            cell.column.Header === 'Tvl' && 'hidden lg:table-cell',
                            cell.column.Header === 'Rewards' && 'hidden lg:table-cell',
                            cell.column.Header === 'Action' && 'hidden lg:table-cell',
                            cell.column.Header === 'Starts in/Ends' && 'hidden lg:table-cell',
                            cell.column.Header === '#' && 'hidden sm:table-cell',
                            cell.column.Header === 'Apr/Apy' && 'text-right sm:text-left',
                          )}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="bg-blue1">
                    <td className="py-1 px-6 sm:py-4 table-cell lg:hidden text-sm sm:text-md" colSpan={1000}>
                      <Button
                        onClick={() => {
                          if (row.original?.link) return window.open(row.original?.link)
                          history.push(row.original.route)
                        }}
                        className="mx-auto w-full max-w-xs"
                      >
                        Stake
                      </Button>
                    </td>
                  </tr>
                  <tr className="bg-transparent	">
                    <td className="py-2" colSpan={visibleColumns.length} />
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-blue1 relative z-20 mb-20">
        <div className="d-flex align-items-center px-6 py-4">
          <span className="mr-1 text-white">
            Showing {page.length} of ~{data.length} results
          </span>
          <select
            value={pageSize}
            className="custom-select--limit-page ml-1.5 bg-gray-200"
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[50, 100, 200].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="pb-4">
          <Pagination pageCount={pageCount} onChangePage={gotoPage} currentPage={pageIndex + 1} />
        </div>
      </div>
    </>
  )
}

PoolsTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}

export default PoolsTable
