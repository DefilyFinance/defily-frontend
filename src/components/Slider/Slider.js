import { useCallback } from 'react'
import { Range } from 'react-range'

export default function Slider({ value, onValueChanged, min = 0, step = 1, max = 100, ...rest }) {
  const changeCallback = useCallback(
    (values) => {
      onValueChanged(values[0])
    },
    [onValueChanged],
  )

  return (
    <Range
      {...rest}
      step={step}
      min={min}
      max={max}
      values={[value]}
      onChange={changeCallback}
      renderTrack={({ props, children }) => (
        <div {...props} className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md">
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          className="w-5 h-5 transform translate-x-10 bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        />
      )}
    />
  )
}
