import classnames from 'classnames'
import Card from 'components/Card/Card'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails } from './AdvancedSwapDetails'

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }) {
  const lastTrade = useLastTruthy(trade)

  return (
    <Card
      className={classnames('max-w-md mx-auto mt-4 p-5 rounded-2xl bg-blue1 ', Boolean(trade) ? 'block' : 'hidden')}
    >
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </Card>
  )
}
