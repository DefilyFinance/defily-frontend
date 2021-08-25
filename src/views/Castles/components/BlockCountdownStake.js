import { KAI_BLOCK_TIME } from 'config/index'
import { useMemo } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import { Clock } from 'react-feather'
import { useCurrentBlock } from 'store/block/hook'
import { getPoolBlockInfoStake } from 'views/Castles/helpers'
import PropTypes from 'prop-types'

const BlockCountdownStake = ({ pool, isIfo }) => {
  const currentBlock = useCurrentBlock()
  const {
    shouldShowBlockCountdown,
    blocksUntilStake,
    blocksRemaining,
    hasPoolStaked,
    blocksToDisplay,
    shouldShowBlockCountdownUnStaking,
    blocksUntilUnStaking,
  } = getPoolBlockInfoStake(pool, currentBlock)

  const timer = useMemo(() => {
    return blocksToDisplay * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksToDisplay])

  const timerStakingStart = useMemo(() => {
    return blocksUntilStake * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksUntilStake])

  const timerStakingEnd = useMemo(() => {
    return blocksRemaining * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksRemaining])

  const timerBlockUnstaking = useMemo(() => {
    return blocksUntilUnStaking * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksUntilUnStaking])

  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return null

    return (
      <>
        {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </>
    )
  }

  return (
    <>
      {shouldShowBlockCountdown && !isIfo && (
        <div className="flex justify-between items-center mb-1 text-white">
          <p>
            {hasPoolStaked
              ? `${isIfo ? 'Buy-in open until' : 'Staking is open until'}`
              : `${isIfo ? 'Buy-in starts in' : 'Staking starts in'}`}
          </p>
          <div className="flex items-center">
            {(blocksRemaining || blocksUntilStake) && currentBlock ? (
              <Countdown zeroPadTime={2} date={timer} renderer={renderCountdown} />
            ) : (
              '...'
            )}
            <Clock className="ml-1" size={18} />
          </div>
        </div>
      )}
      {/*{shouldShowBlockCountdown && (*/}
      {/*  <div className="flex justify-between items-center mb-1 text-white">*/}
      {/*    <p>Buy-in ends in</p>*/}
      {/*    <div className="flex items-center">*/}
      {/*      {(blocksRemaining || blocksUntilStake) && currentBlock ? (*/}
      {/*        <Countdown zeroPadTime={2} date={timerStakingEnd} renderer={renderCountdown} />*/}
      {/*      ) : (*/}
      {/*        '...'*/}
      {/*      )}*/}
      {/*      <Clock className="ml-1" size={18} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      {shouldShowBlockCountdownUnStaking && !isIfo && (
        <div className="flex justify-between items-center mb-1 text-white">
          <p>Unstake open in</p>
          <div className="flex items-center">
            {blocksUntilUnStaking && currentBlock ? (
              <Countdown zeroPadTime={2} date={timerBlockUnstaking} renderer={renderCountdown} />
            ) : (
              '...'
            )}
            <Clock className="ml-1" size={18} />
          </div>
        </div>
      )}
    </>
  )
}

BlockCountdownStake.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default BlockCountdownStake
