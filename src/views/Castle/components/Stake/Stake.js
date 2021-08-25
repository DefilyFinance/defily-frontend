import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import DoubleLogo from 'components/Logo/DoubleLogo'
import ModalPoolCurrency from 'components/Modal/ModalPoolCurrency'
import ModalWarning from 'components/Modal/ModalWarning'
import ModalWarningIfo from 'components/Modal/ModalWarningIfo'
import { useModalWalletConnect } from 'store/modal/hooks'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake, useSousUnstakeEmergency } from 'hooks/useUnstake'
import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Plus } from 'react-feather'
import { useDispatch } from 'react-redux'
import { useCurrentBlock } from 'store/block/hook'
import { fetchCastleUserDataAsync } from 'store/castles/index'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import Value from 'components/Value/Value'
import { useSousApprove } from 'hooks/useApprove'
import useKardiachain from 'hooks/useKardiachain'
import { formatLogo } from 'utils/formatLogo'
import { getPoolName } from 'utils/tokenHelpers'
import UnstakingFeeCountdownRow from 'views/Castles/components/UnstakingFeeCountdownRow'

const Stake = ({ pool, userData, isIfo }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const currentBlock = useCurrentBlock()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openWithdraw, setOpenWithdraw] = useState(false)
  const [openWarningIfo, setOpenWarningIfo] = useState(false)
  const [openWarning, setOpenWarning] = useState({
    open: false,
    content: '',
  })

  const allowance = userData.allowance
  const { onApprove } = useSousApprove(pool.stakingToken.address, pool.contractAddress)
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const tokensEarningLabel = getPoolName(pool.isV2 ? pool.earningTokens : [pool.earningToken])

  const isCanStake = currentBlock >= pool.stakingBlock || !pool.stakingBlock

  const stakedBalance = userData.stakedBalance
  const stakingTokenBalance = userData.stakingTokenBalance

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
    dispatch(fetchCastleUserDataAsync(account, pool))
    showToastSuccess('Staked', `Your ${pool.stakingToken.symbol} funds have been staked in the pool!`)
  }

  const handleUnstake = async (amount) => {
    await onUnstake(amount, pool.stakingToken.decimals)
    dispatch(fetchCastleUserDataAsync(account, pool))
    showToastSuccess('Unstaked', `Your ${pool.stakingToken.symbol} earnings have also been harvested to your wallet!`)
  }

  const handleUnstakeEmergency = async () => {
    try {
      await onUnstakeEmergency()
      dispatch(fetchCastleUserDataAsync(account, pool))
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
  const toggleWarningIfo = () => setOpenWarningIfo(!openWarningIfo)
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
      dispatch(fetchCastleUserDataAsync(account, pool))
      setRequestedApproval(false)
    } catch (e) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setRequestedApproval(false)
    }
  }, [onApprove, tokensEarningLabel, dispatch, account, pool])

  const logo = formatLogo(
    pool?.stakingToken?.token1 ? pool?.stakingToken.token0 : pool?.stakingToken,
    pool?.stakingToken?.token1,
  )

  return (
    <>
      <ModalWarningIfo open={openWarningIfo} toggleModal={toggleWarningIfo} onSubmit={toggleDeposit} />
      {openWarning.open && (
        <ModalWarning toggleModal={toggleWarning} open={openWarning.open} content={openWarning.content} />
      )}
      <ModalPoolCurrency
        open={openDeposit}
        max={stakingTokenBalance}
        onDismiss={toggleDeposit}
        onConfirm={handleStake}
        userData={userData}
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
        userData={userData}
        stakingLimit={pool.stakingLimit}
        poolLimit={pool.poolLimit}
        pool={pool}
        priceCurrency={pool.stakingTokenPrice}
        isIfo={isIfo}
        isDeposit={false}
      />
      <Card minHeight={320} className="mx-4 flex-1 farm-card max-w-md mb-8">
        <div className="p-5 h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="text-center">
              <div className="h-20">
                <div className="h-20">
                  <div className={classnames('flex justify-center', logo.src1 && 'transform -translate-x-5')}>
                    <DoubleLogo src0={logo.src0} src1={logo.src1} alt0={logo.alt0} alt1={logo.alt1} size={80} />
                  </div>
                </div>
              </div>
              <Value
                className="text-primary text-2xl break-words"
                value={account ? getBalanceNumber(stakedBalance, pool.stakingToken.decimals) : 0}
              />
              <Value
                prefix="~"
                className="text-primary"
                value={account ? usdTokenStaking : 0}
                decimals={2}
                unit="USD"
              />
              <p className="text-white text-xl">
                {pool.stakingToken.symbol} Tokens {isIfo ? 'Contributed' : 'Staked'}
              </p>
            </div>
            <UnstakingFeeCountdownRow
              stakedBalance={stakedBalance}
              fees={pool?.fees?.withdrawalFee}
              blockPeriod={pool.blockPeriod}
              lastStakingBlock={userData.lastStakingBlock}
            />
            {account ? (
              <>
                {userData.userDataLoaded && pool.startBlock ? (
                  pool.isFinished ? (
                    pool.isEmergencyWithdraw ? (
                      <>
                        <div className="flex items-center">
                          <Button
                            className="flex-1 mr-4"
                            disabled={stakedBalance.eq(new BigNumber(0))}
                            onClick={handleUnstakeEmergency}
                          >
                            Unstake
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {!isIfo && (
                          <div className="flex items-center">
                            <Button
                              className="flex-1 mr-4"
                              disabled={stakedBalance.eq(new BigNumber(0))}
                              onClick={toggleWithdraw}
                            >
                              Unstake
                            </Button>
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <>
                      {isApproved ? (
                        <div className="flex items-center">
                          {isIfo ? (
                            <Button className="flex-1" onClick={toggleDeposit}>
                              Buy in
                            </Button>
                          ) : (
                            <>
                              <Button
                                className="flex-1 mr-4"
                                disabled={stakedBalance.eq(new BigNumber(0))}
                                onClick={toggleWithdraw}
                              >
                                Unstake
                              </Button>
                              <Button onClick={toggleDeposit}>
                                <Plus />
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <Button isLoading={requestedApproval} disabled={requestedApproval} onClick={handleApprove}>
                          Approve Contract
                        </Button>
                      )}
                    </>
                  )
                ) : (
                  <div className="flex items-center">
                    <Button className="flex-1" isLoading={true}>
                      Loading...
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Button className="w-full" onClick={onToggleConnectModal}>
                Connect wallet
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

Stake.propTypes = {
  pool: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
}

export default Stake
