import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'react-feather'

const ButtonViewMore = ({ title, route, className }) => {
  return (
    <Link
      className={classnames(
        'cursor-pointer bg-btn-view-more-hover px-2 py-1 rounded text-primary flex flex-row items-center',
        className,
      )}
      to={route}
    >
      {title + '  '}
      <ArrowRight className="ml-3" size={15} />
    </Link>
  )
}

export default ButtonViewMore
