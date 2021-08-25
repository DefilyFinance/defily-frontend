import Button from 'components/Button/Button'
import ContainerPage from 'components/Container/ContainerPage'
import PageHeader from 'components/PageHeader/PageHeader'
import { useHistory } from 'react-router-dom'

const NotFound = () => {
  const history = useHistory()

  return (
    <ContainerPage>
      <PageHeader logo="/logo.png" title="Page Not Found...!" />
      <Button className="mx-auto" onClick={() => history.push('/')}>
        Back Home
      </Button>
    </ContainerPage>
  )
}

export default NotFound
