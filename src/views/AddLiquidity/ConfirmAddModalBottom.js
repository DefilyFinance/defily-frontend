import Button from 'components/Button/Button'
import CurrencyLogo from 'components/LogoSwap/CurrencyLogo'
import { Field } from 'store/mint/actions'

function ConfirmAddModalBottom({ noLiquidity, price, currencies, parsedAmounts, poolTokenPercentage, onAdd }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p>{currencies[Field.CURRENCY_A]?.symbol} Deposited</p>
        <div className="flex items-center">
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} className="mr-1" />
          <p>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p>{currencies[Field.CURRENCY_B]?.symbol} Deposited</p>
        <div className="flex items-center">
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <p>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</p>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <p>Rates</p>
        <p>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </p>
      </div>
      <div>
        <p className="text-right">
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </p>
      </div>
      <div className="flex justify-between my-2">
        <p>Share of Pool:</p>
        <p>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</p>
      </div>
      <Button onClick={onAdd} className="w-full mt-4">
        {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
