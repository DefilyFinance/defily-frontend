import { AlertCircle } from 'react-feather'

export function SwapCallbackError({ error }) {
  return (
    <div className="flex items-center p-3 justify-center text-red-500">
      <div>
        <AlertCircle size={24} />
      </div>
      <p>{error}</p>
    </div>
  )
}
