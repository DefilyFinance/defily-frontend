import Loader from 'components/Loader/Loader'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo } from 'react'
import { Currency, currencyEquals, ETHER, Token } from 'defily-v2-sdk'
import { FixedSizeList } from 'react-window'
import { useCurrencyBalance } from 'store/wallet/hooks'
import classnames from 'classnames'

function currencyKey(currency) {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'KAI' : ''
}

function Balance({ balance }) {
  return <p>{balance.toSignificant(4)}</p>
}

function CurrencyRow({ currency, onSelect, isSelected, otherSelected, style }) {
  const { account } = useKardiachain()
  const balance = useCurrencyBalance(account ?? undefined, currency)

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
        <CurrencyLogo currency={currency} size="24px" />
        <div className="ml-1">
          <p className="font-semibold">{currency.symbol}</p>
          <p className="text-sm">{currency.name}</p>
        </div>
      </div>
      <div className="mr-2">{balance ? <Balance balance={balance} /> : account ? <Loader /> : null}</div>
    </div>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
}) {
  const itemData = useMemo(() => (showETH ? [Currency.ETHER, ...currencies] : [...currencies]), [currencies, showETH])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)

      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency],
  )

  const itemKey = useCallback((index, data) => currencyKey(data[index]), [])

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
