import classnames from 'classnames'
import { TABS } from 'constants/index'

const TabsFinished = ({ onChangeTab, tab }) => {
  return (
    <div className="flex justify-center mx-auto text-white bg-blue1 max-w-min	rounded-3xl py-1 px-2">
      <div
        className={classnames(
          'px-4 py-2 whitespace-nowrap',
          tab === TABS.live ? 'text-black bg-primary rounded-2xl' : 'cursor-pointer',
        )}
        onClick={() => onChangeTab(TABS.live)}
      >
        Live
      </div>
      <div
        className={classnames(
          'px-4 py-2 whitespace-nowrap',
          tab === TABS.finished ? 'text-black bg-primary rounded-2xl' : 'cursor-pointer',
        )}
        onClick={() => onChangeTab(TABS.finished)}
      >
        Finished
      </div>
    </div>
  )
}

export default TabsFinished
