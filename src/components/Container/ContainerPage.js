import PropTypes from 'prop-types'
import classnames from 'classnames'

const ContainerPage = ({ children, className }) => {
  return (
    <div className={classnames('container mx-auto px-3 mb-60 md:mb-96 lg:mb-96 lg:pb-60', className)}>{children}</div>
  )
}

ContainerPage.propTypes = {
  children: PropTypes.node,
}

export default ContainerPage
