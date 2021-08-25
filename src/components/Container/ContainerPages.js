import PropTypes from 'prop-types'

const ContainerPages = ({ children }) => {
  return <div className="px-6 mb-60 md:mb-96 lg:mb-96 lg:pb-60">{children}</div>
}

ContainerPages.propTypes = {
  children: PropTypes.node,
}

export default ContainerPages
