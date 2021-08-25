import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const Table = ({ className, containerClass, containerStyle, children, ...rest }) => {
  return (
    <div style={containerStyle} className={classnames('overflow-x-auto rounded bg-blue2', containerClass)}>
      <table {...rest} className={classnames('custom-table-base text-white w-full', className)}>
        {children}
      </table>
    </div>
  )
}

Table.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  children: PropTypes.any,
}

export default Table
