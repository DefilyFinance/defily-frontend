import Logo from 'components/Logo/Logo'
import { formatListLogo } from 'utils/formatLogo'
import AprRow from 'views/Castles/components/AprRow'
import BlockCountdown from 'views/Castles/components/BlockCountdown'
import BlockCountdownStake from 'views/Castles/components/BlockCountdownStake'
import Roi from 'views/Castles/components/Roi'

const CardInformation = ({ pool, earningTokens, isIfo }) => {
  const logos = formatListLogo(earningTokens)

  return (
    <div className="mb-3 mt-5">
      {isIfo ? <Roi pool={pool} /> : <AprRow pool={pool} />}
      <div className="flex items-center justify-between text-white mb-1">
        <p>Earn</p>
        <div className="flex items-end">
          {earningTokens.map((token, index) => (
            <p className="flex items-center font-bold" key={index}>
              {index !== 0 && <span className="mx-1">+</span>}
              <Logo className="mr-1" src={logos.srcs[index]} alt={logos.alts[index]} size={30} />
              {token.symbol}
            </p>
          ))}
        </div>
      </div>
      <BlockCountdownStake pool={pool} isIfo={isIfo} />
      <BlockCountdown pool={pool} isIfo={isIfo} />
    </div>
  )
}

export default CardInformation
