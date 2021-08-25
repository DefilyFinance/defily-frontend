import { RPC_ENDPOINT } from 'config/index'
import KardiaClient from 'kardia-js-sdk'

const kardiaClient = new KardiaClient({
  endpoint: RPC_ENDPOINT,
})

const kardiaTx = kardiaClient.transaction
const kardiaAccount = kardiaClient.account
const kardiaContract = kardiaClient.contract

export default kardiaClient

export { kardiaTx, kardiaAccount, kardiaContract }
