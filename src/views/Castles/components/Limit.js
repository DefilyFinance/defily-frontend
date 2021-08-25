import Value from 'components/Value/Value'
import { BIG_TEN } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'

const Limit = ({ stakingLimit, poolLimit, stakingToken, stakingTokenPrice, isIfo }) => {
  return (
    <>
      {stakingLimit && stakingLimit.gt(0) && (
        <div className="flex items-center justify-between text-white">
          <p>Limit per user</p>
          <div className="flex font-bold">
            <Value value={getBalanceNumber(stakingLimit, stakingToken.decimals)} decimals={2} />
            <span className="ml-1">
              {stakingToken.symbol}{' '}
              {isIfo && stakingTokenPrice
                ? `(~${formatNumber(
                    stakingLimit.div(BIG_TEN.pow(stakingToken.decimals)).times(stakingTokenPrice).toNumber(),
                    0,
                    0,
                  )}$)`
                : ''}
            </span>
          </div>
        </div>
      )}
      {poolLimit && poolLimit.gt(0) && (
        <div className="flex items-center justify-between text-white">
          <p>{isIfo ? 'Hard Cap' : 'Pool limit'}</p>
          <div className="flex font-bold">
            <Value value={getBalanceNumber(poolLimit, stakingToken.decimals)} decimals={1} />
            <span className="ml-1">
              {stakingToken.symbol}{' '}
              {isIfo && stakingTokenPrice
                ? `(~${formatNumber(
                    poolLimit.div(BIG_TEN.pow(stakingToken.decimals)).times(stakingTokenPrice).toNumber(),
                    0,
                    0,
                  )}$)`
                : ''}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Limit
