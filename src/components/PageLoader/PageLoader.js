import Loader from 'components/Loader/Loader'

const PageLoader = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-blue1">
      <div>
        <img src="/logo.png" width="300" height="300" className="mx-auto" />
        <Loader className="border-t-4 h-20 w-20 mx-auto" />
      </div>
    </div>
  )
}

export default PageLoader
