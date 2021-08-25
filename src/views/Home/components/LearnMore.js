import Card from 'components/Card/Card'
import { useHistory } from 'react-router-dom'

const listMore = [
  {
    title: 'Intro to DAO',
    link: 'https://defilyfinance.medium.com/introducing-defily-finance-3fc032408b7e',
  },
  {
    title: 'How the DAO Works',
    link: 'https://academy.binance.com/en/articles/decentralized-autonomous-organizations-daos-explained',
  },
  {
    title: 'Liquidity Mining',
    route: '/dashboard',
  },
]

const LearnMore = () => {
  const history = useHistory()

  return (
    <div className="text-center max-w-screen-xl mx-auto text-white mt-24">
      <p className="text-4xl mb-12">Learn More About Defily</p>
      <div className="flex justify-between text-white flex-wrap gap-8 whitespace-nowrap px-3">
        {listMore.map((item, index) => (
          <Card
            key={index}
            color="primary"
            className="p-12 cursor-pointer flex-1"
            onClick={() => {
              if (item?.link) {
                return window.open(item.link, '_blank')
              }
              history.push(item.route)
            }}
          >
            <span className="text-2xl text-blue1 font-bold">{item.title}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default LearnMore
