import Card from 'components/Card/Card'
import { DEFAULT_TOKEN_IDO } from 'constants/index'
import { useMemo, useState } from 'react'
import SocialLinks from 'views/Lands/components/SocialLinks'
import Badge from 'views/Lands/components/Badge'
import Countdown, { zeroPad } from 'react-countdown'
import Button from 'components/Button/Button'
import useKardiachain from 'hooks/useKardiachain'
import { useModalWalletConnect } from 'store/modal/hooks'
import BoxCounter from './BoxCounter'
import { NavItem, TabContent, TabPane, Tabs } from 'components/Tabs/Tabs'
import ProjectDetail from './ProjectDetail'
import Allocation from './Allocation'
import PropTypes from 'prop-types'
import SaleOptions from './SaleOptions'
import useRefresh from 'hooks/useRefresh'

const STATUS_TIME = {
  open: 'open',
  ongoing: 'ongoing',
  opening: 'opening',
  end: 'end',
}

const Detail = ({ pool }) => {
  const { account } = useKardiachain()
  const { onToggleConnectModal } = useModalWalletConnect()
  const { fastRefresh } = useRefresh()
  const [tab, setTab] = useState(1)

  const timer = useMemo(() => {
    if (!pool?.options) return undefined

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

  const onChangeTab = (value) => {
    if (value !== tab) {
      setTab(value)
    }
  }

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
      <div className="flex mt-2">
        <Badge className="flex justify-start items-center">
          <div className="rounded-50 p-1 mr-1 bg-primary mr-2" />
          {timer?.status === STATUS_TIME.ongoing ? 'Close in ' : 'Opens in '}
          {zeroPad(days)}d {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s
        </Badge>
      </div>
    )
  }
  return (
    <Card className="my-20">
      <div
        className="px-4 sm:px-8 pt-8 mt-8 bg-cover sm:bg-contain sm:bg-right"
        style={{
          backgroundImage: 'url(/images/Lightning-Dragons.png)',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid sm:grid-cols-2">
          <div>
            <div className="flex flex-col items-center sm:items-start ">
              <div className="block md:flex items-center mb-7">
                <div className="rounded-50 bg-blue2 flex justify-center items-center w-20 h-20  m-auto md:mx-0">
                  <img
                    alt="logo"
                    src={pool?.img}
                    style={{
                      maxWidth: '3.5rem',
                      maxHeight: '3.5rem',
                    }}
                    className="w-14"
                  />
                </div>
                <div>
                  <h3 className="text-center md:text-left text-2xl ml-0 md:ml-3 font-bold text-primary mt-3 md:mt-0 background-opacity-base-xs sm:bg-transparent p-2 sm:p-0 rounded-lg">
                    {pool?.name}
                  </h3>
                </div>
              </div>

              <SocialLinks data={pool?.socialLink} className="flex mt-1.5" />
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
              {/*<Countdown zeroPadTime={2} date={timer} renderer={rendererStartIn} />*/}
              <div className="mt-1">
                <Badge>{DEFAULT_TOKEN_IDO}</Badge>
              </div>
            </div>
            <p className="text-white mt-5 text-md background-opacity-base-xs sm:bg-transparent p-2 sm:p-0 rounded">
              {pool?.content}
            </p>
            <div className="flex my-5">
              {!account ? (
                <Button className="color-blue1 px-2 px-sm-10" onClick={onToggleConnectModal}>
                  Connect Wallet
                </Button>
              ) : (
                <>
                  <Button
                    className="text-blue2 ml-3 px-sm-14"
                    color="primary"
                    onClick={() => onChangeTab(3)}
                    style={{
                      minWidth: 150,
                    }}
                  >
                    Buy
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center sm:justify-end items-end">
            <BoxCounter pool={pool} />
          </div>
        </div>
        <Tabs>
          <NavItem active={tab === 1} onClick={() => onChangeTab(1)}>
            Sale options
          </NavItem>
          <NavItem active={tab === 2} onClick={() => onChangeTab(2)}>
            Project details
          </NavItem>
          <NavItem active={tab === 3} onClick={() => onChangeTab(3)}>
            Your Allocation
          </NavItem>
        </Tabs>
      </div>
      <TabContent className="p-4 sm:px-8 pb-10" activeTab={tab}>
        <TabPane tabId={1}>
          <SaleOptions pool={pool} actionBuy={() => onChangeTab(3)} />
        </TabPane>
        <TabPane tabId={2}>
          <ProjectDetail pool={pool} />
        </TabPane>
        <TabPane tabId={3}>
          <Allocation />
        </TabPane>
      </TabContent>
    </Card>
  )
}

Detail.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default Detail
