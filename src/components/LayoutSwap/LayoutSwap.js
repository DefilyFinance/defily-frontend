import Back from 'components/Back/Back'
import Banner from 'components/Layout/Banner'
import TabHeader from 'components/TabHeader/TabHeader'
// import BannerActiveIdo from 'views/Land/components/BannerActiveIdo'
// import BannerRight from 'views/Swap/components/BannerRight'
import TokenTable from 'views/Swap/components/TokenTable/TokenTable'

const LayoutSwap = ({ children }) => {
  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-swap.png)" />
      <div className="container mx-auto px-3 mb-20">
        <TabHeader />
        <div className="grid grid-cols-1 lg:grid-cols-12 mb-10">
          <div className="col-span-3 hidden lg:block">{/*<BannerActiveIdo />*/}</div>
          <div className="col-span-6">{children}</div>
          <div className="col-span-3 hidden lg:block">{/*<BannerRight />*/}</div>
        </div>
        <TokenTable />
      </div>
    </>
  )
}

export default LayoutSwap
