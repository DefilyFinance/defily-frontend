import BigNumber from 'bignumber.js'
import address from 'constants/contracts'
import React, { useEffect, useState } from 'react'
import { BIG_ZERO } from 'utils/bigNumber'
import { callHelpers } from 'utils/callHelpers'
import { getMasterChefContract } from 'utils/contractHelpers'

const useTotalAllocPoints = () => {
  const [totalAllocPoint, setTotalAllocPoint] = useState(BIG_ZERO)

  useEffect(() => {
    const fetchTotalAllocPoint = async () => {
      try {
        const masterChefContract = getMasterChefContract()
        const res = await callHelpers(masterChefContract, address.masterChef, 'totalAllocPoint')

        setTotalAllocPoint(new BigNumber(res))
      } catch (e) {}
    }

    fetchTotalAllocPoint()
  }, [])

  return totalAllocPoint
}

export default useTotalAllocPoints
