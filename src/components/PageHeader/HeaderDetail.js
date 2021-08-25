import React from 'react'

const HeaderDetail = ({ title, children }) => {
  return (
    <div className="text-center mb-16 sm:mb-4 xl:mb-10">
      <h2 className="text-primary text-4xl font-bold mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default HeaderDetail
