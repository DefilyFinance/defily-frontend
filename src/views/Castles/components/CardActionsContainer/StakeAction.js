import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import Dots from 'components/Loader/Dots'
import ModalPoolCurrency from 'components/Modal/ModalPoolCurrency'
import ModalWarning from 'components/Modal/ModalWarning'
import Value from 'components/Value/Value'
import { useSousApprove } from 'hooks/useApprove'
import useKardiachain from 'hooks/useKardiachain'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake, useSousUnstakeEmergency } from 'hooks/useUnstake'
import { useCallback, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import { useDispatch } from 'react-redux'
import { useCurrentBlock } from 'store/block/hook'
import { fetchCastlesUserDataAsync } from 'store/castles/index'
import { useModalWalletConnect } from 'store/modal/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getPoolName } from 'utils/tokenHelpers'

const StakeAction = ({ pool, userDataLoaded, isIfo }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const currentBlock = useCurrentBlock()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openWithdraw, setOpenWithdraw] = useState(false)
  const [openWarning, setOpenWarning] = useState({
    open: false,
    content: '',
  })

  const { allowance, stakedBalance, stakingTokenBalance } = pool.userData

  const { onApprove } = useSousApprove(pool.stakingToken.address, pool.contractAddress)
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const tokensEarningLabel = getPoolName(pool.isV2 ? pool.earningTokens : [pool.earningToken])
  const isCanStake = currentBlock >= pool.stakingBlock || !pool.stakingBlock

  const usdTokenStaking = stakedBalance
    ? new BigNumber(getFullDisplayBalance(stakedBalance, pool.stakingToken.decimals))
        .times(pool.stakingTokenPrice)
        .toNumber()
    : 0

  const { onStake } = useSousStake(pool.contractAddress)
  const { onUnstake } = useSousUnstake(pool.contractAddress)
  const { onUnstakeEmergency } = useSousUnstakeEmergency(pool.contractAddress)

  const handleStake = async (amount) => {
    await onStake(amount, pool.stakingToken.decimals)
    dispatch(fetchCastlesUserDataAsync(account))
    showToastSuccess('Staked', `Your ${pool.stakingToken.symbol} funds have been staked in the pool!`)
  }

  const handleUnstake = async (amount) => {
    await onUnstake(amount, pool.stakingToken.decimals)
    dispatch(fetchCastlesUserDataAsync(account))
    showToastSuccess('Unstaked', `Your ${pool.stakingToken.symbol} earnings have also been harvested to your wallet!`)
  }

  const handleUnstakeEmergency = async () => {
    try {
      await onUnstakeEmergency()
      dispatch(fetchCastlesUserDataAsync(account))
      showToastSuccess('Unstaked')
    } catch (e) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
    }
  }

  const toggleDeposit = () => {
    if (isIfo) return toggleWarning('Sold out')
    if (pool.poolLimit.gt(0) && pool.totalStaked.toNumber() === pool.poolLimit.toNumber() && pool.isV2) {
      return toggleWarning('The pool is full. Please stake in another Castle')
    }
    setOpenDeposit(!openDeposit)
  }

  const toggleWithdraw = () => setOpenWithdraw(!openWithdraw)

  const toggleWarning = (content) =>
    setOpenWarning((prevState) => ({
      open: !prevState.open,
      content: content,
    }))

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      showToastSuccess('Contract Enabled', `You can now stake in the ${tokensEarningLabel} pool!`)
      dispatch(fetchCastlesUserDataAsync(account))
      setRequestedApproval(false)
    } catch (e) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setRequestedApproval(false)
    }
  }, [onApprove, tokensEarningLabel, dispatch, account])

  return (
    <>
      {openWarning.open && (
        <ModalWarning toggleModal={toggleWarning} open={openWarning.open} content={openWarning.content} />
      )}
      <ModalPoolCurrency
        open={openDeposit}
        max={stakingTokenBalance}
        onDismiss={toggleDeposit}
        onConfirm={handleStake}
        userData={pool.userData}
        stakingLimit={pool.stakingLimit}
        poolLimit={pool.poolLimit}
        pool={pool}
        priceCurrency={pool.stakingTokenPrice}
        isCanStake={isCanStake}
        isIfo={isIfo}
      />
      <ModalPoolCurrency
        open={openWithdraw}
        max={stakedBalance}
        onDismiss={toggleWithdraw}
        onConfirm={handleUnstake}
        userData={pool.userData}
        stakingLimit={pool.stakingLimit}
        poolLimit={pool.poolLimit}
        pool={pool}
        priceCurrency={pool.stakingTokenPrice}
        isIfo={isIfo}
        isDeposit={false}
      />
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <Value
            className="text-primary font-bold text-xl"
            value={account ? getBalanceNumber(stakedBalance, pool.stakingToken.decimals) : 0}
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
                {pool.isFinished && !isIfo ? (
                  <div className="flex items-center">
                    <Button className="flex-1" disabled={stakedBalance.eq(new BigNumber(0))} onClick={toggleWithdraw}>
                      Unstake
                    </Button>
                  </div>
                ) : (
                  <>
                    {isIfo ? (
                      <Button onClick={toggleDeposit}>Buy in</Button>
                    ) : stakedBalance.eq(new BigNumber(0)) ? (
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
