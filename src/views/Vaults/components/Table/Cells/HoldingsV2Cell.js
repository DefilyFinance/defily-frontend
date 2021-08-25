import BigNumber from 'bignumber.js'
import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { usePrices } from 'store/prices/hook'
import { calculatorStakedBalanceOfVaultV2, getVaultStaked } from 'store/vaults/helpers'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'

const HoldingsV2Cell = ({ vault }) => {
  const { account } = useKardiachain()
  const vaultStaked = getVaultStaked(vault)
  const { userData } = vault
  const prices = usePrices()
  const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
  const priceStakingTokenInVaultStaked = getParameterCaseInsensitive(prices, getVaultStaked(vault).lpTokenAddress)

  const { totalStakedBalance } = calculatorStakedBalanceOfVaultV2(
    vault,
    userData,
    priceStakingTokenInVaultStaked,
    priceStakingToken,
    vault.decimals,
    vaultStaked.decimals,
  )

  const usdHoldings = useMemo(() => {
    return priceStakingToken
      ? new BigNumber(getFullDisplayBalance(totalStakedBalance, vault.decimals)).times(priceStakingToken).toNumber()
      : 0
  }, [priceStakingToken, totalStakedBalance, vault.decimals])

  return (
    <>
      <Value value={account ? getBalanceNumber(totalStakedBalance.toNumber(), vault.decimals) : 0} />
      {usdHoldings > 0 && <Value prefix="~$" className="text-sm" value={account ? usdHoldings : 0} />}
    </>
  )
}

HoldingsV2Cell.propTypes = {
  vault: PropTypes.object.isRequired,
}

export default HoldingsV2Cell
