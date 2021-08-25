import Card from 'components/Card/Card'

const linkCommunity = [
  {
    link: 'https://www.facebook.com/DefilyFinance/',
    icon: <img src="/icon/fb.svg" width="64" height="64" />,
  },
  {
    link: 'https://t.me/defilyfinance',
    icon: <img src="/icon/telegram.svg" width="64" height="64" />,
  },
  {
    link: 'https://twitter.com/defilyfinance',
    icon: <img src="/icon/twitter.svg" width="64" height="64" />,
  },
  {
    link: 'https://defilyfinance.medium.com/',
    icon: <img src="/icon/medium.svg" width="64" height="64" />,
  },
  {
    link: 'https://www.reddit.com/r/DefilyFinance/',
    icon: <img src="/icon/reddit.svg" width="64" height="64" />,
  },
  {
    link: 'https://discord.com/invite/xUU85venae',
    icon: <img src="/icon/discord.svg" width="64" height="64" />,
  },
]

const JoinCommunity = () => {
  return (
    <div className="mt-12 max-w-screen-xl mx-auto mb-12">
      <Card className="text-white text-center  py-16">
        <p className="text-4xl text-primary mb-8">Join the Community and Build</p>
        <div className="flex justify-center">
          {linkCommunity.map((item, index) => (
            <div key={index} className="mx-4 cursor-pointer">
              <a href={item.link} target="_blank">
                {item.icon}
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default JoinCommunity
