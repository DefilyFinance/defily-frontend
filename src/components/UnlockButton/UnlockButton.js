import classnames from 'classnames'
import Button from 'components/Button/Button'
import { useModalWalletConnect } from 'store/modal/hooks'

const UnlockButton = ({ className }) => {
  const { onToggleConnectModal } = useModalWalletConnect()

  return (
    <Button className={classnames(className, 'w-full')} onClick={onToggleConnectModal}>
      Connect wallet
    </Button>
  )
}

export default UnlockButton
