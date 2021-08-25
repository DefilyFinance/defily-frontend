import Loader from 'components/Loader/Loader'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback } from 'react'
import { currencyEquals, Pair } from 'defily-v2-sdk'
import { FixedSizeList } from 'react-window'
import { useCurrencyBalance } from 'store/wallet/hooks'
import classnames from 'classnames'

function pairKey(pair) {
  return pair instanceof Pair ? pair.liquidityToken.address : ''
}

function Balance({ balance }) {
  return <p>{balance.toSignificant(4)}</p>
}

function CurrencyRow({ pair, onSelect, isSelected, otherSelected, style }) {
  const { account } = useKardiachain()
  const balance = useCurrencyBalance(account ?? undefined, pair.liquidityToken)

  // only show add or remove buttons if not on selected list
  return (
    <div
      style={style}
      className={classnames(
        'flex justify-between text-black items-center cursor-pointer relative hover:bg-gray-200 rounded-md',
        (otherSelected || isSelected) && 'opacity-60',
      )}
      onClick={onSelect}
    >
      <div className="flex items-center px-2">
        <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} />
        <div className="ml-1">
          <p className="font-semibold">
            {pair.token0.symbol}/{pair.token1.symbol}
          </p>
        </div>
      </div>
      <div className="mr-2">{balance ? <Balance balance={balance} /> : account ? <Loader /> : null}</div>
    </div>
  )
}

export default function PairList({ height, currencies, selectedPair, onPairSelect, otherSelectedPair, fixedListRef }) {
  const itemData = [...currencies]

  const Row = useCallback(
    ({ data, index, style }) => {
      const pair = data[index]
      const isSelected = Boolean(selectedPair && currencyEquals(selectedPair, pair))
      const otherSelected = Boolean(otherSelectedPair && currencyEquals(otherSelectedPair, pair))
      const handleSelect = () => onPairSelect(pair)

      return (
        <CurrencyRow
          style={style}
          pair={pair}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onPairSelect, otherSelectedPair, selectedPair],
  )

  const itemKey = useCallback((index, data) => pairKey(data[index]), [])

  return (
    <FixedSizeList
      className="mt-2"
      height={height}
      ref={fixedListRef}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
