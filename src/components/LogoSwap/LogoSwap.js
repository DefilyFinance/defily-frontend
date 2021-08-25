import classnames from 'classnames'
import { useState } from 'react'
import { HelpCircle } from 'react-feather'

const BAD_SRCS = {}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const LogoSwap = ({ srcs, alt, className, ...rest }) => {
  const [, refresh] = useState(0)

  const src = srcs.find((s) => !BAD_SRCS[s])

  if (src) {
    return (
      <img
        className={classnames(className, 'w-8 h-8 rounded-50 bg-white shadow-md p-1')}
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <HelpCircle {...rest} />
}

export default LogoSwap
