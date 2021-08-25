import Card from 'components/Card/Card'
import useRefresh from 'hooks/useRefresh'
import React, { useMemo } from 'react'
import SocialLinks from './SocialLinks'
import Countdown, { zeroPad } from 'react-countdown'
import Progress from 'components/Progress/Progress'
import Badge from './Badge'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import Value from '../../../components/Value/Value'

const STATUS_TIME = {
  open: 'open',
  ongoing: 'ongoing',
  opening: 'opening',
  end: 'end',
}

const ProjectCard = ({ pool }) => {
  const history = useHistory()
  const { fastRefresh } = useRefresh()
  const timer = useMemo(() => {
    if (!pool?.date && !pool.options.data) return undefined

    if (pool?.date)
      return {
        status: STATUS_TIME.open,
        time: pool.date,
      }

    const optionNow = pool.options.data
      .filter((option) => option.idoContract.closeTime > Date.now())
      .find((option) => option.idoContract.openTime > Date.now() || option.idoContract.closeTime < Date.now())
    if (optionNow) {
      const status = optionNow.idoContract.openTime > Date.now() ? STATUS_TIME.open : STATUS_TIME.opening
      return {
        status: status,
        time: optionNow.idoContract.openTime,
      }
    }
    const timeClose = pool.options.data
      .filter((option) => option.idoContract.closeTime > Date.now())
      .reduce(
        (a, b) => (!a?.idoContract?.closeTime || b?.idoContract?.closeTime > a?.idoContract?.closeTime ? b : a),
        undefined,
      )
    if (timeClose) {
      return {
        status: STATUS_TIME.ongoing,
        time: timeClose?.idoContract?.closeTime,
      }
    }
    return { status: STATUS_TIME.end }
  }, [pool, fastRefresh])

  const totalSupply = useMemo(() => {
    if (!pool?.options?.data?.length) return undefined
    return pool?.options?.data?.reduce((accumulator, current) => accumulator + current?.idoContract?.totalSupply, 0)
  }, [pool, fastRefresh])

  const totalCap = useMemo(() => {
    if (!pool?.options?.data?.length) return undefined
    return pool?.options?.data?.reduce((accumulator, current) => accumulator + current?.idoContract?.hardCap, 0)
  }, [pool, fastRefresh])

  const totalTokenSold = useMemo(() => {
    if (!pool?.totalCollecteds?.length) return undefined
    return pool?.totalCollecteds?.reduce((accumulator, current, index) => {
      return accumulator + current / pool?.options?.data?.[index]?.values?.pricePerToken?.number
    }, 0)
  }, [pool, fastRefresh])

  const optionIdo = useMemo(() => {
    if (!pool?.date && !pool.options.data) return undefined
    const { defaultSwapRate } = pool
    const optionNow = pool.options.data
      .filter((option) => option.idoContract.closeTime > Date.now())
      .find((option) => option.idoContract.openTime > Date.now() || option.idoContract.closeTime < Date.now())

    if (optionNow) {
      return {
        price: optionNow?.values?.pricePerToken?.number,
        decimals: optionNow?.values?.pricePerToken?.decimals,
        unit: optionNow?.values?.pricePerToken?.unit,
        softCap: optionNow?.idoContract?.softCap,
        hardCap: optionNow?.idoContract?.hardCap,
        index: optionNow?.index,
      }
    }

    const timeClose = pool.options.data
      .filter((option) => option.idoContract.closeTime > Date.now())
      .reduce(
        (a, b) => (!a?.idoContract?.closeTime || b?.idoContract?.closeTime > a?.idoContract?.closeTime ? b : a),
        undefined,
      )
    if (timeClose) {
      return {
        price: timeClose?.values?.pricePerToken?.number,
        decimals: timeClose?.values?.pricePerToken?.decimals,
        unit: timeClose?.values?.pricePerToken?.unit,
        softCap: timeClose?.idoContract?.softCap,
        hardCap: timeClose?.idoContract?.hardCap,
        index: timeClose?.index,
      }
    }

    return { status: STATUS_TIME.end, ...defaultSwapRate }
  }, [pool, fastRefresh])

  const rendererStartIn = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="flex mt-2 justify-center sm:justify-start">
          <Badge className="flex justify-start items-center text-red-600 bg-red-opacity-25">
            <div className="rounded-50 p-1 mr-1 bg-red-600 mr-2" />
            Close
          </Badge>
        </div>
      )
    }

    return (
      <div className="flex mt-2 justify-center sm:justify-start">
        <Badge className="flex justify-start items-center">
          <div className="rounded-50 p-1 mr-1 bg-primary mr-2" />
          {timer?.status === STATUS_TIME.ongoing ? 'Close in ' : 'Opens in '}
          {zeroPad(days)}d {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s
        </Badge>
      </div>
    )
  }

  const navigateToDetail = () => {
    if (pool?.options?.data?.length) {
      history.push(`/ido-detail/${pool?.slug || pool.idoId}`)
    }
  }

  return (
    <div
      onClick={navigateToDetail}
      className="col-span-2 w-96 max-w-full sm:w-full mx-auto relative z-20 cursor-pointer border-2 border-blue1 hover:border-primary rounded-xl"
    >
      <Card className="p-5 h-full flex flex-col justify-between">
        <div>
          <figure className="block sm:flex items-center">
            <div className="rounded-50 bg-blue2 flex justify-center items-center w-20 h-20 my-6 mx-auto sm:mx-6 sm:ml-1.5">
              <img
                alt="logo"
                src={pool?.img}
                style={{
                  maxWidth: '3.5rem',
                  maxHeight: '3.5rem',
                }}
                className="w-14 cursor-pointer"
              />
            </div>
            <figcaption className="flex-1 ">
              <h3 className="text-primary text-xl font-bold text-center sm:text-left">{pool.name}</h3>
              <SocialLinks
                data={pool?.socialLink || []}
                className="relative z20 flex mt-1.5 justify-center sm:justify-start"
              />
              {timer ? (
                <>
                  {[STATUS_TIME.open, STATUS_TIME.ongoing].includes(timer?.status) ? (
                    <Countdown zeroPadTime={2} date={timer.time} renderer={rendererStartIn} />
                  ) : (
                    <div className="flex mt-2 justify-center sm:justify-start">
                      <Badge className="flex justify-start items-center">
                        <div className="rounded-50 p-1 mr-1 bg-primary mr-2" />
                        {timer.status === STATUS_TIME.opening ? 'Open' : 'End'}
                      </Badge>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex mt-2 justify-center sm:justify-start">
                  <Badge className="flex justify-start items-center">
                    <div className="rounded-50 p-1 mr-1 bg-primary mr-2" />
                    Opens in TBA
                  </Badge>
                </div>
              )}
              <div className="mt-1 text-center sm:text-left">
                <Badge>{pool?.buyToken.symbol}</Badge>
              </div>
            </figcaption>
          </figure>
          <p className="text-white text-md my-2 content-intro-project">{pool?.content}</p>
        </div>
        <div>
          <div className="flex flex-wrap flex-4 mt-7">
            <div className="w-full lg:w-2/4">
              <p className="text-sm-md text-white mb-1">Swap rate</p>
              <div className="font-bold text-primary text-base">
                {optionIdo.price ? (
                  <Value
                    className="inline"
                    value={optionIdo.price}
                    decimals={optionIdo.decimals}
                    unit={` ${optionIdo?.unit} per ${pool.tokenInfo.symbol}`}
                  />
                ) : (
                  'TBA'
                )}
              </div>
            </div>
            <div className="w-1/2 lg:w-1/4">
              <p className="text-sm-md text-white text-left lg:text-center mb-1">Cap</p>
              <div className="font-bold text-primary text-base text-left lg:text-center">
                {totalCap ? (
                  <Value className="inline" value={totalCap} decimals={0} unit={` ${pool?.buyToken?.symbol}`} />
                ) : (
                  'TBA'
                )}
              </div>
            </div>
            <div className="w-1/2 lg:w-1/4">
              <p className="text-sm-md text-white text-right mb-1">Access</p>
              <p className="font-bold text-primary text-base text-right">Public</p>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-sm-md text-white mb-1">Progress</p>
            <Progress percent={(totalSupply ? totalTokenSold / totalSupply : 0) * 100} />
            <div className="flex justify-between mt-0.5">
              <span className="text-white text-sm-md font-normal">
                {totalSupply && typeof totalTokenSold === 'number' ? (
                  <Value className="inline" value={(totalTokenSold / totalSupply) * 100} decimals={2} />
                ) : (
                  '0.00'
                )}{' '}
                %
              </span>
              <span className="text-white text-sm-md font-normal">
                {totalSupply && typeof totalTokenSold === 'number' ? (
                  <>
                    <Value className="inline" value={totalTokenSold || 0} decimals={2} /> /{' '}
                    <Value className="inline" value={totalSupply} decimals={2} /> {pool?.token?.symbol}
                  </>
                ) : (
                  '0.0000/TBA'
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

ProjectCard.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default ProjectCard
