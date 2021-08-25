import { RPC_ENDPOINT } from 'config/index'
import { ethers } from 'ethers'

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT)

export default null
