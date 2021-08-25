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
import useKardiachain from '../../hooks/useKardiachain'
import { formatDDMMMHHmm } from 'utils/formatDateTime'

const ModalStakeIDO = ({
  open,
  onDismiss,
  lpTokenName,
  max,
  onConfirm,
  onApprove,
  fixedValue,
  minInvest,
  maxInvest,
  description,
  textNotEnoughBalance,
  disabled,
  title,
  allowance,
  priceCurrency,
  decimals = 18,
  isInvest,
  tokenPrice,
  tokenSymbol,
  unStakeTime,
}) => {
  const availableBalance = getFullDisplayBalance(max, decimals)
  const { account } = useKardiachain()
  const [value, setValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const usdValue = value && formatNumber(new BigNumber(value).times(priceCurrency).toNumber())
  const tokenValue = value && formatNumber(new BigNumber(value).dividedBy(tokenPrice).toNumber())

  const isInsufficientBalance = useMemo(() => {
    return new BigNumber(value).isGreaterThan(getFullDisplayBalance(max, decimals))
  }, [value, max, decimals])

  const handleTypeInput = (valueInput) => {
    setValue(valueInput)
  }

  const handleApprove = useCallback(async () => {
    try {
      setPendingTx(true)
      await onApprove()
      setPendingTx(false)
    } catch (e) {
      console.log(e)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingTx(false)
    }
  }, [onApprove])

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
    const availableBalance = getFullDisplayBalance(max, decimals)
    if (typeof fixedValue === 'undefined') {
      if (typeof maxInvest === 'number') {
        setValue(`${maxInvest}`)
      } else {
        setValue(availableBalance)
      }
    }
  }, [max, decimals, fixedValue, maxInvest, minInvest])

  const handleMinInput = useCallback(() => {
    const availableBalance = getFullDisplayBalance(max, decimals)
    if (typeof fixedValue === 'undefined') {
      if (typeof minInvest === 'number') {
        setValue(`${minInvest}`)
      } else {
        setValue(availableBalance)
      }
    }
  }, [max, decimals, fixedValue, maxInvest, minInvest])
  useEffect(() => {
    if (open) {
      if (typeof fixedValue !== 'undefined') {
        setValue(`${fixedValue}`)
      } else if (minInvest) {
        setValue(`${minInvest}`)
      } else {
        setValue('')
      }
    }
  }, [open])

  // When KAI price change
  useEffect(() => {
    if (typeof fixedValue === 'undefined') {
      const numberValue = new BigNumber(value).toNumber()
      if (numberValue < minInvest) {
        setValue(`${minInvest}`)
      }
      if (numberValue > maxInvest) {
        setValue(`${maxInvest}`)
      }
    }
  }, [minInvest, maxInvest])

  return (
    <Modal open={open} onClose={onDismiss}>
      <ModalTitle onClose={onDismiss}>{title}</ModalTitle>
      <div>
        <TokenInput
          currencyValue={
            priceCurrency &&
            priceCurrency !== 0 &&
            `~${usdValue || 0} USD ${isInvest ? ` ~${tokenValue || 0} ${tokenSymbol}` : ''}`
          }
          max={max}
          disabled={typeof fixedValue !== 'undefined'}
          onMax={handleMaxInput}
          symbol={lpTokenName}
          description={description}
          value={value}
          onUserInput={handleTypeInput}
          decimals={decimals}
          {...(isInvest
            ? {
                onMin: handleMinInput,
              }
            : {})}
        />
      </div>
      {(isApproved && fixedValue && fixedValue > availableBalance) ||
      (typeof fixedValue === 'undefined' && availableBalance < minInvest) ? (
        <p className="text-right text-red-500 text-sm">{textNotEnoughBalance}</p>
      ) : null}
      {!isInvest && (
        <p className="text-center text-red-500 text-sm">
          DRAGON Staked for IDO ticket will be locked until {formatDDMMMHHmm(unStakeTime)} (UTC), then you can unstake
          DRAGONs!
        </p>
      )}
      {isInvest && disabled ? (
        <p className="text-center text-red-500 text-sm mt-2">IDO has not started yet. Your transaction will fail!</p>
      ) : null}
      <ModalFooter>
        <Button disabled={pendingTx} color="secondary" className="mr-2" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          disabled={
            isApproved
              ? disabled ||
                (maxInvest && Number(value) > maxInvest) ||
                (minInvest && Number(value) < minInvest) ||
                pendingTx ||
                !new BigNumber(value).isGreaterThan(0) ||
                isInsufficientBalance ||
                (isApproved && fixedValue && fixedValue > availableBalance)
              : pendingTx
          }
          isLoading={pendingTx}
          onClick={isApproved ? handleConfirm : handleApprove}
        >
          {!isApproved
            ? 'Approve Contract'
            : isInsufficientBalance
            ? `Insufficient ${lpTokenName} balance`
            : pendingTx
            ? 'Pending Confirmation'
            : (maxInvest && Number(value) > maxInvest) || (minInvest && Number(value) < minInvest)
            ? 'Invalid value'
            : 'Confirm'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ModalStakeIDO.propTypes = {
  open: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  lpTokenName: PropTypes.string.isRequired,
  max: PropTypes.any,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.any,
  priceCurrency: PropTypes.number,
  decimals: PropTypes.number,
}

export default ModalStakeIDO
