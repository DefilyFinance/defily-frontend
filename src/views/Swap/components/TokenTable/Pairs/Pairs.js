import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Fragment, useEffect, useMemo } from 'react'
import { useTable } from 'react-table'
import { formatNumber } from 'utils/formatBalance'
import PairCell from 'views/Swap/components/TokenTable/Pairs/Cell/PairCell'

const Pairs = ({ token }) => {
  const { pairs } = token

  const columns = useMemo(
    () => [
      {
        id: 'id',
        Header: '',
      },
      {
        id: 'pair',
        Header: 'Pair',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => <PairCell pair={row.original} />,
      },
      {
        id: 'price',
        Header: '',
      },
      {
        id: 'priceKai',
        Header: '',
      },
      {
        id: 'tvl',
        Header: 'Tvl',
        accessor: 'liquidity',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) =>
          row.original.liquidity < 0.000001 ? '< 0,001' : `$${formatNumber(+row.original.liquidity, 0, 0)}`,
      },
      {
        id: 'end',
        Header: '',
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable({
    columns,
    data: Object.values(pairs),
  })

  const handleResizeFirstColumn = () => {
    ;[0, 1, 2, 3].forEach((item) => {
      const cells = document.getElementsByClassName(`header-cell-table-${item}`)
      if (cells?.length >= 2 && window?.innerWidth >= 500) {
        cells[1].style.width = cells[0].offsetWidth + 'px'
      } else {
        cells[0].style.width = cells[1].offsetWidth + 'px'
      }
    })
    const secondHeaderCells = document.getElementsByClassName('header-cell-table-1')
    if (secondHeaderCells?.length >= 2 && window?.innerWidth >= 500) {
      if (secondHeaderCells[0].offsetWidth > secondHeaderCells[1].offsetWidth) {
        secondHeaderCells[0].style.width = secondHeaderCells[1].offsetWidth + 'px'
      } else {
        secondHeaderCells[1].style.width = secondHeaderCells[0].offsetWidth + 'px'
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
                    column.id === 'price' && 'hidden lg:table-cell',
                    column.id === 'end' && 'hidden lg:table-cell',
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
                <tr className="bg-blue1" {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        className={classnames(
                          'px-4 py-1 sm:px-6 sm:py-4 sm:text-md text-white whitespace-nowrap',
                          cell.column.id === 'priceKai' && 'hidden lg:table-cell',
                          cell.column.id === 'id' && 'hidden lg:table-cell',
                          cell.column.id === 'price' && 'hidden lg:table-cell',
                          cell.column.id === 'end' && 'hidden lg:table-cell',
                          index === 0 && 'rounded-l-md',
                          `header-cell-table-${index}`,
                          index === row.cells.length - 1 && 'rounded-r-md',
                        )}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              </Fragment>
            )
          })
        ) : (
          <tr className="text-white text-center">
            <td className="py-2" colSpan={visibleColumns.length}>
              <p className="text-white text-center">No Data</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

Pairs.propTypes = {
  token: PropTypes.object.isRequired,
}

export default Pairs
