import classnames from 'classnames'

const Logo = ({ src, alt, size = 20, className, ...rest }) => {
  return (
    <img
      className={classnames(className, 'rounded-50 bg-white object-contain shadow-2xl p-1')}
      style={{
        width: size,
        height: size,
      }}
      {...rest}
      alt={alt}
      src={src}
    />
  )
}

export default Logo
