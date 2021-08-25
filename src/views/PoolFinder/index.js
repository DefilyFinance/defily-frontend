import AppHeader from 'components/AppHeader/AppHeader'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import Dots from 'components/Loader/Dots'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import { MinimalPositionCard } from 'components/PositionCard/PositionCard'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import useKardiachain from 'hooks/useKardiachain'
import { PairState, usePair } from 'hooks/usePairs'
import { useCallback, useEffect, useState } from 'react'
import { ETHER, JSBI } from 'defily-v2-sdk'
import { ChevronDown, Plus } from 'react-feather'
import { NavLink } from 'react-router-dom'
import { usePairAdder } from 'store/user/hooks/index'
import { useTokenBalance } from 'store/wallet/hooks'
import currencyId from 'utils/currencyId'

const Fields = {
  TOKEN0: 0,
  TOKEN1: 1,
}

export default function PoolFinder() {
  const { account } = useKardiachain()

  const [showSearch, setShowSearch] = useState(false)

  const [activeField, setActiveField] = useState(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState(ETHER)
  const [currency1, setCurrency1] = useState(null)

  const arrPair = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const pairState = arrPair?.[0]
  const pair = arrPair?.[1]

  const addPair = usePairAdder()

  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI?.equal(pair?.reserve0?.raw, JSBI?.BigInt(0)) &&
        JSBI?.equal(pair?.reserve1?.raw, JSBI?.BigInt(0)),
    )

  const position = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const hasPosition = Boolean(position && JSBI?.greaterThan(position?.raw, JSBI?.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <Card className="bg-blue2 p-5 mt-4">
      <p className="text-white text-center">
        {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
      </p>
    </Card>
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  return (
    <>
      <CurrencySearchModal
        open={showSearch}
        onDismiss={handleSearchDismiss}
        onCurrencySelect={handleCurrencySelect}
        showCommonBases
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
      <Card className="max-w-md mx-auto p-5 border-2 border-primary">
        <AppHeader title="Import Pool" backTo="/liquidity" noConfig />
        <div>
          <Card color="primary" className="p-2 mb-4">
            <p>
              <strong>Tip:</strong> Use this tool to find pools that don't automatically appear in the interface.
            </p>
          </Card>
          <Button
            className="w-full h-12"
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN0)
            }}
          >
            <div className="flex items-center justify-between w-full">
              {currency0 ? (
                <div className="flex items-center">
                  <CurrencyLogo currency={currency0} className="mr-1" />
                  <p>{currency0.symbol}</p>
                </div>
              ) : (
                <p>Select a Token</p>
              )}
              <ChevronDown />
            </div>
          </Button>

          <Plus className="mx-auto text-white my-2" />

          <Button
            className="w-full h-12"
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN1)
            }}
          >
            <div className="flex items-center justify-between w-full">
              {currency1 ? (
                <div className="flex items-center">
                  <CurrencyLogo currency={currency1} />
                  <p>{currency1.symbol}</p>
                </div>
              ) : (
                <p>Select a Token</p>
              )}
              <ChevronDown />
            </div>
          </Button>

          {hasPosition && (
            <Card className="bg-blue2 p-5 mt-4 text-white">
              <p className="text-center">Pool Found!</p>
              <NavLink className="text-primary hover:underline" to="/liquidity">
                <p className="text-center">Manage this pool.</p>
              </NavLink>
            </Card>
          )}

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <MinimalPositionCard pair={pair} />
              ) : (
                <Card className="bg-blue2 p-5 mt-4 text-white">
                  <p className="text-center">You don’t have liquidity in this pool yet.</p>
                  <NavLink
                    className="text-primary hover:underline"
                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    <p className="text-center">Add Liquidity</p>
                  </NavLink>
                </Card>
              )
            ) : validPairNoLiquidity ? (
              <Card className="bg-blue2 p-5 mt-4 text-white">
                <p className="text-center">No pool found.</p>
                <NavLink
                  className="text-primary hover:underline"
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                  Create pool.
                </NavLink>
              </Card>
            ) : pairState === PairState.INVALID ? (
              <Card className="bg-blue2 p-5 mt-4 text-white">
                <div className="flex justify-center">
                  <p className="text-center font-bold">Invalid pair.</p>
                </div>
              </Card>
            ) : pairState === PairState.LOADING ? (
              <Card className="bg-blue2 p-5 mt-4 text-white">
                <div className="flex justify-center">
                  <Dots className="text-center">Loading</Dots>
                </div>
              </Card>
            ) : null
          ) : (
            prerequisiteMessage
          )}
        </div>
      </Card>
    </>
  )
}
