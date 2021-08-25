import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import { useCallback } from 'react'

import PairSearch from 'components/SearchPairModal/PairSearch'

export default function PairSearchModal({
  pairs,
  onDismiss = () => null,
  onPairSelect,
  selectedPair,
  otherSelectedPair,
  open,
}) {
  const handlePairSelect = useCallback(
    (pair) => {
      onDismiss()
      onPairSelect(pair)
    },
    [onDismiss, onPairSelect],
  )

  return (
    <Modal open={open} onClose={onDismiss} className="w-full sm:w-unset">
      <ModalTitle onClose={onDismiss}>Select a pair</ModalTitle>
      <div>
        <PairSearch
          pairs={pairs}
          onPairSelect={handlePairSelect}
          selectedPair={selectedPair}
          otherSelectedPair={otherSelectedPair}
        />
      </div>
    </Modal>
  )
}
