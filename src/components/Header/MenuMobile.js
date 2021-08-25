import classnames from 'classnames'
import { useState } from 'react'
import {
  Box,
  DollarSign,
  Edit,
  Inbox,
  Layers,
  Maximize,
  Menu,
  Minimize2,
  Moon,
  Repeat,
  Shield,
  Sun,
  X,
} from 'react-feather'
import { NavLink } from 'react-router-dom'
import Collapse from '../Collapse'

const MenuMobile = () => {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

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
    <>
      <Menu className="text-primary ml-4 cursor-pointer block xl:hidden" size={32} onClick={() => setOpen(!open)} />
      {open && <div className="z-40 opacity-8 fixed top-0 left-0 w-full h-full" onClick={closeMenu} />}
      <div
        className={classnames(
          'transition-transform h-full overflow-y-auto duration-200 shadow-lg absolute left-full z-50 bg-blue1 w-full h-auto py-4 w-screen menu-slide-mobile',
          open && 'transform -translate-x-full',
          !open && 'transform -translate-x-0',
        )}
        style={{
          top: '0',
          position: 'fixed',
        }}
      >
        <div className="flex flex-row justify-end">
          <div className="rounded p-3 bg-dropdown-item-hover mr-4 cursor-pointer" onClick={closeMenu}>
            <X color="white" />
          </div>
        </div>
        {listNewMenu.map((menu, index) => {
          if (menu.link) {
            return (
              <div
                className="text-white px-10 py-2.5 block whitespace-nowrap cursor-pointer bg-dropdown-item-hover"
                key={index}
                onClick={() => window.open(menu.link)}
              >
                <div className="w-full h-full flex flex-row items-center">
                  {/*<span>{menu?.icon}</span>*/}
                  <span>{menu.title}</span>
                </div>
              </div>
            )
          }

          if (menu.child) {
            return (
              <Collapse key={index} className="py-1.5" headerClassName="px-10" defaultExtend title={menu?.title}>
                {menu.child?.map((item, i) => {
                  const TagLink = item?.route ? NavLink : 'a'
                  return (
                    <TagLink
                      key={`collapse-${i}`}
                      className="block pl-10 bg-dropdown-item-hover"
                      {...(item?.route
                        ? {
                            to: item.route,
                          }
                        : {
                            href: item?.url,
                            target: !item?.inside ? '_blank' : '',
                          })}
                      onClick={closeMenu}
                    >
                      <div className="group h-full flex flex-row items-center ml-1 px-4 py-2.5 text-white">
                        <div className="mr-3">{item.icon}</div>
                        <div className="flex-1">{item.title}</div>
                      </div>
                    </TagLink>
                  )
                })}
              </Collapse>
            )
          }

          return (
            <NavLink
              className="group text-white px-10 py-2.5 block whitespace-nowrap bg-dropdown-item-hover"
              key={index}
              to={menu.route}
              isActive={(match, location) => location.pathname === menu.route}
              activeClassName="text-white bg-primary"
              onClick={closeMenu}
            >
              <div className="w-full h-full flex flex-row items-center">
                {/*<span className="group-hover:hover:text-blue1">{menu?.icon}</span>*/}
                <span>{menu.title}</span>
              </div>
            </NavLink>
          )
        })}
      </div>
    </>
  )
}

export default MenuMobile
