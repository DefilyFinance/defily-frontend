import Card from 'components/Card/Card'
import React from 'react'
import { useHistory } from 'react-router-dom'

const MoreInfo = () => {
  const history = useHistory()

  const list = [
    {
      title: 'Swap',
      icon: '/icon/swap.png',
      link: '',
    },
    {
      title: 'NFT',
      icon: '/icon/mace.png',
      link: '',
    },
    {
      title: 'Farming',
      icon: '/icon/farming-tools.png',
      route: '/farms',
    },
    {
      title: 'Launchpad',
      icon: '/icon/seeding.png',
      link: '',
    },
  ]

  const handleRedirect = (item) => {
    if (item.link) {
      window.open(item.link, '_blank')
    } else {
      history.push(item.route)
    }
  }

  return (
    <div className="bg-blue2 py-10">
      <div className="container mx-auto grid gap-20 grid-cols-4">
        {list.map((item, index) => (
          <Card key={index}>
            <div className="p-10 text-center mx-auto" onClick={() => handleRedirect(item)}>
              <p className="text-white text-3xl mb-5">{item.title}</p>
              <img className="mx-auto" src={item.icon} width="80" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
export default MoreInfo
