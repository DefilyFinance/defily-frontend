import PropTypes from 'prop-types'
import { escapeRegExp } from 'utils/index'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const NumericalInput = ({ value, onUserInput, placeholder = '0.0', ...rest }) => {
  const enforcer = (nextUserInput) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  return (
    <input
      {...rest}
      className="w-full text-right p-2 border-primary border-2 rounded-2xl"
      value={value}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      // universal input options
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  )
}

NumericalInput.propTypes = {
  value: PropTypes.string,
  onUserInput: PropTypes.func,
  placeholder: PropTypes.string,
}

export default NumericalInput
