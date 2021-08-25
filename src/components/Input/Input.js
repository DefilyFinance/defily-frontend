import classnames from 'classnames'
import PropTypes from 'prop-types'

const Input = ({ className, ...rest }) => {
  return <input {...rest} className={classnames('w-full p-2 border-primary border-2 rounded-2xl', className)} />
}

Input.propTypes = {
  className: PropTypes.string,
}

export const InputCustom = ({ className, register, label, rules, ...rest }) => {
  return (
    <input
      {...rest}
      {...register(label, rules)}
      className={classnames('w-full p-2 border-primary border-2 rounded-2xl', className)}
    />
  )
}

InputCustom.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  rules: PropTypes.object,
  register: PropTypes.any,
}

export default Input
