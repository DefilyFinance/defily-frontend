import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import useKardiachain from 'hooks/useKardiachain'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useState } from 'react'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getERC20Contract } from 'utils/contractHelpers'

const useAllowance = (lpAddress) => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { fastRefresh } = useRefresh()
  const { account } = useKardiachain()

  useEffect(() => {
    const fetchAllowance = async () => {
      const contract = getERC20Contract()
      const res = await callHelpers(contract, lpAddress, 'allowance', [account, address.masterChef])
      setAllowance(new BigNumber(res))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, fastRefresh, lpAddress])

  return allowance
}

export default useAllowance
