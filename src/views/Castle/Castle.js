import Back from 'components/Back/Back'
import Card from 'components/Card/Card'
import ContainerPage from 'components/Container/ContainerPage'
import PageHeader from 'components/PageHeader/PageHeader'
import Value from 'components/Value/Value'
import { CASTLE_TAGS } from 'constants/index'
import useKardiachain from 'hooks/useKardiachain'
import { useParams } from 'react-router-dom'
import { useCastleFromPid, useCastleUser } from 'store/castles/hook'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolName } from 'utils/tokenHelpers'
import Harvest from 'views/Castle/components/Harvest/Harvest'
import HarvestV2 from 'views/Castle/components/Harvest/HarvestV2'
import Stake from 'views/Castle/components/Stake/Stake'
import withAuthCastle from 'hoc/withAuthCastle'
import { Fragment } from 'react'

const Castle = () => {
  const { account } = useKardiachain()
  const { pid } = useParams()
  const pool = useCastleFromPid(pid)
  const userData = useCastleUser(pool?.sousId)
  const isIfo = pool.tags.includes(CASTLE_TAGS.ifo)
  const poolName = getPoolName(pool.isV2 ? pool.earningTokens : [pool.earningToken])

  return (
    <ContainerPage>
      <Back />
      <PageHeader
        className="mt-10 sm:mt-0"
        classNameLogo="hidden sm:block"
        logo="/logo.png"
        title={`${isIfo ? 'Buy-in with' : 'Deposit'} ${pool.stakingToken.symbol} Tokens and ${
          isIfo ? 'Get' : 'earn'
        } ${poolName}`}
        subTitle={
          pool.isPartner &&
          'This is a Staking Castle from our Partner, please make sure you understand the risk of Staking this Castle.'
        }
      />
      <div className="flex justify-center flex-wrap relative z-20">
        {pool.isV2 ? (
          <HarvestV2 pool={pool} earnings={userData.earnings} />
        ) : (
          <Harvest pool={pool} earnings={userData.earnings} />
        )}
        <Stake isIfo={isIfo} pool={pool} userData={userData} />
      </div>
      {pool.isV2 ? (
        <Card className="relative z-30 mb-8 min-w-min	max-w-xs p-5 w-full mx-auto text-center opacity-80">
          {userData.earningsTokenBalance.map((earningBalance, index) => (
            <Fragment key={index}>
              {account && userData.userDataLoaded ? (
                <Value
                  className="text-primary text-2xl break-words"
                  value={getBalanceNumber(earningBalance, pool.earningTokens[index].decimals)}
                />
              ) : (
                <p className="text-primary text-2xl">...</p>
              )}
              <p className="text-white text-xl">{pool.earningTokens[index].symbol} Token Balance</p>
            </Fragment>
          ))}
        </Card>
      ) : (
        <Card className="relative z-30 mb-8 min-w-min	max-w-xs p-5 w-full mx-auto text-center opacity-80">
          {account && userData.userDataLoaded ? (
            <Value
              className="text-primary text-2xl break-words"
              value={
                account && userData.userDataLoaded
                  ? getBalanceNumber(userData.earningsTokenBalance, pool.earningToken.decimals)
                  : '...'
              }
            />
          ) : (
            <p className="text-primary text-2xl">...</p>
          )}
          <p className="text-white text-xl">{pool.earningToken.symbol} Token Balance</p>
        </Card>
      )}
    </ContainerPage>
  )
}

export default withAuthCastle(Castle)
