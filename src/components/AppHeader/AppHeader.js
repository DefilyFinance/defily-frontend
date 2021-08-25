import QuestionHelper from 'components/QuestionHelper/index'
import { ArrowLeft } from 'react-feather'
import { Link } from 'react-router-dom'
import Settings from 'views/Swap/components/Settings/index'
import Transactions from 'views/Swap/components/Transactions/index'

const AppHeader = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  return (
    <div className="flex justify-between items-center text-white mb-4">
      {backTo && (
        <Link to={backTo}>
          <ArrowLeft className="mr-2" />
        </Link>
      )}
      <div>
        <h2 className="text-2xl">{title}</h2>
        <div className="flex items-center">
          {helper && <QuestionHelper text={helper} />}
          <p>{subtitle}</p>
        </div>
      </div>
      {!noConfig && (
        <div className="flex justify-end">
          <Settings />
          <Transactions />
        </div>
      )}
    </div>
  )
}

export default AppHeader
