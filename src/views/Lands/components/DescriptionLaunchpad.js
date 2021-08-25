import React from 'react'
import Button from 'components/Button/Button'

const DescriptionLaunchpad = () => {
  return (
    <div
      style={{
        backgroundImage: 'url(/images/banner.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        minHeight: 600,
      }}
      className="flex items-center px-6 mt-6"
    >
      <div className="container max-w-screen-xl mx-auto grid sm:grid-cols-2">
        <div>
          <h3 className="text-primary font-bold text-2xl py-6">Launch a project on Defily now!</h3>
          <p className="text-white text-md mb-4 sm:mb-8 background-opacity-base-xs sm:bg-transparent p-3 sm:p-0 rounded-lg">
            Defily Launchpad is the platform that helps and advises project teams on how to best issue and launch their
            token. We provide a full service offering starting from advisory services from before the token is even
            issued, to post-listing and marketing support. Our goal is to allow project teams to focus on their project
            development and continue building products, while we handle the marketing, exposure and initial user base.
            We look for strong teams with a unique and innovative vision in the crypto space. If you think you are one
            of these projects, apply below!
          </p>
          <Button
            className="bg-white color-blue1"
            onClick={() => window.open('https://forms.gle/c2piyCoSBoEL16EdA', '_blank')}
          >
            Apply to Launch
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DescriptionLaunchpad
