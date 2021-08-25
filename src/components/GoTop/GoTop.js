import { useEffect, useState } from 'react'
import { ChevronUp } from 'react-feather'

const GoTop = () => {
  const [isPosition, setIsPosition] = useState(false)

  const scrollToTop = () => {
    window.scroll(0, 0)
  }

  const renderGoTopIcon = () => {
    if (isPosition) {
      return (
        <div className="fixed bottom-8 right-8 cursor-pointer z-50 shadow-2xl" onClick={scrollToTop}>
          <div className="bg-white rounded-50 p-2">
            <ChevronUp size={28} />
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    window.document.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        setIsPosition(true)
      } else {
        setIsPosition(false)
      }
    })
    window.scrollTo(0, 0)
  }, [])

  return <>{renderGoTopIcon()}</>
}

export default GoTop
