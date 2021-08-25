import Banner from './components/Banner'
import PopularVaults from './components/PopularVaults'
import NewsAndCampaigns from './components/NewsAndCampaigns'
import Introductions from './components/Introductions'
import LearnMore from '../Home/components/LearnMore'
import JoinCommunity from '../Home/components/JoinCommunity'

const HomeV2 = () => {
  return (
    <>
      <Banner />
      <div
        className="max-w-screen-2xl mx-auto"
        style={{
          backgroundImage: 'url(/images/bg-home-footer.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
        }}
      >
        <PopularVaults />
        <NewsAndCampaigns />
      </div>
      <Introductions />
      <LearnMore />
      <JoinCommunity />
    </>
  )
}

export default HomeV2
