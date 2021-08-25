import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import { ArrowRight } from 'react-feather'
import { useHistory } from 'react-router-dom'

const StartEarning = () => {
  const history = useHistory()

  return (
    <div className="bg-blue1 px-3">
      <div className="lg:max-w-screen-lg md:max-w-screen-md mx-auto py-10 flex items-center justify-between">
        <img src="/images/egg.svg" className="max-w-xs h-52 mr-10 hidden sm:block" />
        <Card color="primary" className="flex-1 max-w-3xl	">
          <div className="text-right py-10 pr-12">
            <Button outline className="ml-auto" onClick={() => history.push('/farms')}>
              <span className="flex items-center">
                Go to farms <ArrowRight className="ml-2" />
              </span>
            </Button>
            <p className="text-blue1 text-4xl font-bold">Start Earning</p>
            <p className="text-lg text-blue1">
              Please install the{' '}
              <a
                className="underline"
                target="_blank"
                href={`https://chrome.google.com/webstore/search/kardiachain%20wallet`}
              >
                Kardia Extension Wallet
              </a>{' '}
              to access
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StartEarning
