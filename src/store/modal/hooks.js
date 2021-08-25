import { useDispatch, useSelector } from 'react-redux'
import { toggleWalletConnect } from 'store/modal/index'

export const useModalWalletConnect = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector((store) => store.modal.walletConnect)

  const toggleModal = () => {
    dispatch(toggleWalletConnect())
  }

  return { isOpen, onToggleConnectModal: toggleModal }
}
