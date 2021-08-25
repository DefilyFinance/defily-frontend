import BigNumber from 'bignumber.js'
import Back from 'components/Back/Back'
import Card from 'components/Card/Card'
import PageHeader from 'components/PageHeader/PageHeader'
import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import { useDflPrice } from 'hooks/usePrice'
import { useBattles } from 'store/battles/hook'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import BattleCard from 'views/Battles/components/BattleCard'
import Banner from '../../components/Layout/Banner'
import HeaderDetail from '../../components/PageHeader/HeaderDetail'

const Battles = () => {
  const { account } = useKardiachain()
  const dflPrice = useDflPrice()
  const { battles, tokenBalance } = useBattles(account)

  const usdTokenDragon = tokenBalance
    ? new BigNumber(getFullDisplayBalance(tokenBalance)).times(dflPrice).toNumber()
    : 0

  return (
    <>
      <Back />
      <Banner bg="url(/images/banner-play.png)">
        <HeaderDetail title="Start Battle, Earn Dragon">
          <p className="text-white text-xl">Deposit Defily Tokens</p>
        </HeaderDetail>
      </Banner>
      <div className="container mx-auto px-3 mb-36 sm:mb-40 md:mb-72 lg:mb-96 lg:pb-20">
        <div className="flex justify-center flex-wrap relative z-20">
          {battles.map((battle, index) => (
            <BattleCard key={index} battle={battle} tokenBalance={tokenBalance} />
          ))}
        </div>
        <Card className="relative z-30 mb-8 max-w-xs p-5 w-full mx-auto text-center opacity-80">
          <Value className="text-primary text-4xl" value={account ? getBalanceNumber(tokenBalance) : 0} />
          <Value prefix="~" className="text-primary" value={account ? usdTokenDragon : 0} decimals={2} unit="USD" />
          <p className="text-white text-xl">DRAGON balance</p>
        </Card>
      </div>
    </>
  )
}

export default Battles
