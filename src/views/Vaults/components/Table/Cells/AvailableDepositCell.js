import Value from 'components/Value/Value'
import useKardiachain from 'hooks/useKardiachain'
import PropTypes from 'prop-types'
import { getBalanceNumber } from 'utils/formatBalance'

const AvailableDepositCell = ({ vault }) => {
  const { account } = useKardiachain()
  const { userData } = vault

  return <Value value={account ? getBalanceNumber(userData.stakingTokenBalance, vault.decimals) : 0} />
}

AvailableDepositCell.propTypes = {
  vault: PropTypes.object.isRequired,
}

export default AvailableDepositCell
