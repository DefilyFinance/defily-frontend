import classNames from 'classnames'
import Dropdown from 'components/Dropdown/Dropdown'
import InputSearch from 'components/Input/InputSearch'
import Switch from 'components/Switch/Switch'
import PropTypes from 'prop-types'
import { ChevronDown } from 'react-feather'

const ActionTool = ({
  className,
  setSearch,
  setIsStakedOnly,
  isStakedOnly,
  sortList,
  sortBy,
  setSortBy,
  labelStaked = 'Staked Only',
  hideStakedOnly = false,
}) => {
  return (
    <div className={classNames('relative z-30 mb-5 sm:mb-10 mx-3 sm:mx-5', className)}>
      <div className="block flex-wrap items-center sm:flex">
        <div className="flex items-center flex-1 sm:max-w-3xl">
          <InputSearch
            className="flex-1"
            placeholder="Search..."
            classNameInput="w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-primary border-primary border-2 rounded-xl p-2 mx-2 my-2 md:mx-10">
            <span className="mx-4">
              Sort by <ChevronDown className="ml-1 inline-block" size={20} /> <span className="ml-3">|</span>
            </span>
            <Dropdown
              isArrow={false}
              menu={<span>{sortList.find((sort) => sort.name === sortBy).label}</span>}
              bsPrefixMenu="p-0 mr-4"
              classNameMenuItem="bg-primary text-black"
            >
              {sortList.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 block cursor-pointer"
                  onClick={() => setSortBy(item.name)}
                >
                  <span className="w-full h-full">{item.label}</span>
                </div>
              ))}
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-start">
          {!hideStakedOnly && (
            <Switch
              className="my-2"
              onChange={() => setIsStakedOnly((prevState) => !prevState)}
              checked={isStakedOnly}
              label={labelStaked}
              classNameLabel="text-white"
            />
          )}
        </div>
      </div>
    </div>
  )
}

ActionTool.propTypes = {
  className: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  setIsStakedOnly: PropTypes.func.isRequired,
  isStakedOnly: PropTypes.bool.isRequired,
  sortList: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  labelStaked: PropTypes.string,
  hideStakedOnly: PropTypes.bool,
}

export default ActionTool
