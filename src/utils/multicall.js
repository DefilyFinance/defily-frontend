import { ethers } from 'ethers'
import address from 'constants/contracts'

import multicallAbi from 'config/abi/multicall.json'
import { simpleRpcProvider } from 'utils/providers'

const multicall = async (abi, calls) => {
  const provider = simpleRpcProvider
  const multi = new ethers.Contract(address.multicall, multicallAbi, provider)

  const itf = new ethers.utils.Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])

  const { returnData } = await multi.aggregate(calldata)

  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

export default multicall
