import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import { useModalWalletConnect } from 'store/modal/hooks'
import useKardiachain from 'hooks/useKardiachain'

const ModalWallet = () => {
  const { isOpen, onToggleConnectModal } = useModalWalletConnect()
  const { isKardiachainInstalled, onConnect } = useKardiachain()

  const handleConnect = () => {
    onConnect()
    onToggleConnectModal()
  }

  return (
    <Modal open={isOpen} onClose={onToggleConnectModal}>
      {isKardiachainInstalled ? (
        <>
          <ModalTitle onClose={onToggleConnectModal}>Connect to a wallet</ModalTitle>
          <div className="mt-2 flex justify-center">
            <Button onClick={handleConnect}>
              <img className="mr-2" width="30" src="/tokens/kai.png" /> Kardia Extension Wallet Connect
            </Button>
          </div>
        </>
      ) : (
        <>
          <ModalTitle onClose={onToggleConnectModal}>Install KardiaChain Wallet</ModalTitle>
          <div className="mt-2 flex justify-center">
            <p>
              Please install the{' '}
              <a
                className="text-primary underline"
                target="_blank"
                href={`https://chrome.google.com/webstore/search/kardiachain%20wallet`}
              >
                Kardia Extension Wallet
              </a>{' '}
              to access
            </p>
          </div>
        </>
      )}
    </Modal>
  )
}

export default ModalWallet
