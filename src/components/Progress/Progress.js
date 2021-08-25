import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const Progress = ({ containerClass, percent, barClass, progressClass }) => {
  return (
    <div className={classnames('relative pt-1 w-full', containerClass)}>
      <div className={classnames('overflow-hidden h-2 text-xs flex rounded bg-blue2', barClass)}>
        <div
          style={{ width: `${percent || 0}%` }}
          className={classnames(
            'shadow-none flex flex-col whitespace-nowrap rounded justify-center bg-primary',
            progressClass,
          )}
        />
      </div>
    </div>
  )
}
Progress.propTypes = {
  percent: PropTypes.number.isRequired,
  containerClass: PropTypes.string,
  barClass: PropTypes.string,
  progressClass: PropTypes.string,
}

export default Progress
