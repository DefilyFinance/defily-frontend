import classnames from 'classnames'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Logo = ({ className }) => {
  return (
    <div>
      <Link to="/" className={classnames('flex items-center', className)}>
        <img alt="logo" src="/logo.png" width="70" height="50" />
        <span className="ml-4 text-primary font-bold text-4xl hidden sm:block">Defily</span>
      </Link>
    </div>
  )
}

Logo.propTypes = {
  className: PropTypes.string,
}

export default Logo
