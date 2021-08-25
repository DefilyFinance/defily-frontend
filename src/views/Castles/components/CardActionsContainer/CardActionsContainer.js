import { getPoolName } from 'utils/tokenHelpers'
import HarvestAction from 'views/Castles/components/CardActionsContainer/HarvestAction'
import StakeAction from 'views/Castles/components/CardActionsContainer/StakeAction'

const CardActionsContainer = ({ pool, earningTokens, userDataLoaded, isIfo }) => {
  const { userData } = pool
  const poolName = getPoolName(earningTokens)

  return (
    <div>
      <div>
        <p>
          <strong className="text-primary">{poolName}</strong>{' '}
          <span className="text-white">{isIfo ? 'Total Rewards' : 'Earned'}</span>
        </p>
        <HarvestAction
          isFees={!!pool?.fees?.withdrawalFee}
          stakedBalance={userData.stakedBalance}
          userDataLoaded={userDataLoaded}
          isIfo={isIfo}
          earningTokens={earningTokens}
          earnings={userData.earnings}
          contractAddress={pool.contractAddress}
          earningTokensPrice={pool?.earningTokensPrice}
        />
      </div>
      <div>
        <p>
          <strong className="text-primary">{pool.stakingToken.symbol}</strong>{' '}
          <span className="text-white">Staked</span>
        </p>
        <StakeAction pool={pool} userDataLoaded={userDataLoaded} isIfo={isIfo} />
      </div>
    </div>
  )
}

export default CardActionsContainer
