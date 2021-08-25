import PropTypes from 'prop-types'
import classNames from 'classnames'
import Loader from 'components/Loader/Loader'

const Button = ({
  children,
  onClick,
  color = 'primary',
  outline = false,
  className,
  disabled,
  isLoading,
  size = 'md',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={classNames(
        'flex items-center rounded-xl justify-center whitespace-nowrap',
        size === 'md' && 'py-2 px-5',
        size === 'sm' && 'p-2 h-10',
        color === 'primary' && 'bg-primary hover:opacity-80',
        color === 'secondary' && 'bg-white1 text-white hover:opacity-80',
        color === 'blue' && 'bg-blue1 text-white hover:opacity-80',
        color === 'danger' && 'bg-red-600 text-white hover:opacity-80',
        outline && 'text-primary bg-blue1',
        disabled && 'opacity-50 cursor-default !hover:opacity-80',
        className,
      )}
      onClick={onClick}
    >
      {children} {isLoading && <Loader className="ml-2" size="sm" color="white" />}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  color: PropTypes.string,
  outline: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
}

export default Button
