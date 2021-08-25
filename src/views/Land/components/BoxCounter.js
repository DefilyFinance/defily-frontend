import { useState } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import { useLandFromIdoId } from 'store/lands/hook'
import { useHistory, useParams } from 'react-router-dom'
import Value from 'components/Value/Value'
import useInterval from '../../../hooks/useInterval'
import Button from '../../../components/Button/Button'
import classnames from 'classnames'

const STATUS_TIME = {
  open: 'open',
  ongoing: 'ongoing',
  opening: 'opening',
  end: 'end',
}

const BoxCounter = ({ activeId }) => {
  const history = useHistory()
  const { id } = useParams()
  const pool = useLandFromIdoId(activeId || id)
  const options = pool?.options?.data || []
  const participants = pool?.participants
  const [timeActive, setTimeActive] = useState(null)
  const isBannerSwap = typeof activeId !== 'undefined'
  useInterval(() => {
    if (options?.length) {
      let timer = undefined
      let timeClose = undefined
      const optionNow = pool.options.data
        .filter((option) => option.idoContract.closeTime > Date.now())
        .find((option) => option.idoContract.openTime > Date.now() || option.idoContract.closeTime < Date.now())
      if (optionNow) {
        const status = optionNow.idoContract.openTime > Date.now() ? STATUS_TIME.open : STATUS_TIME.opening
        timer = {
          status: status,
          time: optionNow.idoContract.openTime,
        }
      } else {
        timeClose = pool.options.data
          .filter((option) => option.idoContract.closeTime > Date.now())
          .reduce(
            (a, b) => (!a?.idoContract?.closeTime || b?.idoContract?.closeTime > a?.idoContract?.closeTime ? b : a),
            undefined,
          )
        if (timeClose) {
          timer = {
            status: STATUS_TIME.ongoing,
            time: timeClose?.idoContract?.closeTime,
          }
        }
      }
      if (!optionNow && !timeClose) {
        timer = { status: STATUS_TIME.end }
      }
      if (timer?.time !== timeActive?.time || timer?.status !== timeActive?.status) {
        setTimeActive(timer)
      }
    } else {
      if (timeActive !== undefined) {
        setTimeActive(undefined)
      }
    }
  }, 1000)
  const rendererStartIn = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p className="text-center text-gray-400 font-black text-xl">Closed</p>
    } else {
      return (
        <>
          <p className="text-primary text-xl font-bold">
            {zeroPad(days)}d - {zeroPad(hours)}h - {zeroPad(minutes)}m - {zeroPad(seconds)}s
          </p>
        </>
      )
    }
  }

  return (
    <div
      className={classnames(
        'bg-blue1 text-center p-6 px-4 rounded border-2 border-primary mb-2 w-full',
        {
          'sm:px-10 md:px-20': !isBannerSwap,
        },
        {
          'sm:px-5 xl:px-8': isBannerSwap,
        },
      )}
      style={{
        maxWidth: 400,
      }}
    >
      {isBannerSwap ? <h2 className="text-white font-bold mb-3 text-lg">IDO Launchpad</h2> : null}
      {timeActive?.status && ![STATUS_TIME.ongoing, STATUS_TIME.end].includes(timeActive?.status) ? (
        <p className={classnames('text-white', { 'text-sm-md xl:text-base': isBannerSwap })}>
          First Come First Serve opens in
        </p>
      ) : null}
      {timeActive?.status && timeActive?.status === STATUS_TIME.ongoing ? (
        <p className={classnames('text-white', { 'text-sm-md xl:text-base': isBannerSwap })}>IDO close in</p>
      ) : null}
      {timeActive?.time ? (
        <Countdown zeroPadTime={2} date={timeActive?.time} renderer={rendererStartIn} />
      ) : timeActive === null ? (
        <p className="text-center text-white font-black text-xl">...</p>
      ) : null}
      {timeActive?.status === STATUS_TIME.end ? (
        <p className="text-center text-white font-black text-xl">IDO closed</p>
      ) : null}
      <hr className="my-3" />
      <p className={classnames('text-white', { 'text-sm-md xl:text-base': isBannerSwap })}>Allocation round</p>
      <div className="text-xl font-bold text-primary">
        {participants?.isLoaded ? (
          <Value
            className="text-xl font-bold text-primary"
            value={participants?.holders}
            decimals={0}
            unit=" Participants"
          />
        ) : (
          <span>-- Participants</span>
        )}
      </div>
      <hr className="my-3" />
      <p className={classnames('text-white', { 'text-sm-md xl:text-base': isBannerSwap })}>Total DRAGON Staked</p>
      <div className="text-xl font-bold text-primary">
        {participants?.isLoaded ? (
          <Value
            className="text-xl font-bold text-primary"
            value={Math.floor(participants?.totalBalance / 10) * 10}
            decimals={2}
          />
        ) : (
          <span>--</span>
        )}
      </div>

      {isBannerSwap ? (
        <div className="flex justify-center mt-3">
          <Button onClick={() => history.push(`/ido-detail/${activeId}`)}>Join IDO</Button>
        </div>
      ) : null}
    </div>
  )
}

export default BoxCounter
