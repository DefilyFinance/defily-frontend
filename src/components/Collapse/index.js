import React, { useState } from 'react'
import classnames from 'classnames'
import { ChevronRight } from 'react-feather'

const Collapse = ({ prefix, append, title, children, headerClassName, className, defaultExtend }) => {
  const [toggle, setToggle] = useState(!!defaultExtend)
  const onToggle = () => setToggle(!toggle)
  return (
    <div className={className}>
      <div
        className={classnames('flex flex-row justify-between cursor-pointer mb-3', headerClassName)}
        onClick={onToggle}
      >
        <div className={classnames('flex flex-row text-white')}>
          {prefix}
          <span>{title}</span>
          {append}
        </div>
        <div>
          <ChevronRight
            color="white"
            className={classnames('transition duration-100 transform rotate-0', {
              'transition duration-100 transform rotate-90': toggle,
            })}
          />
        </div>
      </div>
      <div
        className={classnames('transition duration-700 h-0 overflow-y-hidden', {
          'transition duration-700 h-auto': toggle,
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default Collapse
