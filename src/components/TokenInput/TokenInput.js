import Button from 'components/Button/Button'
import NumericalInput from 'components/NumericalInput/NumericalInput'
import PropTypes from 'prop-types'
import { getFullDisplayBalance } from 'utils/formatBalance'

const TokenInput = ({
  symbol,
  max,
  onUserInput,
  value,
  disabled,
  description,
  onMax,
  onMin,
  currencyValue,
  decimals = 18,
}) => {
  return (
    <div>
      <p className="text-right">
        {getFullDisplayBalance(max, decimals)} {symbol} Available
      </p>
      <NumericalInput disabled={disabled} value={value} onUserInput={onUserInput} />
      <p className="text-sm text-right">{currencyValue}</p>
      {description ? <p className="text-sm text-right">{description}</p> : null}
      <div className="flex justify-end">
        {typeof onMin === 'function' ? (
          <Button onClick={onMin} disabled={disabled} className="mt-2 mr-2">
            Min
          </Button>
        ) : null}
        {!disabled ? (
          <Button onClick={onMax} disabled={disabled} className="mt-2">
            Max
          </Button>
        ) : null}
      </div>
    </div>
  )
}

TokenInput.propTypes = {
  symbol: PropTypes.string.isRequired,
  onUserInput: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  max: PropTypes.any,
  onMax: PropTypes.func,
  currencyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  decimals: PropTypes.number,
}

export default TokenInput
