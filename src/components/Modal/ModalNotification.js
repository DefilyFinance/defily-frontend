import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import { useState } from 'react'

const link = 'https://forms.gle/feHfXpxW6UnGxkQV9'

// please update new index when change another noti

const ModalNotification = () => {
  const [open, setOpen] = useState(!window.localStorage.getItem('noti4') ?? true)

  const toggleModal = () => {
    window.localStorage.setItem('noti4', false)
    setOpen(!open)
  }

  return (
    <Modal size="lg" open={open} onClose={toggleModal}>
      <ModalTitle onClose={toggleModal} />
      <img src="/images/noti.png" className="w-full cursor-pointer pt-2" onClick={() => window.open(link, '_blank')} />
    </Modal>
  )
}

export default ModalNotification
