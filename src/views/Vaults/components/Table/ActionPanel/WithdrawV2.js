import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import NumericalInput from 'components/NumericalInput/NumericalInput'
import { useModalWalletConnect } from 'store/modal/hooks'
import useKardiachain from 'hooks/useKardiachain'
import useWithdraw from 'hooks/useWithdraw'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { calculatorStakedBalanceOfVaultV2 } from 'store/vaults/helpers'
import { fetchVaultUserDataAsync, fetchVaultV2UserDataAsync } from 'store/vaults/index'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

const Withdraw = ({
  decimals,
  decimalsTokenStrategyStaking,
  symbol,
  symbolInVaultStaked,
  priceStakingToken,
  priceStakingTokenInVaultStaked,
  userData,
  vault,
  userDataLoaded,
}) => {
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { stakedBalance } = userData
  const { onWithdraw } = useWithdraw(vault.contractAddress)

  const { totalStakedBalance, stakedBalanceOfVault, stakedBalanceInVaultStaked } = calculatorStakedBalanceOfVaultV2(
    vault,
    userData,
    priceStakingTokenInVaultStaked,
    priceStakingToken,
  )

  const usdValue = value && formatNumber(new BigNumber(value).times(priceStakingToken).toNumber())

  const usdBalance =
    totalStakedBalance &&
    formatNumber(
      new BigNumber(getBalanceNumber(stakedBalanceOfVault, decimals))
        .times(priceStakingToken)
        .plus(
          new BigNumber(getBalanceNumber(stakedBalanceInVaultStaked, decimalsTokenStrategyStaking)).times(
            priceStakingTokenInVaultStaked,
          ),
        )
        .toNumber(),
    )

  const handleTypeInput = (valueInput) => {
    setValue(valueInput)
  }

  const isInsufficientBalance = useMemo(() => {
    return new BigNumber(value).isGreaterThan(getFullDisplayBalance(stakedBalance, decimals))
  }, [value, stakedBalance, decimals])

  const handleMaxInput = useCallback(() => {
    setValue(getFullDisplayBalance(stakedBalance, decimals))
  }, [decimals, stakedBalance])

  const handleWithdraw = useCallback(async () => {
    try {
      setPendingTx(true)
      await onWithdraw(value, decimals)
      dispatch(fetchVaultV2UserDataAsync(account))
      dispatch(fetchVaultUserDataAsync(account))
      showToastSuccess('Withdrawal Successful!')
      setValue('')
      setPendingTx(false)
    } catch (e) {
      console.log(e)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingTx(false)
    }
  }, [account, decimals, dispatch, onWithdraw, value])

  return (
    <div>
      <div className="text-white flex">
        <p>Vault balance:</p>
        <div className="ml-2">
          <p>
            {account ? getFullDisplayBalance(stakedBalanceOfVault, decimals) : 0} {symbol}
          </p>
          <p>
            +{' '}
            {account
              ? stakedBalanceInVaultStaked.gt(1) || stakedBalanceInVaultStaked.eq(0)
                ? getBalanceNumber(stakedBalanceInVaultStaked, decimalsTokenStrategyStaking)
                : getFullDisplayBalance(new BigNumber(1), decimalsTokenStrategyStaking)
              : 0}{' '}
            {symbolInVaultStaked}
          </p>
          <p className="text-sm mt-1">~{Number.isNaN(usdBalance) || !usdBalance ? '0' : usdBalance} USD</p>
        </div>
      </div>
      <NumericalInput value={value} onUserInput={handleTypeInput} />
      <p className="text-sm text-right text-white mt-1">~{usdValue || '0'} USD</p>
      <Button onClick={handleMaxInput} className="ml-auto mt-2">
        Max
      </Button>
      {account ? (
        userDataLoaded ? (
          <Button
            className="mx-auto"
            disabled={pendingTx || !new BigNumber(value).isGreaterThan(0) || isInsufficientBalance}
            isLoading={pendingTx}
            onClick={handleWithdraw}
          >
            {isInsufficientBalance ? `Insufficient ${symbol} balance` : pendingTx ? 'Pending Confirmation' : 'Withdraw'}
          </Button>
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

Withdraw.propTypes = {
  symbol: PropTypes.string.isRequired,
  symbolInVaultStaked: PropTypes.string.isRequired,
  decimals: PropTypes.number,
  priceStakingToken: PropTypes.number,
  priceStakingTokenInVaultStaked: PropTypes.number,
  userData: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  userDataLoaded: PropTypes.bool.isRequired,
}

export default Withdraw
