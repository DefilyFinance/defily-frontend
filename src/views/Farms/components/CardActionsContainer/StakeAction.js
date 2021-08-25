import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Dots from 'components/Loader/Dots'
import ModalCurrency from 'components/Modal/ModalCurrency'
import Value from 'components/Value/Value'
import { useApprove } from 'hooks/useApprove'
import useKardiachain from 'hooks/useKardiachain'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { useCallback, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import { useDispatch } from 'react-redux'
import {
  updateUserAllowance,
  updateUserEarningsBalance,
  updateUserStakedBalance,
  updateUserStakingBalance,
} from 'store/farms/index'
import { useModalWalletConnect } from 'store/modal/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getNameLpToken } from 'utils/tokenHelpers'

const StakeAction = ({ farm, userDataLoaded, masterChefAddress, earningTokenSymbol }) => {
  const pid = farm.pid
  const lpAddress = farm.lpAddress
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openWithdraw, setOpenWithdraw] = useState(false)

  const lpTokenName = getNameLpToken(farm.token0, farm.token1)
  const { allowance, stakedBalance, stakingTokenBalance } = farm.userData

  const { onApprove } = useApprove(lpAddress, masterChefAddress)
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const usdTokenStaking = stakedBalance
    ? new BigNumber(getFullDisplayBalance(stakedBalance, farm.decimals)).times(farm.price).toNumber()
    : 0

  const { onStake } = useStake(pid, masterChefAddress)
  const { onUnstake } = useUnstake(pid, masterChefAddress)

  const handleStake = async (amount) => {
    await onStake(amount, farm.decimals)
    dispatch(updateUserStakingBalance(account, farm.pid))
    dispatch(updateUserStakedBalance(account, farm.pid))
    dispatch(updateUserEarningsBalance(account, farm.pid))
    showToastSuccess('Staked', `Your ${lpTokenName} funds have been staked in the pool!`)
  }

  const handleUnstake = async (amount) => {
    await onUnstake(amount, farm.decimals)
    dispatch(updateUserStakingBalance(account, farm.pid))
    dispatch(updateUserStakedBalance(account, farm.pid))
    dispatch(updateUserEarningsBalance(account, farm.pid))
    showToastSuccess('Unstaked', `Your ${earningTokenSymbol} earnings have also been harvested to your wallet!`)
  }

  const toggleDeposit = () => setOpenDeposit(!openDeposit)
  const toggleWithdraw = () => setOpenWithdraw(!openWithdraw)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      showToastSuccess('Contract Enabled', `You can now stake in the ${lpTokenName} pool!`)
      dispatch(updateUserAllowance(account, farm.pid))
      setRequestedApproval(false)
    } catch (e) {
      console.log(e)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setRequestedApproval(false)
    }
  }, [account, dispatch, farm, lpTokenName, onApprove])

  return (
    <>
      <ModalCurrency
        title={`Deposit ${lpTokenName} Tokens`}
        max={stakingTokenBalance}
        onDismiss={toggleDeposit}
        open={openDeposit}
        lpTokenName={lpTokenName}
        onConfirm={handleStake}
        priceCurrency={farm.price}
        decimals={farm.decimals}
      />
      <ModalCurrency
        title={`Withdraw ${lpTokenName}`}
        max={stakedBalance}
        onDismiss={toggleWithdraw}
        open={openWithdraw}
        lpTokenName={lpTokenName}
        onConfirm={handleUnstake}
        priceCurrency={farm.price}
        decimals={farm.decimals}
      />
      <div className="flex justify-between items-center">
        <div>
          <Value
            className="text-primary font-bold text-xl"
            value={account ? getBalanceNumber(stakedBalance, farm.decimals) : 0}
          />
          <Value
            prefix="~"
            className="text-primary text-sm"
            value={account ? usdTokenStaking : 0}
            decimals={2}
            unit="USD"
          />
        </div>
        {account ? (
          userDataLoaded ? (
            isApproved ? (
              <>
                {stakedBalance.eq(new BigNumber(0)) ? (
                  <Button onClick={toggleDeposit}>Stake</Button>
                ) : (
                  <div className="flex items-center">
                    <Button className="mr-1" size="sm" onClick={toggleWithdraw}>
                      <Minus />
                    </Button>
                    <Button size="sm" onClick={toggleDeposit}>
                      <Plus />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Button isLoading={requestedApproval} disabled={requestedApproval} onClick={handleApprove}>
                Approve Contract
              </Button>
            )
          ) : (
            <Button>
              <Dots>Loading</Dots>
            </Button>
          )
        ) : (
          <Button onClick={onToggleConnectModal}>Connect wallet</Button>
        )}
      </div>
    </>
  )
}

export default StakeAction
