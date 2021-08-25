import { MAX_SUPPLY } from 'config/index'
import { useRewardsDistributed } from 'hooks/useRewardPerBlock'
import useTotalValueLocked from 'hooks/useTotalValueLocked'
import Value from 'components/Value/Value'
import { useBurnedBalance, useBurnedDeadBalance, useLockedBalance } from 'hooks/useTokenBalance'
import Card from 'components/Card/Card'
import { getBalanceNumber } from 'utils/formatBalance'
import CountdownCard from 'views/Dashboard/components/StatsDefily/CountdownCard'
import RewardCard from 'views/Dashboard/components/StatsDefily/RewardCard'

const StatsDefily = () => {
  const lockedBalance = getBalanceNumber(useLockedBalance())
  const rewardsDistributed = useRewardsDistributed()
  const burnedBalance = getBalanceNumber(useBurnedBalance())
  const burnedDeadBalance = getBalanceNumber(useBurnedDeadBalance())
  const totalCirculation = rewardsDistributed.gt(0) ? rewardsDistributed - burnedBalance - burnedDeadBalance : 0
  const totalValueLocked = useTotalValueLocked()

  return (
    <div className="container mx-auto mt-20 px-3">
      <CountdownCard />
      <RewardCard rewardsDistributed={rewardsDistributed.toNumber()} />
      <Card className="py-4 sm:py-8 px-5 sm:px-10 max-w-xl  my-10">
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-primary text-4xl font-bold">Defily Finance</p>
          </div>
          <div className="text-white mt-5">
            <div className="flex justify-between items-center mb-2">
              <p>Max Supply</p>
              <Value value={MAX_SUPPLY} />
            </div>
            <div className="flex justify-between items-center mb-2">
              <p>Total Defily Locked</p>
              <Value value={lockedBalance} />
            </div>
            <div className="flex justify-between items-center mb-2">
              <p>Total Defily Burned</p>
              <Value value={burnedBalance} />
            </div>
            <div className="flex justify-between items-center">
              <p>Total Defily Circulation</p>
              <Value value={totalCirculation} />
            </div>
          </div>
        </div>
      </Card>
      <Card className="py-4 sm:py-8 px-5 sm:px-10 max-w-xl mt-10 h-60">
        <div className="flex flex-col justify-between h-full">
          <p className="text-primary text-4xl font-bold">Total Value Locked</p>
          {totalValueLocked.toNumber() ? (
            <Value className="text-white text-4xl font-bold" prefix="$" value={totalValueLocked.toNumber()} />
          ) : (
            <p className="text-white">...</p>
          )}
          <p className="text-white">Across all farming pairs and stakings</p>
        </div>
      </Card>
    </div>
  )
}

export default StatsDefily
