import Button from 'components/Button/Button'
import Input from 'components/Input/Input'
import QuestionHelper from 'components/QuestionHelper/index'
import { INITIAL_ALLOWED_SLIPPAGE } from 'constants/swap'
import { useState } from 'react'

const SlippageError = {
  InvalidInput: 'InvalidInput',
  RiskyLow: 'RiskyLow',
  RiskyHigh: 'RiskyHigh',
}

const DeadlineError = {
  InvalidInput: 'InvalidInput',
}

export default function TransactionSettings({ rawSlippage, setRawSlippage, deadline, setDeadline }) {
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 10) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div>
        <div className="flex items-center mt-2">
          <p>Slippage Tolerance</p>
          <QuestionHelper
            text="Your transaction will revert if the price changes unfavorably by more than this percentage."
            classNameToolTip="tooltip-center"
          />
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(INITIAL_ALLOWED_SLIPPAGE)
            }}
          >
            Auto
          </Button>
          <div className="flex-1 flex items-center ml-2">
            <Input
              placeholder={(rawSlippage / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((rawSlippage / 100).toFixed(2))
              }}
              onChange={(e) => parseCustomSlippage(e.target.value)}
            />
            <p className="ml-1">%</p>
          </div>
        </div>
        {!!slippageError && (
          <div
            style={{
              fontSize: '14px',
              paddingTop: '7px',
              color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E',
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? 'Enter a valid slippage percentage'
              : slippageError === SlippageError.RiskyLow
              ? 'Your transaction may fail'
              : 'Your transaction may be frontrun'}
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="flex items-center">
          <p>Transaction deadline</p>
          <QuestionHelper
            classNameToolTip="tooltip-center"
            text="Your transaction will revert if it is pending for more than this long."
          />
        </div>
        <div className="flex items-center">
          <Input
            className="max-w-xs"
            color={deadlineError ? 'red' : undefined}
            onBlur={() => {
              parseCustomDeadline((deadline / 60).toString())
            }}
            placeholder={(deadline / 60).toString()}
            value={deadlineInput}
            onChange={(e) => parseCustomDeadline(e.target.value)}
          />
          <p className="ml-1">minutes</p>
        </div>
      </div>
    </div>
  )
}
