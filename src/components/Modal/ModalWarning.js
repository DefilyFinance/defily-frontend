import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import PropTypes from 'prop-types'

const ModalWarning = ({ open, toggleModal, content }) => {
  return (
    <Modal open={open} onClose={toggleModal}>
      <ModalTitle onClose={toggleModal}>Warning</ModalTitle>
      <div className="text-center">
        <p>{content}</p>
      </div>
      <Button className="mx-auto mt-4" onClick={() => toggleModal()}>
        Close
      </Button>
    </Modal>
  )
}

ModalWarning.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  content: PropTypes.any,
}

export default ModalWarning
