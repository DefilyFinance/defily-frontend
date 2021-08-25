import { KAI_BLOCK_TIME } from 'config/index'
import { useMemo } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import { Clock } from 'react-feather'
import { useCurrentBlock } from 'store/block/hook'
import { getPoolBlockInfo } from 'views/Castles/helpers'
import PropTypes from 'prop-types'

const BlockCountdown = ({ pool, isIfo }) => {
  const currentBlock = useCurrentBlock()
  const {
    shouldShowBlockCountdown,
    blocksUntilStart,
    blocksRemaining,
    hasPoolStarted,
    blocksToDisplay,
    durationDisplay,
  } = getPoolBlockInfo(pool, currentBlock)

  const timer = useMemo(() => {
    return blocksToDisplay * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksToDisplay])

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
      {shouldShowBlockCountdown && (
        <div className="flex justify-between items-center mb-1 text-white">
          <p>
            {hasPoolStarted
              ? `${isIfo ? 'Distribution ends in' : 'Rewards end in'}`
              : `${isIfo ? 'Distribution starts in' : 'Rewards start in'}`}
          </p>
          <div className="flex items-center">
            {(blocksRemaining || blocksUntilStart) && currentBlock ? (
              <Countdown zeroPadTime={2} date={timer} renderer={renderCountdown} />
            ) : (
              '...'
            )}
            <Clock className="ml-1" size={18} />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-1 text-white">
        <p>{isIfo ? 'Distribution Period' : 'Duration'}</p>
        <p>{durationDisplay ? durationDisplay : '...'} days</p>
      </div>
    </>
  )
}

BlockCountdown.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default BlockCountdown
