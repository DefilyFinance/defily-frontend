import { getNameLpToken } from 'utils/tokenHelpers'
import HarvestAction from 'views/MiniFarms/components/CardActionsContainer/HarvestAction'
import StakeAction from 'views/MiniFarms/components/CardActionsContainer/StakeAction'

const CardActionsContainer = ({ farm, earningTokenSymbol, masterChefAddress, userDataLoaded, tab }) => {
  const { userData } = farm
  const lpTokenName = getNameLpToken(farm.token0, farm.token1)

  return (
    <div>
      <div>
        <p>
          <strong className="text-primary">{earningTokenSymbol}</strong> <span className="text-white">Earned</span>
        </p>
        <HarvestAction
          tab={tab}
          earningTokenSymbol={earningTokenSymbol}
          userDataLoaded={userDataLoaded}
          pid={farm.pid}
          masterChefAddress={masterChefAddress}
          earnings={userData.earnings}
          earningTokenPrice={farm.earningTokenPrice}
        />
      </div>
      <div>
        <p>
          <strong className="text-primary">{lpTokenName}</strong> <span className="text-white">Staked</span>
        </p>
        <StakeAction
          earningTokenSymbol={earningTokenSymbol}
          tab={tab}
          farm={farm}
          userDataLoaded={userDataLoaded}
          masterChefAddress={masterChefAddress}
        />
      </div>
    </div>
  )
}

export default CardActionsContainer
