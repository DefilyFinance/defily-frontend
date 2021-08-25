import classnames from 'classnames'
import PropTypes from 'prop-types'

const Tag = ({ children, className }) => {
  return (
    <div className={classnames(className, 'absolute left-3 top-3 bg-primary py-1 p-4 flex items-center rounded-2xl')}>
      <span className="capitalize text-sm font-bold">{children}</span>
    </div>
  )
}

Tag.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Tag
