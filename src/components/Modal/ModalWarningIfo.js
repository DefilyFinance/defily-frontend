import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import PropTypes from 'prop-types'

const ModalWarningIfo = ({ open, toggleModal, onSubmit }) => {
  return (
    <Modal open={open} onClose={toggleModal}>
      <ModalTitle onClose={toggleModal}>Warning</ModalTitle>
      <div className="text-center">
        <p>
          This is an IFO Pool, your staked tokens will be burned, please make sure you understand the risk of Staking
          this Pool.
        </p>
        <a
          className="text-primary hover:underline"
          href="https://defilyfinance.medium.com/what-is-initial-farm-offering-6d376a13f1fa"
          target="_blank"
        >
          Read more about IFO and Risks
        </a>
      </div>
      <Button
        className="mx-auto mt-4"
        onClick={() => {
          toggleModal()
          onSubmit()
        }}
      >
        Ok
      </Button>
    </Modal>
  )
}

ModalWarningIfo.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ModalWarningIfo
