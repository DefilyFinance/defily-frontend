import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Fragment } from 'react'

const SkeletonTable = ({ listHeaders }) => {
  return (
    <div className="overflow-auto relative z-20">
      <table className="min-w-full">
        <thead>
          <tr>
            {listHeaders.map((item, index) => (
              <th
                key={index}
                scope="col"
                className={classnames(
                  'px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider',
                  item === 'Tvl' && 'hidden lg:table-cell',
                  item === 'Rewards' && 'hidden lg:table-cell',
                  item === 'Action' && 'hidden lg:table-cell',
                  item === 'Starts in/Ends' && 'hidden lg:table-cell',
                  item === '#' && 'hidden sm:table-cell',
                  item === 'Apr/Apy' && 'text-right sm:text-left',
                )}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((item, index) => (
            <Fragment key={index}>
              <tr className="text-white bg-blue1">
                <td className="px-6 py-4 hidden sm:table-cell">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 ">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full border-primary border-2 p-1 bg-gray-100 border-primary border-2" />
                      </div>
                    </div>
                    <div className="ml-8 cursor-pointer">
                      <div>...</div>
                      <div className="text-md">...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">...</td>
                <td className="px-6 py-4 text-right sm:text-left">...</td>
                <td className="px-6 py-4 hidden lg:table-cell">...</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="h-10 w-10 rounded-full border-primary border-2 p-1 bg-gray-100 border-primary border-2" />
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">...</td>
              </tr>
              <tr className="bg-transparent">
                <td className="py-2" colSpan={999999} />
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

SkeletonTable.propTypes = {
  listHeaders: PropTypes.array.isRequired,
}

export default SkeletonTable
