import Tooltip from 'components/Tooltip/Tooltip'
import { useState } from 'react'

const HoverInlineText = ({ text, maxCharacters = 20, ...rest }) => {
  const [showHover, setShowHover] = useState(false)

  if (!text) {
    return <span />
  }

  if (text.length > maxCharacters) {
    return (
      <Tooltip tooltip={text} show={showHover}>
        <span onMouseEnter={() => setShowHover(true)} onMouseLeave={() => setShowHover(false)} {...rest}>
          {' ' + text.slice(0, maxCharacters - 1) + '...'}
        </span>
      </Tooltip>
    )
  }

  return <span {...rest}>{text}</span>
}

export default HoverInlineText
