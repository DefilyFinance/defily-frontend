import Card from 'components/Card/Card'
import address from 'constants/contracts'
import PropTypes from 'prop-types'
import CardActionsContainer from 'views/Farms/components/CardActionsContainer/CardActionsContainer'
import CardInformation from 'views/Farms/components/CardInformation'
import CardHeading from 'views/Farms/components/CardHeading'
import DetailsSection from 'views/Farms/components/DetailsSection'

const FarmCard = ({ farm, userDataLoaded }) => {
  return (
    <div className="w-96 max-w-full sm:w-full mx-auto relative z-20">
      <Card>
        <div className="p-5">
          <CardHeading multiplier={farm.mul} token1={farm.token1} token0={farm.token0} />
          <CardInformation farm={farm} earningTokenSymbol="DFL" userDataLoaded={userDataLoaded} />
          <CardActionsContainer
            farm={farm}
            earningTokenSymbol="DFL"
            userDataLoaded={userDataLoaded}
            masterChefAddress={address.masterChef}
          />
          <DetailsSection token1={farm.token1} token0={farm.token0} lpAddress={farm.lpAddress} />
        </div>
      </Card>
    </div>
  )
}

FarmCard.propTypes = {
  farm: PropTypes.object,
}

export default FarmCard
