import Button from 'components/Button/Button'
import { FiatValue } from 'components/CurrencyInputPanel/FiatValue'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import DoubleCurrencyLogo from 'components/LogoSwap/DoubleLogo'
import useKardiachain from 'hooks/useKardiachain'
import { useState } from 'react'
import { ChevronDown } from 'react-feather'
import { useCurrencyBalance } from 'store/wallet/hooks'
import PairSearchModal from 'components/SearchPairModal/PairSearchModal'

const PairInputPanel = ({
  pairs,
  id,
  value,
  onUserInput,
  label,
  onPairSelect,
  pair,
  onMax,
  otherPair,
  fiatValue,
  hideBalance = false,
  disableInput = false,
}) => {
  const { account } = useKardiachain()
  const [PresentPairModal, setPresentPairModal] = useState(false)
  const translatedLabel = label || 'Input'
  const selectedPairBalance = useCurrencyBalance(account ?? undefined, pair?.liquidityToken ?? undefined)

  const togglePairModal = () => setPresentPairModal((prevState) => !prevState)

  return (
    <>
      {PresentPairModal && (
        <PairSearchModal
          pairs={pairs}
          open={PresentPairModal}
          onDismiss={togglePairModal}
          onPairSelect={onPairSelect}
          selectedPair={pair}
          otherSelectedPair={otherPair}
          // showCommonBases={showCommonBases}
        />
      )}
      <div className="flex flex-nowrap flex-col bg-blue2 p-2 rounded-2xl" id={id}>
        <div className="rounded-2xl">
          <div className="flex flex-nowrap items-center justify-between text-white mb-2">
            <p>{translatedLabel}</p>
            <div className="flex items-center cursor-pointer">
              {account && (
                <p
                  onClick={() => {
                    if (!disableInput) {
                      onMax()
                    }
                  }}
                >
                  {!hideBalance && !!pair && selectedPairBalance
                    ? `Balance ${selectedPairBalance?.toSignificant(6)}`
                    : ' -'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between flex-1">
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
              <FiatValue fiatValue={fiatValue} />
            </div>
            <Button size="sm" className="ml-2 whitespace-nowrap" onClick={togglePairModal}>
              <div className="flex items-center justify-between">
                {pair && <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={16} margin />}
                {pair ? (
                  <p id="pair" className="ml-1">
                    {pair?.token0?.symbol}/{pair?.token1?.symbol}
                  </p>
                ) : (
                  'Select a pair'
                )}
                <ChevronDown />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PairInputPanel
