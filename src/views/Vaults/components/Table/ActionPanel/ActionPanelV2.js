import { TYPE_STRATEGY } from 'constants/vaults'
import PropTypes from 'prop-types'
import { usePrices } from 'store/prices/hook'
import { getVaultStaked } from 'store/vaults/helpers'
import { getParameterCaseInsensitive } from 'utils/index'
import { getTokenName } from 'utils/tokenHelpers'
import Deposit from 'views/Vaults/components/Table/ActionPanel/Deposit'
import WithdrawV2 from 'views/Vaults/components/Table/ActionPanel/WithdrawV2'

const ActionPanelV2 = ({ vault, userDataLoaded }) => {
  const vaultStaked = getVaultStaked(vault)
  const symbol = getTokenName(vault?.token1?.symbol ? 'KLP' : '', vault?.token0?.symbol, vault?.token1?.symbol)
  const symbolInVaultStaked = getTokenName(
    vaultStaked?.token1?.symbol ? 'KLP' : '',
    vaultStaked?.token0?.symbol,
    vaultStaked?.token1?.symbol,
  )
  const prices = usePrices()
  const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
  const priceStakingTokenInVaultStaked = getParameterCaseInsensitive(prices, vaultStaked.lpTokenAddress)
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
              isV2
            />
          </div>
        )}
        <div className="flex-1 p-3">
          <WithdrawV2
            decimalsTokenStrategyStaking={vaultStaked.decimals}
            symbol={symbol}
            symbolInVaultStaked={symbolInVaultStaked}
            priceStakingToken={priceStakingToken}
            priceStakingTokenInVaultStaked={priceStakingTokenInVaultStaked}
            decimals={vault.decimals}
            userData={userData}
            vault={vault}
            userDataLoaded={userDataLoaded}
          />
        </div>
      </div>
      <div className="text-white p-3">
        {vault.docsExpand ? (
          <p className="whitespace-pre-line">{vault.docsExpand}</p>
        ) : (
          <>
            <p>What does this Vault do?</p>
            <p>Every 5 minutes or faster, the Vault:</p>
            <ul>
              <li>1. Auto-harvest rewards</li>
              <li>2. Charge {vault.fees}% buyback fee on harvest rewards to buyback DFL and burn</li>
              <li>
                {vault.typeStrategy === TYPE_STRATEGY.stratX4
                  ? vault.docs
                    ? vault.docs
                    : `3. Sell half rewards into ${symbol} to compound back, other half will be sold another half into WKAI and
            another half into BECO to add ${symbolInVaultStaked} LP and deposit into ${symbolInVaultStaked} Vault`
                  : `3. Sell half rewards into ${symbol}, use the other half of ${symbol} to add ${symbolInVaultStaked} LP to put in the highest APY Vault of ${symbolInVaultStaked} LP`}
              </li>
              <li>4. Every deposit, withdraw of stakers will also compound for the Vault</li>
              <li>5. You will receive Defily Dungeons Token (DDT) as receipt for your staking</li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

ActionPanelV2.propTypes = {
  vault: PropTypes.object.isRequired,
  userDataLoaded: PropTypes.bool.isRequired,
}

export default ActionPanelV2
