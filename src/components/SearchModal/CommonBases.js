import Button from 'components/Button/Button'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import QuestionHelper from 'components/QuestionHelper/index'
import { currencyEquals, ETHER, Token } from 'defily-v2-sdk'

import { SUGGESTED_BASES } from 'constants/swap'

export default function CommonBases({ chainId, onSelect, selectedCurrency }) {
  return (
    <div>
      <div className="flex items-center my-2">
        <p>Common bases</p>
        <QuestionHelper text="These tokens are commonly paired with other tokens." ml="4px" />
      </div>
      <div className="flex">
        <Button
          className="mx-1"
          size="sm"
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} className="mr-1" />
          <p>KAI</p>
        </Button>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <Button
              className="mx-1"
              size="sm"
              onClick={() => !selected && onSelect(token)}
              disable={selected}
              key={token.address}
            >
              <CurrencyLogo currency={token} className="mr-1" />
              <p>{token.symbol}</p>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
