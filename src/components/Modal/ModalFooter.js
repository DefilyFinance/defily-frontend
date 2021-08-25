import React from 'react'
import PropTypes from 'prop-types'

const ModalFooter = ({ children }) => {
  return <div className="flex justify-end mt-3">{children}</div>
}

ModalFooter.propTypes = {
  children: PropTypes.node,
}

export default ModalFooter
