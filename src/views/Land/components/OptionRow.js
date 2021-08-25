/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import Value from 'components/Value/Value'
import Countdown, { zeroPad } from 'react-countdown'
import Button from 'components/Button/Button'
import { useModalWalletConnect } from 'store/modal/hooks'
import { useParams } from 'react-router-dom'
import { useLandFromIdoId, useLandUser } from 'store/lands/hook'
import ModalStakeIDO from 'components/Modal/ModalStakeIDO'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { useDflPrice, useKaiPrice } from 'hooks/usePrice'
import { fetchLandDataAsync, fetchLandUserDataAsync } from 'store/lands'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import { useSousApprove } from 'hooks/useApprove'
import { useSousStake } from 'hooks/useStake'
import useKardiachain from 'hooks/useKardiachain'
import { useInvestIdo } from 'hooks/useDeposit'
import useClaim from 'hooks/useClaim'
import { useDispatch } from 'react-redux'
import { getBalanceNumber } from 'utils/formatBalance'
import useInterval from 'hooks/useInterval'
import { useSousUnstake } from 'hooks/useUnstake'
import ModalWarning from 'components/Modal/ModalWarning'

const OPTION_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  CLOSED: 'CLOSED',
}

const OptionRow = ({ option, index, tokenSold, totalSupply }) => {
  const { id } = useParams()
  const idoUser = useLandUser(id)
  const pool = useLandFromIdoId(id)
  const dflPrice = useDflPrice()
  const kaiPrice = useKaiPrice()
  const dispatch = useDispatch()
  const { account } = useKardiachain()

  const { onToggleConnectModal } = useModalWalletConnect()
  const { onApprove } = useSousApprove(pool.stakingToken.address, option?.poolContract?.address)
  const { onStake } = useSousStake(option?.poolContract?.address)
  const { onUnstake } = useSousUnstake(option?.poolContract?.address)
  const { onInvest } = useInvestIdo(option?.idoContract?.address, index + 1)
  const { onClaim } = useClaim(option?.idoContract?.address, index + 1)

  const [optionStatus, setOptionStatus] = useState(1)
  const [openModal, setOpenModal] = useState(undefined)
  const [claimTimeAllowed, setClaimTimeAllowed] = useState(undefined)
  const [claimTime, setClaimTime] = useState(undefined)
  const [pendingClaim, setPendingClaim] = useState(false)
  const [pendingUnStake, setPendingUnStake] = useState(false)
  const [canUnStake, setCanUnStake] = useState(false)
  const [openWarning, setOpenWarning] = useState({ open: false, content: '' })

  // data pool
  const token = pool?.token
  const stakingToken = pool?.stakingToken
  const totalCollected = pool?.totalCollecteds?.[index]
  const staked = getBalanceNumber(idoUser?.stakedBalances?.[index], pool.stakingToken.decimals)

  // data option
  const hardCap = option?.idoContract?.hardCap

  const dragonBalance = new BigNumber(idoUser?.dragonBalance)
  const kaiBalance = new BigNumber(idoUser?.tokenBalance)
  const investmentBalance = getBalanceNumber(idoUser?.idoData?.[index]?.investments, pool?.buyToken?.decimals) || 0
  const minInvest = option?.minInvest - investmentBalance >= 0 ? option?.minInvest - investmentBalance : 0
  const isSoldOut = hardCap - totalCollected < minInvest || (minInvest === 0 && hardCap - totalCollected === 0)
  let maxInvest = option?.maxInvest - investmentBalance >= 0 ? option?.maxInvest - investmentBalance : 0
  if (maxInvest > 0 && hardCap - totalCollected < maxInvest) {
    maxInvest = hardCap - totalCollected
  }
  const idoData = idoUser?.idoData?.[index]
  const totalInvestor = pool?.totalInvestors?.[index]
  const userDataLoaded = idoUser?.userDataLoaded
  const disableStake = !userDataLoaded || isSoldOut

  const toggleStake = () => {
    setOpenModal(undefined)
  }

  const toggleWarning = (content) =>
    setOpenWarning((prevState) => ({
      open: !prevState.open,
      content: content,
    }))

  useInterval(async () => {
    // check optionStatus
    let status = undefined
    if (Date.now() <= option?.idoContract?.openTime) {
      status = OPTION_STATUS.UPCOMING
    }
    if (Date.now() > option?.idoContract?.openTime && Date.now() <= option?.idoContract?.closeTime) {
      status = OPTION_STATUS.ONGOING
    }
    if (Date.now() > option?.idoContract?.closeTime) {
      status = OPTION_STATUS.CLOSED
    }
    if (status !== optionStatus) {
      setOptionStatus(status)
    }

    // check claimAllow
    let claimAllowed = false
    if (Date.now() >= option?.idoContract?.claimTime + 1300) {
      claimAllowed = true
    }
    if (claimAllowed !== claimTimeAllowed) {
      setClaimTimeAllowed(claimAllowed)
    }

    // check claimTime
    let _claimTime = undefined
    if (!option?.idoContract?.multipleClaim || Date.now() < option?.idoContract?.claimTime) {
      _claimTime = option?.idoContract?.claimTime
    } else {
      const periodTime = option?.idoContract?.claimCycle
      const period = Math.ceil((Date.now() - option?.idoContract?.claimTime) / periodTime)
      if (period >= option.idoContract?.claimTimes - 1) {
        _claimTime = option?.idoContract?.claimTime + (option.idoContract?.claimTimes - 1) * periodTime
      } else {
        _claimTime = option?.idoContract?.claimTime + period * periodTime
      }
    }
    if (claimTime !== _claimTime) {
      await setClaimTime(undefined)
      await setClaimTime(_claimTime)
    }

    // check canUnStake
    let _canUnStake = false
    if (option?.unStakeTime && Date.now() >= option?.unStakeTime) {
      _canUnStake = true
    }
    if (canUnStake !== _canUnStake) {
      setCanUnStake(_canUnStake)
    }
  }, 1000)

  const updateData = async () => {
    try {
      await Promise.all([dispatch(fetchLandUserDataAsync(account, pool)), dispatch(fetchLandDataAsync(pool))])
    } catch (error) {}
  }

  const handleApprove = async () => {
    try {
      await onApprove()
      await dispatch(fetchLandUserDataAsync(account, pool))
      showToastSuccess('Contract Enabled', 'You can now stake in the pool!')
    } catch (error) {
      throw error
    }
  }

  const handleUnStake = async () => {
    try {
      setPendingUnStake(true)
      await onUnstake(staked, pool?.stakingToken?.decimals)
      await dispatch(fetchLandUserDataAsync(account, pool))
      showToastSuccess('Success', `Unstake ${pool?.stakingToken?.symbol} successfully!`)
      setPendingUnStake(false)
    } catch (error) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingUnStake(false)
    }
  }

  const handleConfirm = async (value) => {
    try {
      if (openModal?.isInvest) {
        await onInvest(Number(value), pool?.buyToken?.decimals)
        await updateData()
        showToastSuccess('Success', 'Buy token successfully!')
      } else {
        await onStake(value, pool?.stakingToken?.decimals)
        await dispatch(fetchLandUserDataAsync(account, pool))
        showToastSuccess('Staked', `Your ${pool.stakingToken.symbol} funds have been staked in the pool!`)
      }
    } catch (error) {
      throw error
    }
  }

  const handleClaim = async () => {
    try {
      setPendingClaim(true)
      await onClaim()
      await updateData()
      showToastSuccess('Success', 'Claim token successfully!')
      setPendingClaim(false)
    } catch (error) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setPendingClaim(false)
    }
  }

  const onBuyClick = () => {
    if (isSoldOut) {
      toggleWarning('The option was sold out. Please buy token in another option')
    } else {
      setOpenModal({ open: true, isInvest: true })
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isSoldOut && openModal?.open === true) {
      setOpenModal(undefined)
    }
  }, [totalSupply, tokenSold, isSoldOut])

  const renderCountdownOpen = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return 'Open'
    return (
      <>
        <p>Open in</p>
        {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </>
    )
  }

  const renderCountdownEnd = ({ days, hours, minutes, seconds, completed }) => {
    if (isSoldOut) return null
    if (completed) return 'Close'
    return (
      <>
        <p>End in</p>
        {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </>
    )
  }

  const renderCountdownClaim = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return 'Claim is available'
    return (
      <>
        <p>Claim tokens in</p>
        {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </>
    )
  }

  const renderCountdownStartIn = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return null
    return (
      <>
        {' '}
        - Start in {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </>
    )
  }

  const renderTitleModalBuy = () => {
    return (
      <span>
        Buy {token?.symbol} {option?.label}
        {optionStatus === OPTION_STATUS.UPCOMING ? (
          <>
            <Countdown zeroPadTime={2} date={option?.idoContract?.openTime} renderer={renderCountdownStartIn} />
          </>
        ) : null}
      </span>
    )
  }

  return (
    <>
      <tr>
        <td>{option.label}</td>
        <td>
          {option?.poolContract?.stakingRequire?.toLocaleString()} {stakingToken?.symbol}
        </td>
        <td>
          <Value
            className="break-words"
            value={option?.values?.pricePerToken?.number}
            decimals={option?.values?.pricePerToken?.decimals}
            unit={` ${option?.values?.pricePerToken?.unit}`}
          />
        </td>
        <td>
          <div>
            {totalCollected >= 0 && option?.values?.pricePerToken?.number ? (
              <Value className="inline" value={totalCollected / option?.values?.pricePerToken?.number} decimals={0} />
            ) : (
              '--'
            )}
            /
            <Value className="inline" value={totalSupply} decimals={0} />
          </div>
          {totalInvestor ? (
            <p>
              {totalInvestor} investor{totalInvestor > 1 ? 's' : ''}
            </p>
          ) : null}
        </td>
        <td>
          {optionStatus === OPTION_STATUS.UPCOMING ? (
            <>
              <Countdown zeroPadTime={2} date={option?.idoContract?.openTime} renderer={renderCountdownOpen} />
            </>
          ) : null}
          {[OPTION_STATUS.ONGOING].includes(optionStatus) ? (
            <>
              <Countdown zeroPadTime={2} date={option?.idoContract?.closeTime} renderer={renderCountdownEnd} />
            </>
          ) : null}
          {(isSoldOut || optionStatus === OPTION_STATUS.CLOSED) && claimTimeAllowed !== undefined && claimTime ? (
            <Countdown zeroPadTime={2} date={claimTime} renderer={renderCountdownClaim} />
          ) : null}
        </td>
        <td>{!isNaN(staked) && account ? <Value className="break-words" value={staked} decimals={2} /> : null}</td>
        <td>
          {!isNaN(investmentBalance) && account ? (
            <Value className="break-words" value={investmentBalance} decimals={2} />
          ) : null}
        </td>
        <td>
          {!account ? (
            <Button className="color-blue1 px-2 px-sm-10" onClick={onToggleConnectModal}>
              Connect Wallet
            </Button>
          ) : (
            <div className="flex justify-center">
              {claimTimeAllowed && investmentBalance > 0 ? (
                <Button
                  color="primary"
                  className="text-blue2 mx-1"
                  onClick={handleClaim}
                  isLoading={pendingClaim}
                  disabled={
                    idoData?.claimed === true ||
                    (typeof idoData?.currentPeriod === 'number' && idoData?.currentPeriod <= idoData?.claimed)
                  }
                >
                  Claim
                </Button>
              ) : null}
              {!(claimTimeAllowed && investmentBalance > 0) &&
              (staked >= option?.poolContract?.stakingRequire || investmentBalance) &&
              optionStatus !== OPTION_STATUS.CLOSED ? (
                <Button
                  color="primary"
                  style={{
                    minWidth: 80,
                  }}
                  className="text-blue2 mx-1"
                  onClick={onBuyClick}
                  disabled={!userDataLoaded || isSoldOut}
                >
                  {isSoldOut ? 'Sold out' : 'Buy'}
                </Button>
              ) : null}
              {canUnStake && staked ? (
                <Button
                  color="primary"
                  style={{
                    minWidth: 80,
                  }}
                  className="text-blue2 mx-1"
                  onClick={handleUnStake}
                  isLoading={pendingUnStake}
                  disabled={pendingUnStake}
                >
                  Unstake
                </Button>
              ) : null}
              {staked < option?.poolContract?.stakingRequire &&
              !investmentBalance &&
              optionStatus !== OPTION_STATUS.CLOSED ? (
                <Button
                  color="primary"
                  style={{
                    minWidth: 80,
                  }}
                  className="text-blue2 mx-1"
                  onClick={() => setOpenModal({ open: true })}
                  disabled={disableStake}
                >
                  {isSoldOut ? 'Sold out' : 'Stake'}
                </Button>
              ) : null}
            </div>
          )}
        </td>
      </tr>
      {openModal?.open ? (
        <ModalStakeIDO
          title={openModal?.isInvest ? renderTitleModalBuy() : `Stake ${pool?.stakingToken?.symbol}`}
          max={openModal?.isInvest ? kaiBalance : dragonBalance}
          onDismiss={toggleStake}
          open={!!openModal}
          lpTokenName={openModal?.isInvest ? pool?.buyToken?.symbol : pool?.stakingToken?.symbol}
          isInvest={openModal?.isInvest}
          allowance={new BigNumber(idoUser?.allowances?.[index]) || BIG_ZERO}
          {...(openModal?.isInvest
            ? {
                minInvest,
                maxInvest,
                description: `You can buy between ${minInvest?.toLocaleString(undefined, {
                  maximumFractionDigits: 18,
                })} and ${maxInvest?.toLocaleString(undefined, { maximumFractionDigits: 18 })} ${
                  pool?.buyToken?.symbol
                }`,
                textNotEnoughBalance: `Your ${pool?.buyToken?.symbol} balance is not enough`,
                tokenPrice: option?.values?.pricePerToken?.number,
                tokenSymbol: token?.symbol,
                disabled: optionStatus !== OPTION_STATUS.ONGOING,
              }
            : {
                fixedValue: option?.poolContract?.stakingRequire,
                textNotEnoughBalance: `Your ${pool?.stakingToken?.symbol} balance is not enough`,
                unStakeTime: option?.unStakeTime,
              })}
          onConfirm={handleConfirm}
          onApprove={handleApprove}
          priceCurrency={openModal?.isInvest ? kaiPrice : dflPrice}
        />
      ) : null}
      {openWarning.open && (
        <ModalWarning toggleModal={toggleWarning} open={openWarning.open} content={openWarning.content} />
      )}
    </>
  )
}

export default OptionRow
