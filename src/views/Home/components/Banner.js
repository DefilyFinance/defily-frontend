import Button from 'components/Button/Button'
import BoxBanner from './BoxBanner'
import { useFarmsByLpAddress } from 'store/farms/hook'
import OverviewAssets from './OverviewAssets'
import ButtonViewMore from './ViewMore'

const POOL_ADDRESS = [
  '0x256b8a99f69dbdbb5ac781e97f11080a336f5507', // dfl-kai
  '0x3e82F9290A28D4296d34d0c1e6E5366c4220248a', //dfl-kusd
  '0x18f4f7A1fa6F2c93d40d4Fd83c67E93B88d3a0b1', //dragon
  '0xAF984E23EAA3E7967F3C5E007fbe397D8566D23d', //wkai
]

const Banner = () => {
  const farms = useFarmsByLpAddress(POOL_ADDRESS)
  const handleClick = () => {
    const header = document.getElementById('defily-header-page')
    const headerHeight = header?.offsetHeight || 0
    const el = document.getElementById('box-detail-intro')
    if (el) {
      window.scrollTo({ behavior: 'smooth', top: el.offsetTop + headerHeight })
    }
  }

  return (
    <div
      style={{
        backgroundImage: 'url(/images/dragon-dao-2.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="pt-24 pb-40"
        style={{
          background: 'linear-gradient(to top, #012a4a, #013a63d1, #013a63d1, #013a63ed)',
        }}
      >
        <div className="container max-w-screen-lg-xl mx-auto">
          <div className="mx-2">
            <p className="text-4xl sm:text-6xl ml-3 md:ml-0 font-bold leading-10 text-primary ">Crosschain</p>
            <p className="text-4xl sm:text-6xl ml-3 md:ml-0 font-bold text-primary">DeFi Ecosystem</p>
            <p className="text-white ml-3 md:ml-0">
              To stake, yield farm, invest and earn with crypto in a friendly way.
            </p>
            <Button
              className="rounded-3xl mt-5 py-2 px-5 sm:px-10 ml-3 md:ml-0 text-md sm:text-lg font-bold text-blue1 btn-learn-more-home"
              onClick={handleClick}
            >
              LEARN MORE
            </Button>
          </div>
          <OverviewAssets />

          <h2 className="text-center text-primary text-4xl font-bold mb-10">Featured Pools</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12">
            {farms?.map((farm, index) => (
              <BoxBanner key={index} farm={farm} />
            ))}
          </div>
          <div className="flex flex-row justify-center mt-5">
            <ButtonViewMore title="View more pools" route={'/pools'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
