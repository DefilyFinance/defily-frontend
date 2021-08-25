import Back from 'components/Back/Back'
import { useHistory, useParams } from 'react-router-dom'
import Detail from './components/Detail'
import { useFetchLand, useLandFromIdoId } from 'store/lands/hook'
import Loader from 'components/Loader/Loader'
import { useFetchLandUserData } from 'store/lands/hook'

const Land = () => {
  const history = useHistory()
  const { id } = useParams()
  useFetchLand(id)
  useFetchLandUserData(id)
  const pool = useLandFromIdoId(id)

  if (pool === undefined) {
    history.goBack()
  }

  if (!pool) {
    return (
      <>
        <Back />
        <div className="container mx-auto p-3">
          <Loader className="border-t-4 h-20 w-20 mx-auto" />
        </div>
      </>
    )
  }

  return (
    <>
      <Back />
      <div className="px-4 sm:px-6">
        <div className="container max-w-screen-xl mx-auto">
          <Detail pool={pool} />
        </div>
      </div>
    </>
  )
}

export default Land
