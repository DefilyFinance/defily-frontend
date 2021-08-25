import PropTypes from 'prop-types'
import { usePrices } from 'store/prices/hook'
import { getParameterCaseInsensitive } from 'utils/index'
import { getTokenName } from 'utils/tokenHelpers'
import Deposit from 'views/Vaults/components/Table/ActionPanel/Deposit'
import Withdraw from 'views/Vaults/components/Table/ActionPanel/Withdraw'

const ActionPanel = ({ vault, userDataLoaded }) => {
  const symbol = getTokenName(vault?.token1?.symbol ? 'KLP' : '', vault?.token0?.symbol, vault?.token1?.symbol)
  const prices = usePrices()
  const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
  const { userData } = vault

  return (
    <div className="px-2 py-1 sm:px-6 sm:py-4">
      <div className="block lg:flex flex-wrap">
        {!vault.isFinished && (
          <div className="flex-1 p-3">
            <Deposit
              symbol={symbol}
              priceStakingToken={priceStakingToken}
              decimals={vault.decimals}
              userData={userData}
              vault={vault}
              userDataLoaded={userDataLoaded}
            />
          </div>
        )}
        <div className="flex-1 p-3">
          <Withdraw
            symbol={symbol}
            priceStakingToken={priceStakingToken}
            decimals={vault.decimals}
            userData={userData}
            vault={vault}
            userDataLoaded={userDataLoaded}
          />
        </div>
      </div>
      <div className="text-white p-3">
        <p>What does this Vault do?</p>
        <p>Every 5 minutes or faster, the Vault:</p>
        <ul>
          <li>1. Auto-harvest rewards</li>
          <li>2. Charge {vault.fees}% buyback fee on harvest rewards to buyback DFL and burn</li>
          <li>3. {vault.docs || 'Auto-compound back into your staked value'}</li>
          <li>4. Every deposit, withdraw of stakers will also compound for the Vault</li>
          <li>5. You will receive Defily Dungeons Token (DDT) as receipt for your staking</li>
        </ul>
      </div>
    </div>
  )
}

ActionPanel.propTypes = {
  vault: PropTypes.object.isRequired,
  userDataLoaded: PropTypes.bool.isRequired,
}

export default ActionPanel
