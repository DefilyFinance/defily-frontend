import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import Dots from 'components/Loader/Dots'
import useKardiachain from 'hooks/useKardiachain'
import { useMemo } from 'react'
import { Plus } from 'react-feather'
import { Link, NavLink } from 'react-router-dom'
import FullPositionCard from 'components/PositionCard/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'store/wallet/hooks'
import { usePairs } from 'hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'store/user/hooks'

export default function Liquidity() {
  const { account } = useKardiachain()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair) => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return <p className="text-center text-white">Connect to a wallet to view your liquidity.</p>
    }
    if (v2IsLoading) {
      return <Dots className="text-center text-white mb-4">Loading</Dots>
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return <p className="text-center text-white">No liquidity found.</p>
  }

  return (
    <>
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader title="Your liquidity" />
        {renderBody()}
        {account && !v2IsLoading && (
          <div className="bg-blue2 text-white text-center py-4 my-4 rounded-lg">
            <p>Don't see a pool you joined?</p>
            <NavLink className="text-primary hover:underline" to="/find">
              Find other LP tokens
            </NavLink>
          </div>
        )}
        <Link to="/add">
          <Button className="mx-auto flex items-center">
            <Plus /> Add Liquidity
          </Button>
        </Link>
      </Card>
    </>
  )
}
