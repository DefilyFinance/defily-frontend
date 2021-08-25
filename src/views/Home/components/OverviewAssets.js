import { useRewardsDistributed } from '../../../hooks/useRewardPerBlock'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useBurnedBalance, useBurnedDeadBalance, useTreasury } from '../../../hooks/useTokenBalance'
import { useDflPrice, useKaiPrice } from '../../../hooks/usePrice'
import useTotalValueLocked from '../../../hooks/useTotalValueLocked'
import Carousel from 'react-multi-carousel'
import Value from '../../../components/Value/Value'

const OverviewAssets = () => {
  const rewardsDistributed = useRewardsDistributed()
  const burnedBalance = getBalanceNumber(useBurnedBalance())
  const burnedDeadBalance = getBalanceNumber(useBurnedDeadBalance())
  const totalCirculation = rewardsDistributed.gt(0) ? rewardsDistributed - burnedBalance - burnedDeadBalance : 0
  const defilyTreasury = getBalanceNumber(useTreasury())
  const dflPrice = useDflPrice()
  const totalValueLocked = useTotalValueLocked()
  const data = [
    {
      text: 'Circulating Supply',
      value: totalCirculation,
      decimals: 0,
      unit: ' DFL',
    },
    {
      text: 'Defily DAO Treasury',
      value: defilyTreasury,
      decimals: 0,
      unit: ' DFL',
    },
    {
      text: 'Defily Price',
      value: dflPrice,
      decimals: 3,
      prefix: '$',
    },
    {
      text: 'Total Value Locked',
      value: totalValueLocked.toNumber() ? totalValueLocked?.toNumber() : undefined,
      decimals: 0,
      prefix: '$',
    },
    {
      text: 'DFL Distributed',
      value: rewardsDistributed.toNumber() ? rewardsDistributed.toNumber() : undefined,
      decimals: 0,
      unit: ' DFL',
    },
    {
      text: 'DFL Burned',
      value: burnedBalance ? burnedBalance : undefined,
      decimals: 0,
      unit: ' DFL',
    },
    {
      text: 'Market Cap',
      value: totalCirculation && dflPrice ? totalCirculation * dflPrice : undefined,
      decimals: 0,
      prefix: '$',
    },
  ]

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    desktop1: {
      breakpoint: { max: 1024, min: 992 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    desktop2: {
      breakpoint: { max: 992, min: 768 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 768, min: 578 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 578, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }

  return (
    <div
      // style={{
      //   background: '#00192C',
      // }}
      className="pt-14 pb-10"
    >
      <div className="container max-w-screen-lg-xl mx-auto wrap-slice-show">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={7000}
          autoPlay={true}
          centerMode={false}
          showDots={false}
          containerClass="container-with-dots"
          draggable
          focusOnSelect={false}
          infinite
          keyBoardControl
          minimumTouchDrag={80}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={responsive}
          swipeable
        >
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                height: 120,
              }}
              className="text-center flex flex-row items-center justify-center"
            >
              <div>
                <p className="text-white text-sm-md mb-2">{item?.text}</p>
                {item?.value ? (
                  <Value
                    className="text-primary text-2xl font-bold"
                    prefix={item?.prefix}
                    unit={item?.unit}
                    value={item?.value}
                  />
                ) : (
                  <span className="text-primary text-2xl font-bold">--</span>
                )}
                <div className="flex flex-row justify-center mt-4">
                  <p
                    className="bg-primary"
                    style={{
                      width: 65,
                      height: 3,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default OverviewAssets
