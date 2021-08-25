import miniFarmsConfig, { FIELD } from 'constants/miniFarms'
import { getFarms } from 'utils/farmsHelpers'

const fetchFarms = async (pricesFetch) => {
  const data = await Promise.all([
    getFarms(
      miniFarmsConfig[FIELD.LTD].farmsConfig,
      miniFarmsConfig[FIELD.LTD].contractAddress,
      pricesFetch,
      miniFarmsConfig[FIELD.LTD].earningToken,
    ),
    getFarms(
      miniFarmsConfig[FIELD.CHAT].farmsConfig,
      miniFarmsConfig[FIELD.CHAT].contractAddress,
      pricesFetch,
      miniFarmsConfig[FIELD.CHAT].earningToken,
    ),
  ])

  return data
}

export default fetchFarms
