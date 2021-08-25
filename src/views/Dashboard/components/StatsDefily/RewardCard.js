import Card from 'components/Card/Card'
import Value from 'components/Value/Value'
import PropTypes from 'prop-types'

const RewardCard = ({ rewardsDistributed }) => {
  return (
    <Card className="py-4 sm:py-8 px-5 sm:px-10 max-w-xl">
      <div className="flex flex-col justify-between h-full">
        <p className="text-primary text-4xl font-bold">Defily distributed</p>
        {rewardsDistributed > 0 ? (
          <Value className="text-white text-4xl font-bold" value={rewardsDistributed} />
        ) : (
          <p className="text-white text-4xl font-bold">...</p>
        )}
      </div>
    </Card>
  )
}

RewardCard.propTypes = {
  rewardsDistributed: PropTypes.number.isRequired,
}

export default RewardCard
