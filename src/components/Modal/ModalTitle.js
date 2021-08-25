import React from 'react'
import { Dialog } from '@headlessui/react'
import PropTypes from 'prop-types'
import { X } from 'react-feather'

const ModalTitle = ({ children, onClose }) => {
  return (
    <Dialog.Title as="h3" className="text-lg text-left leading-6 font-medium text-gray-900 mb-3">
      {children}
      <button className="float-right" onClick={onClose}>
        <X size={20} />
      </button>
    </Dialog.Title>
  )
}

ModalTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
}

export default ModalTitle
