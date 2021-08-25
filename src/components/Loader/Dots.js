import classnames from 'classnames'
import 'styles/dots.scss'

const Dots = ({ children, className }) => {
  return <p className={classnames('dots', className)}>{children}</p>
}

export default Dots
