import { JSBI, Percent } from 'defily-v2-sdk'

const PercentPicker = ({ onChangePercentInput }) => {
  return (
    <div className="flex justify-between mt-2">
      <button
        className="bg-primary rounded-xl px-4 sm:px-6 py-1"
        onClick={() => onChangePercentInput(new Percent(JSBI.BigInt(2500), JSBI.BigInt(10000)))}
      >
        25%
      </button>
      <button
        className="bg-primary rounded-xl px-4 sm:px-6 py-1"
        onClick={() => onChangePercentInput(new Percent(JSBI.BigInt(5000), JSBI.BigInt(10000)))}
      >
        50%
      </button>
      <button
        className="bg-primary rounded-xl px-4 sm:px-6 py-1"
        onClick={() => onChangePercentInput(new Percent(JSBI.BigInt(7500), JSBI.BigInt(10000)))}
      >
        75%
      </button>
      <button
        className="bg-primary rounded-xl px-4 sm:px-6 py-1"
        onClick={() => onChangePercentInput(new Percent('100'))}
      >
        100%
      </button>
    </div>
  )
}

export default PercentPicker
