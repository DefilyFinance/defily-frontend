import { KAI_BLOCK_TIME } from 'config/index'
import Countdown, { zeroPad } from 'react-countdown'
import { getPoolBlockInfo } from 'views/Castles/helpers'
import PropTypes from 'prop-types'

const TimerCell = ({ pool }) => {
  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return null

    return (
      <>
        {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </>
    )
  }

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, pool.currentBlock)

  const timer = blocksToDisplay * KAI_BLOCK_TIME * 1000 + Date.now() + 60000

  return (
    <div>
      {pool.lpAddress || !shouldShowBlockCountdown ? (
        'N/A'
      ) : (
        <>
          <p>{hasPoolStarted ? 'Ends in' : 'Starts in'}</p>
          <div className="flex items-center">
            {(blocksRemaining || blocksUntilStart) && pool.currentBlock ? (
              <Countdown zeroPadTime={2} date={timer} renderer={renderCountdown} />
            ) : (
              '...'
            )}
          </div>
        </>
      )}
    </div>
  )
}

TimerCell.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default TimerCell
