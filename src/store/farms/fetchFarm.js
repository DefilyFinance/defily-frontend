import address from 'constants/contracts'
import farmsConfig from 'constants/farms'
import tokens from 'constants/tokens'
import { getFarms } from 'utils/farmsHelpers'

const fetchFarms = async (pricesFetch) => {
  return await getFarms(farmsConfig, address.masterChef, pricesFetch, tokens.defily)
}

export default fetchFarms
