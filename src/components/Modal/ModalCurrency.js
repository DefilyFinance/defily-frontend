import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError } from 'components/CustomToast/CustomToast'
import ModalFooter from 'components/Modal/ModalFooter'
import TokenInput from 'components/TokenInput/TokenInput'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import { formatNumber, getFullDisplayBalance } from 'utils/formatBalance'

const ModalCurrency = ({ open, onDismiss, lpTokenName, max, onConfirm, title, priceCurrency, decimals = 18 }) => {
  const [value, setValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const usdValue = value && formatNumber(new BigNumber(value).times(priceCurrency).toNumber())

  const isInsufficientBalance = useMemo(() => {
    return new BigNumber(value).isGreaterThan(getFullDisplayBalance(max, decimals))
  }, [value, max, decimals])

  const handleTypeInput = (valueInput) => {
    setValue(valueInput)
  }

  const handleConfirm = useCallback(async () => {
    try {
      setPendingTx(true)
      await onConfirm(value)
      setPendingTx(false)
      onDismiss()
    } catch (e) {
      console.log(e)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingTx(false)
    }
  }, [onConfirm, onDismiss, value])

  const handleMaxInput = useCallback(() => {
    setValue(getFullDisplayBalance(max, decimals))
  }, [decimals, max])

  useEffect(() => {
    if (open) {
      setValue('')
    }
  }, [open])

  return (
    <Modal open={open} onClose={onDismiss}>
      <ModalTitle onClose={onDismiss}>{title}</ModalTitle>
      <div>
        <TokenInput
          currencyValue={priceCurrency && priceCurrency !== 0 && `~${usdValue || 0} USD`}
          max={max}
          onMax={handleMaxInput}
          symbol={lpTokenName}
          value={value}
          onUserInput={handleTypeInput}
          decimals={decimals}
        />
      </div>
      <ModalFooter>
        <Button disabled={pendingTx} color="secondary" className="mr-2" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          disabled={pendingTx || !new BigNumber(value).isGreaterThan(0) || isInsufficientBalance}
          isLoading={pendingTx}
          onClick={handleConfirm}
        >
          {isInsufficientBalance
            ? `Insufficient ${lpTokenName} balance`
            : pendingTx
            ? 'Pending Confirmation'
            : 'Confirm'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ModalCurrency.propTypes = {
  open: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  lpTokenName: PropTypes.string.isRequired,
  max: PropTypes.any,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  priceCurrency: PropTypes.number,
  decimals: PropTypes.number,
}

export default ModalCurrency
