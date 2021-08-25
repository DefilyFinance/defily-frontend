import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError } from 'components/CustomToast/CustomToast'
import ModalFooter from 'components/Modal/ModalFooter'
import TokenInput from 'components/TokenInput/TokenInput'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import FeeSummary from 'views/Castles/components/FeeSummary'

const ModalPoolCurrency = ({
  open,
  onDismiss,
  max,
  onConfirm,
  userData,
  pool,
  priceCurrency,
  isDeposit = true,
  isCanStake,
  isIfo,
}) => {
  const { stakingToken, stakingLimit, poolLimit } = pool
  const [value, setValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [hasReachedStakePoolLimit, setHasReachedStakedPoolLimit] = useState(false)

  const usdValue = value && formatNumber(new BigNumber(value).times(priceCurrency).toNumber())

  useEffect(() => {
    if (stakingLimit.gt(0) && isDeposit) {
      const fullDecimalStakeAmount = new BigNumber(value)
      setHasReachedStakedLimit(
        fullDecimalStakeAmount
          .plus(getBalanceNumber(userData.stakedBalance, stakingToken.decimals))
          .gt(getBalanceNumber(stakingLimit, stakingToken.decimals)),
      )
    }
  }, [value, stakingLimit, userData, stakingToken, isDeposit, setHasReachedStakedLimit])

  useEffect(() => {
    if (poolLimit.gt(0) && pool.isV2 && isDeposit) {
      const fullDecimalStakeAmount = new BigNumber(value)
      setHasReachedStakedPoolLimit(
        fullDecimalStakeAmount
          .plus(getBalanceNumber(pool.totalStaked, stakingToken.decimals))
          .gt(getBalanceNumber(poolLimit, stakingToken.decimals)),
      )
    }
  }, [value, poolLimit, userData, stakingToken, setHasReachedStakedPoolLimit, pool.isV2, pool.totalStaked, isDeposit])

  const isInsufficientBalance = useMemo(() => {
    return new BigNumber(value).isGreaterThan(getFullDisplayBalance(max, stakingToken.decimals))
  }, [value, max, stakingToken.decimals])

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
    if (stakingLimit.gt(0) && isDeposit) {
      const valueUserPossibleStaking = new BigNumber(getBalanceNumber(stakingLimit, stakingToken.decimals)).minus(
        getBalanceNumber(userData.stakedBalance, stakingToken.decimals),
      )

      if (valueUserPossibleStaking.lte(getBalanceNumber(userData.stakingTokenBalance, stakingToken.decimals))) {
        return setValue(valueUserPossibleStaking.toString())
      }
    } else {
      return setValue(getFullDisplayBalance(max, stakingToken.decimals))
    }
  }, [isDeposit, max, stakingLimit, stakingToken.decimals, userData.stakedBalance, userData.stakingTokenBalance])

  useEffect(() => {
    if (open) {
      setValue('')
    }
  }, [open])

  return (
    <Modal open={open} onClose={onDismiss}>
      <ModalTitle onClose={onDismiss}>
        {isDeposit
          ? `${isIfo ? 'Buy-in with' : 'Deposit'} ${stakingToken.symbol} Tokens`
          : `Withdraw ${stakingToken.symbol}`}
      </ModalTitle>
      <div>
        <TokenInput
          decimals={stakingToken.decimals}
          currencyValue={priceCurrency && priceCurrency !== 0 && `~${usdValue || 0} USD`}
          max={max}
          onMax={handleMaxInput}
          symbol={stakingToken.symbol}
          value={value}
          onUserInput={handleTypeInput}
        />
      </div>
      {hasReachedStakeLimit && (
        <p className="text-sm text-right text-rose-700">
          Maximum total stake per user: {formatNumber(getBalanceNumber(stakingLimit, stakingToken.decimals), 0)}{' '}
          {stakingToken.symbol}
        </p>
      )}
      {hasReachedStakePoolLimit && (
        <p className="text-sm text-right text-rose-700">
          Maximum total stake: {formatNumber(getBalanceNumber(poolLimit, stakingToken.decimals), 0)}{' '}
          {stakingToken.symbol}
        </p>
      )}
      {!isCanStake && isDeposit && (
        <p className="text-center text-red-500 text-sm mt-2">Pool has not started yet. Your transaction will fail!</p>
      )}
      {!isDeposit && pool?.fees?.withdrawalFee && (
        <FeeSummary
          stakedBalance={userData.stakedBalance}
          lastStakingBlock={userData.lastStakingBlock}
          blockPeriod={pool.blockPeriod}
          withdrawalFee={pool.fees.withdrawalFee}
          stakeAmount={value}
          stakingTokenSymbol={stakingToken.symbol}
        />
      )}
      <ModalFooter>
        <Button disabled={pendingTx} color="secondary" className="mr-2" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          disabled={
            pendingTx ||
            !new BigNumber(value).isGreaterThan(0) ||
            isInsufficientBalance ||
            hasReachedStakeLimit ||
            hasReachedStakePoolLimit
          }
          isLoading={pendingTx}
          onClick={handleConfirm}
        >
          {isInsufficientBalance
            ? `Insufficient ${stakingToken.symbol} balance`
            : pendingTx
            ? 'Pending Confirmation'
            : 'Confirm'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ModalPoolCurrency.propTypes = {
  open: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  max: PropTypes.any,
  onConfirm: PropTypes.func.isRequired,
  pool: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  priceCurrency: PropTypes.number,
  isDeposit: PropTypes.bool,
  isCanStake: PropTypes.bool,
}

export default ModalPoolCurrency
