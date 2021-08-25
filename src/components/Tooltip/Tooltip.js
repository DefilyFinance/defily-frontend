import classnames from 'classnames'
import PropTypes from 'prop-types'

const Tooltip = ({ children, tooltip, classNameToolTip, className, style }) => {
  return (
    <div style={style} className={classnames(className, 'tooltip-wrapper')}>
      {children}
      <div className={classnames('rounded-md bg-black text-white p-2 tooltip', classNameToolTip)}>{tooltip}</div>
    </div>
  )
}

Tooltip.propTypes = {
  style: PropTypes.object,
  classNameToolTip: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  tooltip: PropTypes.node,
}

export default Tooltip
