import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import UnlockButton from 'components/UnlockButton/UnlockButton'
import { CASTLE_TAGS } from 'constants/index'
import useKardiachain from 'hooks/useKardiachain'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import CardActionsContainer from 'views/Castles/components/CardActionsContainer/CardActionsContainer'
import CardHeading from 'views/Castles/components/CardHeading'
import CardInformation from 'views/Castles/components/CardInformation'
import DetailsSection from 'views/Castles/components/DetailsSection'
import UnstakingFeeCountdownRow from 'views/Castles/components/UnstakingFeeCountdownRow'

const CastleCard = ({ pool, index, userDataLoaded }) => {
  const history = useHistory()
  const { account } = useKardiachain()

  const isIfo = pool.tags.includes(CASTLE_TAGS.ifo)

  return (
    <div
      // fix tooltip zIndex
      style={{
        zIndex: 10000000 + index,
      }}
      className="w-96 max-w-full sm:w-full mx-auto relative"
    >
      <Card className="relative">
        <div className="p-5">
          <CardHeading isFinished={pool.isFinished} tags={pool.tags} stakingToken={pool.stakingToken} />
          <CardInformation
            pool={pool}
            isFinished={pool.isFinished}
            earningTokens={pool.earningToken ? [pool.earningToken] : pool.earningTokens}
            stakedTvl={pool.stakedTvl}
            isIfo={isIfo}
          />
          {pool?.fees?.withdrawalFee && (
            <UnstakingFeeCountdownRow
              stakedBalance={pool.userData.stakedBalance}
              className="text-white"
              blockPeriod={pool.blockPeriod}
              lastStakingBlock={pool.userData.lastStakingBlock}
              fees={pool.fees.withdrawalFee}
            />
          )}
          {pool.isV2 ? (
            <CardActionsContainer
              pool={pool}
              earningTokens={pool.earningToken ? [pool.earningToken] : pool.earningTokens}
              isIfo={isIfo}
              userDataLoaded={userDataLoaded}
            />
          ) : (
            <>
              {!account && <UnlockButton className="my-4" />}
              {account && (
                <Button className="w-full my-4" onClick={() => history.push(`/castle/${pool.sousId}`)}>
                  Select
                </Button>
              )}
            </>
          )}
          <DetailsSection pool={pool} isIfo={isIfo} />
        </div>
      </Card>
    </div>
  )
}

CastleCard.propTypes = {
  pool: PropTypes.object,
}

export default CastleCard
