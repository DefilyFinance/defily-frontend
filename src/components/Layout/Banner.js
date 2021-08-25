import React from 'react'
import classnames from 'classnames'

const Banner = ({ bg, children, containClass }) => {
  return (
    <>
      <div
        style={{
          backgroundImage: bg,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className="banner-background w-full m-auto relative mb-3"
      >
        <div className="absolute bottom-0 w-full">
          <div className={classnames('container max-w-screen-xl m-auto hidden sm:block', containClass)}>{children}</div>
        </div>
      </div>
      <div className="block sm:hidden">{children}</div>
    </>
  )
}

export default Banner
