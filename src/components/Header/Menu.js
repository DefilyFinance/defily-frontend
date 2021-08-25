import classnames from 'classnames'
import Dropdown from 'components/Dropdown/Dropdown'
import { NavLink, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Box, DollarSign, Edit, Inbox, Layers, Maximize, Minimize2, Moon, Repeat, Shield, Sun } from 'react-feather'

const Menu = ({ className }) => {
  const history = useHistory()

  const listNewMenu = [
    {
      title: 'Dashboard',
      route: '/dashboard',
    },
    {
      title: 'Earn',
      activeRoute: ['/farms', '/mini-farms', '/castles'],
      child: [
        {
          title: 'Defily Farms',
          desc: 'Yield farming to earn Defily Token',
          route: '/farms',
          icon: <Sun />,
        },
        {
          title: 'Mini Farms',
          desc: 'Yield farming to earn Partners Token',
          route: '/mini-farms',
          icon: <Moon />,
        },
        {
          title: 'Dragon Castles',
          desc: 'Stake crypto assets to earn more tokens',
          route: '/castles',
          icon: <Box />,
        },
      ],
    },
    {
      title: 'Invest',
      activeRoute: ['/vaults', '/ido', '/pools'],
      child: [
        {
          title: 'Defily Smart Vaults',
          desc: 'Autofarm from different yield farming opportunities',
          route: '/vaults',
          icon: <DollarSign />,
        },
        {
          title: 'IDO Launchpad',
          desc: 'Invest in the next big crypto projects',
          route: '/ido',
          icon: <Layers />,
        },
        {
          title: 'Pools Aggregators',
          desc: 'Find and compare yield farming opportunities',
          route: '/pools',
          icon: <Inbox />,
        },
      ],
    },
    {
      title: 'Trade',
      activeRoute: ['/swap', '/liquidity', '/add', '/remove', '/find'],
      child: [
        {
          title: 'Defily Swap',
          desc: 'Instantly swap between crypto assets',
          route: '/swap',
          icon: <Repeat />,
        },
        {
          title: 'Buy DFL on Nami',
          url: 'https://nami.exchange/trade/DFL-USDT',
          icon: <Minimize2 />,
        },
      ],
    },
    {
      title: 'Play',
      activeRoute: ['/battles'],
      child: [
        {
          title: 'Dragon Wars',
          desc: 'Play to earn NFT-based game',
          url: 'https://dragonwars.game',
          icon: <Maximize />,
          inside: true,
        },
        {
          title: 'Battles',
          desc: 'Play lottery-style mini game to earn more Dragon tokens',
          route: '/battles',
          icon: <Shield />,
        },
      ],
    },
    {
      title: 'DAO',
      link: 'https://vote.defily.io/#/defily',
      icon: <Edit />,
    },
  ]

  return (
    <div className={classnames('', className)}>
      {listNewMenu.map((menu, index) => {
        if (menu.child) {
          // const pathString = history.location.pathname?.split('/')?.[1]
          return (
            <Dropdown
              key={index}
              menu={menu.title}
              classNameMenuItem="bg-dropdown-menu w-26-rem py-2 border-1 box-shadow-dropdown-menu top-18 left-0"
              classNameMenu={classnames(
                'text-primary xl:py-6',
                // (menu.activeRoute.includes(history.location.pathname) || menu.activeRoute.includes(`/${pathString}`)) &&
                //   'text-black bg-primary rounded-xl',
              )}
              onClick={() => {
                if (menu.child.length === 1) {
                  history.push(menu.child[0].route)
                }
              }}
            >
              {menu.child.map((item, indexChild) => {
                const TagLink = item?.route ? NavLink : 'a'
                return (
                  <TagLink
                    className="px-4 mx-2 py-2 bg-dropdown-item-hover text-white hover:text-white block  mx-2 rounded"
                    key={indexChild}
                    {...(item?.route
                      ? {
                          to: item.route,
                        }
                      : {
                          href: item?.url,
                          target: !item?.inside ? '_blank' : '',
                        })}
                  >
                    <div className="group w-full h-full flex flex-row items-center">
                      <div className="mr-3">{item.icon}</div>
                      <div className="flex-1">
                        {item.title}
                        <p className="group-hover:text-gray-100" style={{ fontSize: 13 }}>
                          {item?.desc}
                        </p>
                      </div>
                    </div>
                  </TagLink>
                )
              })}
            </Dropdown>
          )
        }

        if (menu.link) {
          return (
            <div
              className="mx-2 text-primary px-5 py-2 xl:py-6 cursor-pointer"
              key={index}
              onClick={() => window.open(menu.link)}
            >
              <span className="w-full h-full">{menu.title}</span>
            </div>
          )
        }

        return (
          <NavLink
            className="text-primary px-5 py-2 xl:py-6 mx-2"
            key={index}
            to={menu.route}
            // isActive={(match, location) => {
            //   const pathString = location.pathname?.split('/')?.[1]
            //   if (menu.activeRoute && menu.activeRoute.includes(`/${pathString}`)) return true
            //   return location.pathname === menu.route
            // }}
            // activeClassName="text-black bg-primary rounded-xl"
          >
            <span className="w-full h-full">{menu.title}</span>
          </NavLink>
        )
      })}
    </div>
  )
}

Menu.propTypes = {
  className: PropTypes.string,
}

export default Menu
