import classnames from 'classnames'
import { Search } from 'react-feather'

const InputSearch = ({ className, classNameInput, ...rest }) => {
  return (
    <div className={classnames(className, 'border-primary border-2 rounded-xl p-2 flex items-center')}>
      <Search size={24} className="text-primary mr-2" />
      <input {...rest} className={classnames('bg-blue2 text-primary placeholder-blue3', classNameInput)} />
    </div>
  )
}

export default InputSearch
