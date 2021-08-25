import classnames from 'classnames'
import { FIELD } from 'constants/miniFarms'

const TabsMiniFarms = ({ onChangeTab, tab }) => {
  return (
    <div className="flex justify-center mx-auto text-white bg-blue1 max-w-min	rounded-3xl py-1 px-2 mb-4">
      <div
        className={classnames(
          'px-4 py-2 whitespace-nowrap',
          tab === FIELD.CHAT ? 'text-black bg-primary rounded-2xl' : 'cursor-pointer',
        )}
        onClick={() => onChangeTab(FIELD.CHAT)}
      >
        CHAT
      </div>
      <div
        className={classnames(
          'px-4 py-2 whitespace-nowrap',
          tab === FIELD.LTD ? 'text-black bg-primary rounded-2xl' : 'cursor-pointer',
        )}
        onClick={() => onChangeTab(FIELD.LTD)}
      >
        Live Trade
      </div>
    </div>
  )
}

export default TabsMiniFarms
