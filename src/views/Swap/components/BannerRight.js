import { useMemo, useState } from 'react'
import classnames from 'classnames'
import Countdown, { zeroPad } from 'react-countdown'
import Value from '../../../components/Value/Value'
import Button from '../../../components/Button/Button'
import { useCastlesNoAccount } from 'store/castles/hook'
import useRefresh from '../../../hooks/useRefresh'
import { useCurrentBlock } from 'store/block/hook'
import { getPoolBlockInfoStake } from '../../Castles/helpers'
import { KAI_BLOCK_TIME } from 'config/index'
import useInterval from '../../../hooks/useInterval'
import { useHistory } from 'react-router-dom'

const STATUS_POOL = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  END: 'END',
}

const DEFAULT_ID = 22
const BannerRight = ({}) => {
  const pools = useCastlesNoAccount()
  const history = useHistory()
  const currentBlock = useCurrentBlock()
  const { fastRefresh } = useRefresh()

  const [status, setStatus] = useState(STATUS_POOL.UPCOMING)
  const pool = useMemo(() => {
    return pools?.find((item) => item?.sousId === DEFAULT_ID)
  }, [pools, fastRefresh, currentBlock])
  const { blocksRemaining, blocksToDisplay } = getPoolBlockInfoStake(pool, currentBlock)

  const timer = useMemo(() => {
    return blocksToDisplay * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksToDisplay])

  const timerStakingEnd = useMemo(() => {
    return blocksRemaining * KAI_BLOCK_TIME * 1000 + Date.now()
  }, [blocksRemaining])

  useInterval(() => {
    const now = Date.now()
    let _status = undefined
    if (timer > now) {
      _status = STATUS_POOL.UPCOMING
    } else if (timer < now && timerStakingEnd > now) {
      _status = STATUS_POOL.ONGOING
    } else {
      _status = STATUS_POOL.END
    }
    if (_status !== status) {
      setStatus(_status)
    }
  }, 1000)

  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return null

    return (
      <span className="text-xl font-bold text-primary">
        {days > 0 ? `${zeroPad(days)}d-` : ''}
        {zeroPad(hours)}h-{zeroPad(minutes)}m-{zeroPad(seconds)}s
      </span>
    )
  }

  if (!pool || status === STATUS_POOL.END) return null

  return (
    <div
      className={classnames(
        'bg-blue1 text-center p-6 px-4 rounded border-2 border-primary mb-2 w-full sm:px-5 xl:px-8',
      )}
      style={{
        maxWidth: 400,
      }}
    >
      <h2 className="text-white font-bold mb-3 text-lg">IFO Launchpad</h2>
      {status === STATUS_POOL.UPCOMING ? (
        <>
          <p className={classnames('text-white text-sm-md xl:text-base')}>Tokens release in</p>
          <Countdown zeroPadTime={2} date={timer} renderer={renderCountdown} />
        </>
      ) : null}
      {status === STATUS_POOL.ONGOING ? (
        <>
          <p className={classnames('text-white text-sm-md xl:text-base')}>Ends in</p>
          <Countdown zeroPadTime={2} date={timerStakingEnd} renderer={renderCountdown} />
        </>
      ) : null}
      <hr className="my-3" />
      <p className={classnames('text-white text-sm-md xl:text-base text-sm-md xl:text-base')}>Total Sale</p>
      <div className="text-xl font-bold text-primary">
        <Value value={100000000} decimals={0} unit=" CHAT" />
      </div>
      <hr className="my-3" />
      <p className={classnames('text-white text-sm-md xl:text-base')}>Total Value Locked</p>
      <div className="text-xl font-bold text-primary">
        <Value prefix="$" value={pool.stakedTvl ? +pool.stakedTvl : 0} />
      </div>

      <div className="flex justify-center mt-3">
        <Button onClick={() => history.push('/castles')}>Join IFO</Button>
      </div>
    </div>
  )
}

export default BannerRight
