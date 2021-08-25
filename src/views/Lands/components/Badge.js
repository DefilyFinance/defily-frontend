import React from 'react'
import classnames from 'classnames'

const Badge = ({ children, className }) => (
  <span className={classnames('text-primary bg-blue2 px-4 py-0.5 rounded-xl text-sm', className)}>{children}</span>
)

export default Badge
