import Value from 'components/Value/Value'
import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'react-feather'
import { Link } from 'react-router-dom'
import { formatNumber } from 'utils/formatBalance'
import Limit from 'views/Castles/components/Limit'

const DetailsSection = ({ pool, isIfo }) => {
  const [isView, setIsView] = useState(false)

  const earningTokens = pool.earningToken ? [pool.earningToken] : pool.earningTokens
  const { stakingLimit, poolLimit, stakingToken } = pool
  const stakedTvl = pool.stakedTvl

  return (
    <div>
      <div
        className="text-primary font-bold flex items-center justify-center cursor-pointer mt-4 flex-wrap"
        onClick={() => setIsView(!isView)}
      >
        <span>Detail</span> {isView ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isView && (
        <div className="text-white mt-2">
          <div className="flex justify-between items-center text-white">
            <p>TVL</p>
            <Value className="font-bold" prefix="$" value={stakedTvl ? +stakedTvl : 0} />
          </div>
          {isIfo &&
            !pool.isFinished &&
            earningTokens.map((earningToken) => (
              <div className="flex justify-between items-center text-white">
                <p>{earningToken.symbol} price</p>
                <p className="font-bold">
                  {pool?.earningTokensPrice ? formatNumber(pool?.earningTokensPrice, 4, 4) : 0}$
                </p>
              </div>
            ))}
          <Limit
            isIfo={isIfo}
            stakingToken={stakingToken}
            poolLimit={poolLimit}
            stakingLimit={stakingLimit}
            stakingTokenPrice={pool.stakingTokenPrice}
          />
          {earningTokens.length > 1 ? (
            earningTokens.map((earningToken) => (
              <a
                className="flex items-center justify-end cursor-pointer hover:underline"
                href={earningToken.projectLink}
                target="_blank"
              >
                View Project Site ({earningToken.symbol})
                <ExternalLink className="ml-1" size={16} />
              </a>
            ))
          ) : (
            <a
              className="flex items-center justify-end cursor-pointer hover:underline"
              href={earningTokens[0].projectLink}
              target="_blank"
            >
              View Project Site
              <ExternalLink className="ml-1" size={16} />
            </a>
          )}
          {stakingToken.symbol === 'DRAGON' ? (
            <a
              className="flex items-center justify-end cursor-pointer hover:underline"
              href={`https://defily.io/#/swap?&outputCurrency=${stakingToken.address}`}
              target="_blank"
            >
              Get {stakingToken.symbol} Token
              <ExternalLink className="ml-1" size={16} />
            </a>
          ) : (
            <>
              {stakingToken.symbol.includes('DDT') ? (
                <Link
                  className="flex items-center justify-end cursor-pointer hover:underline"
                  to="/vaults"
                  target="_blank"
                >
                  Get {stakingToken.symbol} Token
                  <ExternalLink className="ml-1" size={16} />
                </Link>
              ) : (
                <a
                  className="flex items-center justify-end cursor-pointer hover:underline"
                  href={
                    stakingToken.token1
                      ? `https://defily.io/#/pipe/0x7cd3c7aFeDD16A72Fba66eA35B2e2b301d1B7093/${stakingToken.address}`
                      : `https://defily.io/#/swap?inputCurrency=kai&outputCurrency=${stakingToken.address}`
                  }
                  target="_blank"
                >
                  Get {stakingToken.symbol} Token
                  <ExternalLink className="ml-1" size={16} />
                </a>
              )}
            </>
          )}
          <a
            className="flex items-center justify-end cursor-pointer hover:underline"
            href="https://defilyfinance.medium.com/what-is-initial-farm-offering-6d376a13f1fa"
            target="_blank"
          >
            Read more about IFO Launchpad
            <ExternalLink className="ml-1" size={16} />
          </a>
        </div>
      )}
    </div>
  )
}

export default DetailsSection
