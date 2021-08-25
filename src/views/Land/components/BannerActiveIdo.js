import { useFetchActiveLand, useLandActive } from 'store/lands/hook'
import BoxCounter from './BoxCounter'

const BannerActiveIdo = () => {
  useFetchActiveLand()
  const pool = useLandActive()

  if (!pool?.participants) return null

  return <BoxCounter activeId={pool?.slug || pool?.idoId} />
}

export default BannerActiveIdo
