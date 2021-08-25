import classnames from 'classnames'
import QuestionHelper from 'components/QuestionHelper/index'
import { KAI_BLOCK_TIME } from 'config/index'
import useKardiachain from 'hooks/useKardiachain'
import Countdown, { zeroPad } from 'react-countdown'
import { useCurrentBlock } from 'store/block/hook'

const WithdrawalFeeTimer = ({ lastStakingBlock, blockPeriod }) => {
  const currentBlock = useCurrentBlock()

  const timer = (lastStakingBlock + blockPeriod - currentBlock) * KAI_BLOCK_TIME * 1000 + Date.now()

  const renderCountdown = ({ days, hours, minutes, completed }) => {
    if (completed) return <p className="mb-0">0d-0h-0m</p>

    return (
      <p className="ml-2">
        {zeroPad(days)}d-{zeroPad(hours)}h-{zeroPad(minutes)}m
      </p>
    )
  }
  return <Countdown zeroPadTime={2} date={timer} renderer={renderCountdown} />
}

const UnstakingFeeCountdownRow = ({ fees, lastStakingBlock, blockPeriod, stakedBalance, className }) => {
  const currentBlock = useCurrentBlock()
  const { account } = useKardiachain()

  const hasUnstakingFee = lastStakingBlock + blockPeriod > currentBlock && stakedBalance.gt(0)

  // The user has made a deposit, but has no fee
  const noFeeToPay = lastStakingBlock && !hasUnstakingFee && stakedBalance.gt(0)

  // Show the timer if a user is connected, has deposited, and has an unstaking fee
  const shouldShowTimer = Boolean(account && lastStakingBlock && hasUnstakingFee)

  const getRowText = () => {
    if (noFeeToPay) {
      return 'Unstaking Fee'
    }
    if (shouldShowTimer) {
      return 'unstaking fee until'
    }
    return 'unstaking fee if withdrawn within 72h'
  }

  if (!fees) return null

  return (
    <div className={classnames(className, 'flex mt-2 text-sm-md')}>
      <div className="flex items-center">
        {noFeeToPay ? '0' : fees}% {getRowText()}
        <QuestionHelper
          classNameToolTip="tooltip-center"
          text={
            <>
              <p>Unstaking fee: {fees}%</p>
              <p>
                Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every
                time you stake in the pool.
              </p>
            </>
          }
        />
      </div>
      {shouldShowTimer && <WithdrawalFeeTimer lastStakingBlock={lastStakingBlock} blockPeriod={blockPeriod} />}
    </div>
  )
}

export default UnstakingFeeCountdownRow
