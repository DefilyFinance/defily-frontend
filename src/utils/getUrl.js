export const getUrlTx = (txHash) => {
  return `https://explorer.kardiachain.io/tx/${txHash?.toLowerCase()}`
}

export const getUrlAddress = (address) => {
  return `https://explorer.kardiachain.io/address/${address?.toLowerCase()}`
}

export const getUrlPair = (address) => {
  return `https://kaidex.io/exchange/${address?.toLowerCase()}`
}

export function getKardiachainLink(data, type) {
  const prefix = `https://explorer.kardiachain.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}
