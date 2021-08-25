import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

const ModalRequireDragon = ({ open, toggleModal }) => {
  const history = useHistory()

  return (
    <Modal open={open} onClose={toggleModal}>
      <ModalTitle onClose={toggleModal}>DRAGON required</ModalTitle>
      <div className="text-left">
        <p className="text-primary font-bold">Insufficient DRAGON balance</p>
        <p>You’ll need DRAGON to fight the battle!</p>
        <p>Buy some DRAGON, or make sure your DRAGON isn’t in another pool.</p>
        <Button className="mx-auto" onClick={() => history.push('/dragon')}>
          Get DRAGON
        </Button>
      </div>
    </Modal>
  )
}

ModalRequireDragon.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default ModalRequireDragon
