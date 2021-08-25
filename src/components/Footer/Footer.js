import classnames from 'classnames'
import { pathBgFooter, pathNoDragon, subPathNoDragon } from 'config/index'
import { useHistory } from 'react-router-dom'
import { useMemo } from 'react'

const Footer = () => {
  const history = useHistory()
  const { pathname } = history.location
  const noDragon = useMemo(() => {
    if (pathNoDragon.includes(history.location.pathname?.toLowerCase())) {
      return false
    }
    const pathString = history.location.pathname?.split('/')?.[1]
    if (subPathNoDragon.includes(pathString)) {
      return false
    }
    return true
  }, [history.location.pathname])

  const listFooter = [
    {
      title: 'Docs',
      link: 'https://docs.defily.io/',
    },
    {
      title: 'Token Contract',
      link: 'https://explorer.kardiachain.io/address/0xD675fF2B0ff139E14F86D87b7a6049ca7C66d76e',
    },
    {
      title: 'Farm Contract',
      link: 'https://explorer.kardiachain.io/address/0x0245a1f57Ee84b55Cf489Eb5F3d27355014e57f8',
    },
    {
      title: 'Telegram',
      link: 'https://t.me/defilyfinance',
    },
    {
      title: 'Twitter',
      link: 'https://twitter.com/defilyfinance',
    },
    {
      title: 'Medium',
      link: 'https://defilyfinance.medium.com/',
    },
    {
      title: 'Reddit',
      link: 'https://www.reddit.com/r/DefilyFinance/',
    },
    {
      title: 'Fanpage',
      link: 'https://www.facebook.com/DefilyFinance/',
    },
    {
      title: 'Group',
      link: 'https://www.facebook.com/groups/defilyfinance/',
    },
    {
      title: 'Discord',
      link: 'https://discord.gg/xUU85venae',
    },
  ]

  return (
    <footer
      className={classnames(
        'px-3 relative z-20',
        noDragon || pathBgFooter.includes(pathname) ? 'bg-transparent' : 'bg-blue2',
      )}
    >
      <div className="flex justify-center flex-wrap py-5">
        {listFooter.map((item, index) => (
          <a
            className="lg:mx-4 md:mx-2 mx-2 text-white hover:text-primary"
            target="_blank"
            key={index}
            href={item.link}
          >
            {item.title}
          </a>
        ))}
      </div>
    </footer>
  )
}

export default Footer
