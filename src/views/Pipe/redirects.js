import { Redirect } from 'react-router-dom'
import Pipe from 'views/Pipe/Pipe'

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/
export function RedirectOldPipePathStructure(props) {
  const {
    match: {
      params: { pairIdA },
    },
  } = props
  const match = pairIdA.match(OLD_PATH_STRUCTURE)
  if (match?.length) {
    return <Redirect to={`/pipe/${match[1]}/${match[2]}`} />
  }

  return <Pipe {...props} />
}

export function RedirectPipeDuplicateTokenIds(props) {
  const {
    match: {
      params: { pairIdA, pairIdB },
    },
  } = props
  if (pairIdA.toLowerCase() === pairIdB.toLowerCase()) {
    return <Redirect to={`/pipe/${pairIdA}`} />
  }
  return <Pipe {...props} />
}
