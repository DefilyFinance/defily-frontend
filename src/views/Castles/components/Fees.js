import QuestionHelper from 'components/QuestionHelper/index'

const Fees = ({ withdrawalFee, harvestFee }) => {
  return (
    <>
      {withdrawalFee && (
        <div className="mt-2 border-2 border-primary rounded-2xl text-white flex justify-between px-4 py-2">
          <p>Fee</p>
          <div className="flex items-center">
            {withdrawalFee}% in 72 hours
            <QuestionHelper
              classNameToolTip="tooltip-center"
              text={
                <>
                  <p>Unstaking fee: {withdrawalFee}%</p>
                  <p>
                    Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets
                    every time you stake in the pool.
                  </p>
                </>
              }
            />
          </div>
        </div>
      )}
      {harvestFee && (
        <div className="mt-2 border-2 border-primary rounded-2xl text-white flex justify-between px-4 py-2">
          <p>Harvest fee</p>
          <div className="flex items-center">
            {harvestFee}%
            <QuestionHelper
              classNameToolTip="tooltip-center"
              text={`${harvestFee}% harvest fee will be charged on your rewards`}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Fees
