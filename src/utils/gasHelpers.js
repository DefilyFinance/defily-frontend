import kardiaClient from 'plugin/kardia-dx'

export const getRecommendedGasPrice = async () => {
  const gasPrice = await kardiaClient.kaiChain.getGasPrice()
  return Number(gasPrice)
}
