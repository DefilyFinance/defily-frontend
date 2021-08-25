import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import NumericalInput from 'components/NumericalInput/NumericalInput'
import { useModalWalletConnect } from 'store/modal/hooks'
import { useVaultApprove } from 'hooks/useApprove'
import useDeposit from 'hooks/useDeposit'
import useKardiachain from 'hooks/useKardiachain'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchVaultUserDataAsync, fetchVaultV2UserDataAsync, updateUserAllowance } from 'store/vaults/index'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

const Deposit = ({ decimals, symbol, priceStakingToken, userData, vault, userDataLoaded, isV2 }) => {
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { stakingTokenBalance, allowance } = userData
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const { onApprove } = useVaultApprove(vault.contractAddress, vault.lpTokenAddress)

  const { onDeposit } = useDeposit(vault.contractAddress)

  const usdValue = value && formatNumber(new BigNumber(value).times(priceStakingToken).toNumber())
  const usdBalance =
    stakingTokenBalance &&
    formatNumber(new BigNumber(getBalanceNumber(stakingTokenBalance, decimals)).times(priceStakingToken).toNumber())

  const handleTypeInput = (valueInput) => {
    setValue(valueInput)
  }

  const isInsufficientBalance = useMemo(() => {
    return new BigNumber(value).isGreaterThan(getFullDisplayBalance(stakingTokenBalance, decimals))
  }, [value, stakingTokenBalance, decimals])

  const handleMaxInput = useCallback(() => {
    setValue(getFullDisplayBalance(stakingTokenBalance, decimals))
  }, [decimals, stakingTokenBalance])

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      showToastSuccess('Contract Enabled', `You can now stake in the ${symbol} vault!`)
      dispatch(updateUserAllowance(account, vault, isV2))
      setRequestedApproval(false)
    } catch (e) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setRequestedApproval(false)
    }
  }, [account, dispatch, isV2, onApprove, symbol, vault])

  const handleDeposit = useCallback(async () => {
    try {
      setPendingTx(true)
      await onDeposit(value, decimals)
      dispatch(fetchVaultV2UserDataAsync(account))
      dispatch(fetchVaultUserDataAsync(account))
      showToastSuccess('Deposited', `Your ${symbol} funds have been deposited in the vault!`)
      setValue('')
      setPendingTx(false)
    } catch (e) {
      console.log(e)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingTx(false)
    }
  }, [account, decimals, dispatch, onDeposit, symbol, value])

  return (
    <div>
      <div className="text-white flex">
        <p>Available:</p>
        <div className={classnames('ml-2', isV2 && 'mb-6')}>
          <p>
            {account ? getFullDisplayBalance(stakingTokenBalance, decimals) : 0} {symbol}
          </p>
          <p className="text-sm mt-1">~{usdBalance || '0'} USD</p>
        </div>
      </div>
      <NumericalInput value={value} onUserInput={handleTypeInput} />
      <p className="text-sm text-right text-white mt-1">~{usdValue || '0'} USD</p>
      <Button onClick={handleMaxInput} className="ml-auto mt-2">
        Max
      </Button>
      {account ? (
        userDataLoaded ? (
          isApproved ? (
            <Button
              className="mx-auto"
              disabled={pendingTx || !new BigNumber(value).isGreaterThan(0) || isInsufficientBalance}
              isLoading={pendingTx}
              onClick={handleDeposit}
            >
              {isInsufficientBalance
                ? `Insufficient ${symbol} balance`
                : pendingTx
                ? 'Pending Confirmation'
                : 'Deposit'}
            </Button>
          ) : (
            <Button
              className="mx-auto"
              isLoading={requestedApproval}
              disabled={requestedApproval}
              onClick={handleApprove}
            >
              Approve Contract
            </Button>
          )
        ) : (
          <Button className="mx-auto" isLoading>
            Loading...
          </Button>
        )
      ) : (
        <Button className="mx-auto" onClick={onToggleConnectModal}>
          Connect wallet
        </Button>
      )}
    </div>
  )
}

Deposit.propTypes = {
  symbol: PropTypes.string.isRequired,
  decimals: PropTypes.number,
  priceStakingToken: PropTypes.number,
  userData: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  userDataLoaded: PropTypes.bool.isRequired,
  isV2: PropTypes.bool,
}

export default Deposit
