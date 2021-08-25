import classnames from 'classnames'
import useKardiachain from 'hooks/useKardiachain'
import { CheckCircle, Circle, ExternalLink, XCircle } from 'react-feather'
import { getKardiachainLink } from 'utils/getUrl'

export default function Transaction({ tx }) {
  const { chainId } = useKardiachain()

  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId) return null

  return (
    <div className="flex justify-between my-1" pending={pending} success={success}>
      <a
        target="_blank"
        className={classnames(
          'flex items-center hover-underline',
          pending ? 'text-primary' : success ? 'text-green-600' : 'text-red-500',
        )}
        href={getKardiachainLink(tx.hash, 'transaction')}
      >
        {summary ?? tx.hash} <ExternalLink className="ml-1" size={18} />
      </a>
      <div className={classnames(pending ? 'text-primary' : success ? 'text-green-600' : 'text-red-600')}>
        {pending ? <Circle /> : success ? <CheckCircle /> : <XCircle />}
      </div>
    </div>
  )
}
