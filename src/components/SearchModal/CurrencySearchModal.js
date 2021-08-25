import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import { useCallback } from 'react'

import CurrencySearch from 'components/SearchModal/CurrencySearch'

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
  open,
  listHideTokens,
}) {
  const handleCurrencySelect = useCallback(
    (currency) => {
      onDismiss()
      onCurrencySelect(currency)
    },
    [onDismiss, onCurrencySelect],
  )

  return (
    <Modal open={open} onClose={onDismiss} className="w-full sm:w-unset">
      <ModalTitle onClose={onDismiss}>Select a Token</ModalTitle>
      <div>
        <CurrencySearch
          listHideTokens={listHideTokens}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
        />
      </div>
    </Modal>
  )
}
