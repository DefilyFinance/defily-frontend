import Card from 'components/Card/Card'
import { KAI_BLOCK_TIME } from 'config/index'
import Countdown, { zeroPad } from 'react-countdown'
import { useCurrentBlock } from 'store/block/hook'

const StartCountdown = () => {
  const currentBlock = useCurrentBlock()
  const startBlock = 3859385
  const timer = (startBlock - currentBlock) * KAI_BLOCK_TIME * 1000 + Date.now()

  const rendererTimer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <div />
    } else {
      // Render a countdown
      return (
        <Card className="py-3 mx-auto w-full max-w-xs text-white text-center mb-4">
          <p className="text-xl">Rewards start in</p>
          <span className="text-xl font-bold">
            {zeroPad(hours)}h - {zeroPad(minutes)}m - {zeroPad(seconds)}s
          </span>
        </Card>
      )
    }
  }

  return <Countdown zeroPadTime={2} date={timer} renderer={rendererTimer} />
}

export default StartCountdown
