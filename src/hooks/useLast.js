import { useEffect, useState } from 'react'

/**
 * Returns the last value of type T that passes a filter function
 * @param value changing value
 * @param filterFn function that determines whether a given value should be considered for the last value
 */
function useLast(value, filterFn) {
  const [last, setLast] = useState(filterFn && filterFn(value) ? value : undefined)
  useEffect(() => {
    setLast((prev) => {
      const shouldUse: boolean = filterFn ? filterFn(value) : true
      if (shouldUse) return value
      return prev
    })
  }, [filterFn, value])
  return last
}

function isDefined(x) {
  return x !== null && x !== undefined
}

/**
 * Returns the last truthy value of type T
 * @param value changing value
 */
function useLastTruthy<T>(value: T | undefined | null): T | null | undefined {
  return useLast(value, isDefined)
}

export default useLastTruthy
