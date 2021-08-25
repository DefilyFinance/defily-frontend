import PropTypes from 'prop-types'

const Banner = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: 'url(/images/banner.png)',
      }}
      className="bg-blue2 py-10 sm:py-20 bg-contain bg-right bg-no-repeat"
    >
      <div className="container mx-auto">
        <div className="ml-10">
          <h2 className="text-primary text-5xl font-bold">Defily Finance</h2>
          <p className="text-white text-2xl mt-4 max-w-md">
            A Full-Stack Cross-Chain DEFI Platform for Staking and Yield Farming
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}

Banner.propTypes = {
  children: PropTypes.node,
}

export default Banner
