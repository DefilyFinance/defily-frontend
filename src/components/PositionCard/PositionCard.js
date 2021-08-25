import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import { BIG_INT_ZERO } from 'constants/swap'
import useKardiachain from 'hooks/useKardiachain'
import useTotalSupply from 'hooks/useTotalSupply'
import { useState } from 'react'
import { JSBI, Percent } from 'defily-v2-sdk'
import { ChevronDown, ChevronUp, Plus } from 'react-feather'
import { Link } from 'react-router-dom'
import { useTokenBalance } from 'store/wallet/hooks'
import { currencyId } from 'utils/currencyId'
import { unwrappedToken } from 'utils/wrappedCurrency'

export function MinimalPositionCard({ pair, showUnwrapped = false }) {
  const { account } = useKardiachain()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <Card className="text-white p-5">
          <div>
            <div>
              <div>
                <div>
                  <p className="font-bold mb-2">Your position</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <p>
                    {currency0.symbol}-{currency1.symbol} LP
                  </p>
                </div>
                <div>
                  <p>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p>Share of Pool:</p>
                  <p>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</p>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p>Pooled {currency0.symbol}</p>
                  {token0Deposited ? (
                    <div>
                      <p>{token0Deposited?.toSignificant(6)}</p>
                    </div>
                  ) : (
                    '-'
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p>Pooled {currency1.symbol}</p>
                  {token1Deposited ? (
                    <div>
                      <p>{token1Deposited?.toSignificant(6)}</p>
                    </div>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="text-white p-5">
          <p className="text-center">
            By adding liquidity you'll earn 0.2% of all trades on this pair proportional to your share of the pool. Fees
            are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.{' '}
          </p>
        </Card>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, ...props }) {
  const { account } = useKardiachain()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <Card color="primary" className="p-1 cursor-pointer mb-2" {...props}>
      <div className="flex justify-between items-center" onClick={() => setShowMore(!showMore)}>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex items-center">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <p className="font-bold ml-1">
              {!currency0 || !currency1 ? 'Loading' : `${currency0.symbol}/${currency1.symbol}`}
            </p>
          </div>
          <p>{userPoolBalance?.toSignificant(4)}</p>
        </div>
        {showMore ? <ChevronUp /> : <ChevronDown />}
      </div>

      {showMore && (
        <div className="p-3">
          <div className="flex justify-between mb-1">
            <p>Pooled {currency0.symbol}:</p>
            {token0Deposited ? (
              <div className="flex items-center">
                <p className="mr-1">{token0Deposited?.toSignificant(6)}</p>
                <CurrencyLogo size="20px" currency={currency0} />
              </div>
            ) : (
              '-'
            )}
          </div>

          <div className="flex justify-between">
            <p>Pooled {currency1.symbol}:</p>
            {token1Deposited ? (
              <div className="flex items-center">
                <p className="mr-1">{token1Deposited?.toSignificant(6)}</p>
                <CurrencyLogo size="20px" currency={currency1} />
              </div>
            ) : (
              '-'
            )}
          </div>

          <div className="flex justify-between">
            <p>Your pool share:</p>
            <p>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </p>
          </div>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
            <div className="mt-2">
              <Link to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                <Button className="w-full">
                  <Plus />
                  Add liquidity instead
                </Button>
              </Link>
              <Link to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}>
                <Button color="blue" className="w-full">
                  Remove
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
