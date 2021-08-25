import PropTypes from 'prop-types'
import classnames from 'classnames'

const Loader = ({ className, color = 'primary', width, height }) => {
  return (
    <svg
      className={classnames(
        'animate-spin border-t-2 h-4 w-4 rounded-50',
        color && `border-${color}`,
        width && `w-${width}`,
        height && `w-${height}`,
        className,
      )}
      viewBox="0 0 24 24"
    />
  )
}

Loader.propTypes = {
  className: PropTypes.any,
  color: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
}

export default Loader
