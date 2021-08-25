import Button from 'components/Button/Button'
import Loader from 'components/Loader/Loader'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import useKardiachain from 'hooks/useKardiachain'
import { AlertCircle, ArrowUpCircle } from 'react-feather'
import { getKardiachainLink } from 'utils/getUrl'

function ConfirmationPendingContent({ pendingText }) {
  return (
    <div className="text-center">
      <div>
        <Loader className="border-t-4 h-20 w-20 mx-auto" />
      </div>
      <div className="mt-4">
        <p className="text-lg">Waiting For Confirmation</p>
        <div>
          <p className="font-bold">{pendingText}</p>
        </div>
        <p>Confirm this transaction in your wallet</p>
      </div>
    </div>
  )
}

function TransactionSubmittedContent({ onDismiss, hash }) {
  return (
    <div>
      <div>
        <div>
          <ArrowUpCircle className="mx-auto text-green-600" size={90} />
        </div>
        <div className="text-center">
          <p>Transaction Submitted</p>
          {hash && (
            <a className="text-primary" target="_blank" href={getKardiachainLink(hash, 'transaction')}>
              View on kardiachain
            </a>
          )}
          <Button onClick={onDismiss} className="mx-auto mt-4">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ConfirmationModalContent({ bottomContent, topContent }) {
  return (
    <div>
      <div>{topContent()}</div>
      <div>{bottomContent()}</div>
    </div>
  )
}

export function TransactionErrorContent({ message, onDismiss }) {
  return (
    <div>
      <div className="text-center">
        <AlertCircle className="mx-auto text-red-500" size={64} />
        <p className="mt-4">{message}</p>
      </div>
      <Button className="mx-auto mt-4" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  )
}

const TransactionConfirmationModal = ({
  open,
  title,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useKardiachain()

  if (!chainId) return null

  return (
    <Modal open={open} onClose={onDismiss}>
      <ModalTitle onClose={onDismiss}>{title}</ModalTitle>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
