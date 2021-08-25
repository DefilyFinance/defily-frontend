import PropTypes from 'prop-types'

const Container = ({ children, contentStyle }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-blue2">
      <div style={contentStyle}>{children}</div>
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node,
}

export default Container
