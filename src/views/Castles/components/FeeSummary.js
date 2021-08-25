import UnstakingFeeCountdownRow from 'views/Castles/components/UnstakingFeeCountdownRow'

const FeeSummary = ({
  stakingTokenSymbol,
  stakeAmount,
  withdrawalFee,
  lastStakingBlock,
  blockPeriod,
  stakedBalance,
}) => {
  const feeInCake = (parseFloat(stakeAmount) * (withdrawalFee / 100)).toFixed(4)

  return (
    <div>
      <UnstakingFeeCountdownRow
        stakedBalance={stakedBalance}
        className="justify-center"
        fees={withdrawalFee}
        lastStakingBlock={lastStakingBlock}
        blockPeriod={blockPeriod}
      />
      <div className="flex justify-center text-sm-md">
        <p className="mr-2">Unstaking Fee</p>
        <p>
          {stakeAmount ? feeInCake : '-'} {stakingTokenSymbol}
        </p>
      </div>
    </div>
  )
}

export default FeeSummary
