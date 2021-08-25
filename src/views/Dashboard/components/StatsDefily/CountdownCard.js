import Card from 'components/Card/Card'
import { START_BLOCK } from 'config/index'
import useRefresh from 'hooks/useRefresh'
import { useMemo } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import { useCurrentBlock } from 'store/block/hook'
import PropTypes from 'prop-types'

const CountdownContent = ({ children, title }) => {
  return (
    <Card className="py-8 px-10 max-w-xl mb-10">
      <div className="flex flex-col justify-between h-full">
        <p className="text-primary text-4xl font-bold">{title || ''}</p>
        <p className="text-white text-4xl font-bold">{children}</p>
      </div>
    </Card>
  )
}

CountdownContent.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
}

const CountdownCard = () => {
  const { fastRefresh } = useRefresh()
  const currentBlock = useCurrentBlock()

  const farmsEnd = useMemo(() => {
    const startReward = (START_BLOCK - currentBlock) * 5 * 1000 + Date.now() + 60000
    return startReward + 2592000000
  }, [currentBlock, fastRefresh])

  const farmsEndV2 = useMemo(() => {
    return farmsEnd + 2592000000
  }, [farmsEnd, fastRefresh])

  const farmsEndV3 = useMemo(() => {
    return farmsEndV2 + 2592000000
  }, [farmsEndV2, fastRefresh])

  const rendererEndFarms = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <div />
    } else {
      // Render a countdown
      return (
        <>
          {zeroPad(days)}d - {zeroPad(hours)}h - {zeroPad(minutes)}m - {zeroPad(seconds)}s
        </>
      )
    }
  }

  return (
    <CountdownContent title="Next halving in">
      {currentBlock ? (
        <>
          {farmsEndV2 <= Date.now() ? (
            <Countdown zeroPadTime={2} date={farmsEndV3} renderer={rendererEndFarms} />
          ) : (
            <Countdown zeroPadTime={2} date={farmsEndV2} renderer={rendererEndFarms} />
          )}
        </>
      ) : (
        '...'
      )}
    </CountdownContent>
  )
}

export default CountdownCard
