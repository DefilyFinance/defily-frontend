import Button from 'components/Button/Button'
import PageHeader from 'components/PageHeader/PageHeader'
import { useParams } from 'react-router-dom'
import { useFetchPoolUserData } from 'store/castles/hook'
import { useCastleFromPid } from '../store/castles/hook'

const withAuthCastle = (Component) => (props) => {
  const { pid } = useParams()
  const pool = useCastleFromPid(pid)
  useFetchPoolUserData()

  if (!pool)
    return (
      <div className="container text-center  mx-auto px-3">
        <PageHeader logo="/logo.png" />
        <p className="text-white">Not found</p>
        <Button className="mx-auto" onClick={() => history.push('/castles')}>
          Back
        </Button>
      </div>
    )

  return <Component {...props} />
}

export default withAuthCastle
