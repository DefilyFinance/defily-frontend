import Button from 'components/Button/Button'
import { FiatValue } from 'components/CurrencyInputPanel/FiatValue'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import useKardiachain from 'hooks/useKardiachain'
import { useState } from 'react'
import { ChevronDown } from 'react-feather'
import { useCurrencyBalance } from 'store/wallet/hooks'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'

import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  fiatValue,
  priceImpact,
  disableInput = false,
  listHideTokens,
}) {
  const [PresentCurrencyModal, setPresentCurrencyModal] = useState(false)
  const { account } = useKardiachain()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const translatedLabel = label || 'Input'

  const toggleCurrencyModal = () => setPresentCurrencyModal((prevState) => !prevState)

  return (
    <>
      <CurrencySearchModal
        open={PresentCurrencyModal}
        onDismiss={toggleCurrencyModal}
        onCurrencySelect={onCurrencySelect}
        selectedCurrency={currency}
        otherSelectedCurrency={otherCurrency}
        showCommonBases={showCommonBases}
        listHideTokens={listHideTokens}
      />
      <div className="flex flex-nowrap flex-col bg-blue2 p-2 rounded-2xl" id={id}>
        <div className="rounded-2xl">
          {!hideInput && (
            <div className="flex flex-nowrap items-center justify-between text-white mb-2">
              <p>{translatedLabel}</p>
              <div className="flex items-center cursor-pointer">
                {account && (
                  <p onClick={onMax}>
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? `Balance ${selectedCurrencyBalance?.toSignificant(6)}`
                      : ' -'}
                  </p>
                )}
                {account && currency && showMaxButton && label !== 'To' && (
                  <button className="text-sm ml-1 bg-primary rounded px-1.5 py-px" onClick={onMax}>
                    MAX
                  </button>
                )}
              </div>
            </div>
          )}
          <div
            className="flex items-center justify-between flex-1"
            style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
          >
            {!hideInput && (
              <div className="flex-1">
                <div className="overflow-auto flex-1">
                  <NumericalInput
                    disabled={disableInput}
                    value={value}
                    onUserInput={(val) => {
                      onUserInput(val)
                    }}
                  />
                </div>
                <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
              </div>
            )}
            <Button
              size="sm"
              className="ml-2 whitespace-nowrap"
              onClick={() => {
                if (!disableCurrencySelect) {
                  toggleCurrencyModal()
                }
              }}
            >
              <div className="flex items-center justify-between">
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} />
                ) : null}
                {pair ? (
                  <p id="pair" className="ml-1">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </p>
                ) : (
                  <p id="pair" className="ml-1">
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || 'Select a token'}
                  </p>
                )}
                {!disableCurrencySelect && <ChevronDown />}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
