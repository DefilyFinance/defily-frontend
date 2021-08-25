import BigNumber from 'bignumber.js'
import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import PropTypes from 'prop-types'
import { usePrices } from 'store/prices/hook'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getParameterCaseInsensitive } from 'utils/index'

const HoldingsCell = ({ vault }) => {
  const { account } = useKardiachain()
  const { userData } = vault
  const prices = usePrices()
  const priceStakingToken = getParameterCaseInsensitive(prices, vault.lpTokenAddress)
  const usdHoldings = priceStakingToken
    ? new BigNumber(getFullDisplayBalance(userData.stakedBalance, vault.decimals)).times(priceStakingToken).toNumber()
    : 0

  return (
    <>
      <Value value={account ? getBalanceNumber(userData.stakedBalance, vault.decimals) : 0} />
      {usdHoldings > 0 && <Value prefix="~$" className="text-sm" value={account ? usdHoldings : 0} />}
    </>
  )
}

HoldingsCell.propTypes = {
  vault: PropTypes.object.isRequired,
}

export default HoldingsCell
