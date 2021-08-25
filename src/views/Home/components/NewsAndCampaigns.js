import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Link } from 'react-router-dom'
const NEWS_CAMPAIGN = [
  {
    img: '/images/PosterDefilyVault.png',
    route: '/vaults',
  },
  {
    img: '/images/Moonka-Defily.jpg',
    url: 'https://blog.moonka.io',
  },
  {
    img: '/images/DFL-NamiNiemYet-ENG.jpg',
    url: 'https://nami.io/en/industry-watch/nami-exchange-will-list-defily-dfl',
  },
  {
    img: '/images/defily-vaults.jpg',
    route: '/swap',
  },
  {
    img: '/images/defily-vndc.png',
    url: 'https://blog.vndc.io/niem-yet-defily-token-dfl-tren-vndc-wallet',
  },
]
const NewsAndCampaigns = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 768, min: 578 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 578, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  }
  return (
    <div className="pb-52">
      <div className="container max-w-screen-lg-xl mx-auto wrap-slice-show">
        <h2 className="text-center text-primary text-4xl font-bold my-10 mt-14">
          Keep Up With Lastest News And Campaigns
        </h2>
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={5000}
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
          {NEWS_CAMPAIGN.map((item, index) => {
            const TagLink = item?.route ? Link : 'a'
            return (
              <div key={index} className="px-3 flex flex-row items-center">
                <TagLink
                  style={{
                    height: 220,
                  }}
                  {...(item?.route
                    ? {
                        to: item?.route,
                      }
                    : {
                        href: item?.url,
                      })}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <img src={item?.img} className="w-full h-full" />
                </TagLink>
              </div>
            )
          })}
        </Carousel>
      </div>
    </div>
  )
}

export default NewsAndCampaigns
