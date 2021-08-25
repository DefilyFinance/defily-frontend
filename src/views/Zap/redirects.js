import { Redirect } from 'react-router-dom'
import Zap from 'views/Zap/Zap'

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/
export function RedirectOldZapPathStructure(props) {
  const {
    match: {
      params: { currencyIdA },
    },
  } = props
  const match = currencyIdA.match(OLD_PATH_STRUCTURE)
  if (match?.length) {
    return <Redirect to={`/zap/${match[1]}/${match[2]}`} />
  }

  return <Zap {...props} />
}

export function RedirectZapDuplicateTokenIds(props) {
  const {
    match: {
      params: { currencyIdA, currencyIdB },
    },
  } = props
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/zap/${currencyIdA}`} />
  }
  return <Zap {...props} />
}
