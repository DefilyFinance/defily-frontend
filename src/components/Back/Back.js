import { ArrowLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'

const Back = () => {
  const history = useHistory()

  return (
    <ArrowLeft
      className="mt-2 block text-primary z-30 cursor-pointer ml-3 sm:hidden"
      size={32}
      onClick={() => history.goBack()}
    />
  )
}

export default Back
