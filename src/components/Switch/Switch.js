import classnames from 'classnames'
import PropTypes from 'prop-types'

const Switch = ({ label, checked, onChange, classNameLabel, className, id = 'idDefault' }) => {
  return (
    <div className={classnames('flex items-center justify-center', className)}>
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input checked={checked} value={checked} onChange={onChange} type="checkbox" id={id} className="sr-only" />
          <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
        </div>
        <div className={classnames(classNameLabel, 'ml-3 font-medium')}>{label}</div>
      </label>
    </div>
  )
}

Switch.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  classNameLabel: PropTypes.string,
  className: PropTypes.string,
}

export default Switch
