import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel'

const Introductions = () => {
  const data = [
    {
      bg: '/images/bg-intro-vault.png',
      id: 'box-detail-intro',
      section: 'Vaults',
      title: 'Yield Aggregators',
      route: '/vaults',
      content:
        'Defily Smart Vaults aggregate yield farming opportunities accross different platforms and automate compounding and farming actions to give the best interests for everyone.',
    },
    {
      bg: '/images/bg-intro-swap.png',
      section: 'Swap',
      route: '/swap',
      title: 'Automated Market Making',
      content:
        'Defily Swap allows people to swap seamlessly between tokens, along with adding, removing and zapping liquidity in the most user-friendly way.',
    },
    {
      bg: '/images/bg-intro-stake.png',
      section: 'Stake',
      route: '/castles',
      title: 'Stake to earn',
      content: 'Defily Staking Protocol brings people opportunities to earn more tokens by staking another token.',
    },
    {
      bg: '/images/bg-intro-earn.png',
      section: 'Earn',
      route: '/farms',
      title: 'Yield Farming',
      content:
        'Yield Farming from Defily farm and partners’ mini-farm allows people to provide liquidity to AMMs and deposit LP tokens to Defily to generate yield and earn DFL as rewards.',
    },
    {
      bg: '/images/bg-intro-dao.png',
      section: 'DAO',
      url: 'https://vote.defily.io/#/defily',
      title: 'Community rules everything',
      content:
        'The whole is greater than the sum of all parts. Defily DAO turns Defily into a fully community driven project, built and run for its people.',
    },
    {
      bg: '/images/bg-intro-ido.png',
      section: 'IDO',
      route: '/ido',
      title: 'Decentralize capital raising',
      content:
        'Defily IDO is a Lauchpad built for cross-chain token pools and auctions, enabling projects to raise capital on a decentralized and interoperable approach.',
    },
    {
      bg: '/images/bg-intro-pool.png',
      section: 'Pools',
      route: '/pools',
      title: 'Your DeFi Home',
      content: 'Defily Pools tracks all DeFi opportunities and help you choose the most suitable one.',
    },
    {
      bg: '/images/bg-intro-play.png',
      section: 'Play',
      route: '/battles',
      title: 'Play to earn',
      content: 'Games allow people to play to earn tokens.',
    },
  ]

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 578, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }
  return (
    <div id="box-detail-intro" className="wrap-slice-show max-w-screen-2xl m-auto">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={5000}
        autoPlay={true}
        centerMode={false}
        showDots={true}
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
        {data.map((item, index) => {
          const contentLeft = index % 2
          const TagLink = item?.route ? Link : 'a'
          return (
            <div
              key={index}
              style={{
                backgroundImage: `url(${item?.bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
              className={classnames(
                'flex items-center bg-center max-w-screen-2xl mx-auto slide-home-intro',
                contentLeft ? 'bg-right' : 'bg-left',
              )}
            >
              <div className="container max-w-screen-lg-xl mx-auto h-full">
                <div className="grid grid-cols-1 md:grid-cols-10">
                  {!contentLeft ? <div className="md:col-span-3 lg:col-span-5" /> : null}
                  <div className="md:col-span-7 lg:col-span-5 flex flex-row item-center justify-center md:justify-start lg:justify-center">
                    <div>
                      <div className="flex justify-center">
                        <TagLink
                          className="border-4 sm:border-8 rounded border-primary text-primary text-3xl md:text-4xl lg:text-5-xl text-center px-5 py-2 sm:px-20 sm:py-6  cursor-pointer bg-btn-home"
                          {...(item?.route
                            ? {
                                to: item?.route,
                              }
                            : {
                                href: item?.url,
                              })}
                        >
                          {item?.section}
                        </TagLink>
                      </div>

                      <div className="text-white sm:text-primary text-md background-opacity-base-xs sm:bg-transparent p-3 sm:p-0 rounded-lg mt-5 sm:mt-10 mx-2">
                        <p className="mb-5 text-center font-bold text-xl">{item?.title}</p>
                        <div className="flex flex-row justify-center">
                          <p
                            className="text-center px-2"
                            style={{
                              maxWidth: 410,
                            }}
                          >
                            {item?.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Carousel>
    </div>
  )
}

export default Introductions
