import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import PropTypes from 'prop-types'
import { ChevronDown } from 'react-feather'
import { useHistory } from 'react-router-dom'

const Dropdown = ({
  menu,
  children,
  className,
  classNameMenu,
  classNameMenuItem,
  onClick,
  bsPrefixMenu,
  isArrow = true,
}) => {
  const history = useHistory()
  const { pathname } = history.location
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    closeMenu()
  }, [pathname])

  return (
    <Menu as="div" className={classnames('relative inline-block', className)}>
      <Menu.Button
        className={classnames(
          bsPrefixMenu ? bsPrefixMenu : ' w-full shadow-sm px-5 py-2 focus:outline-none focus:boxShadow:none',
          classNameMenu,
        )}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <div className="flex items-center justify-center" onClick={onClick}>
          {menu}
          {isArrow && <ChevronDown className="ml-1" size={16} />}
        </div>
      </Menu.Button>

      <Transition
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className={classnames(
            'origin-top-left absolute right-0 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50',
            classNameMenuItem,
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

Dropdown.propTypes = {
  children: PropTypes.node,
  menu: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
  classNameMenu: PropTypes.string,
  classNameMenuItem: PropTypes.string,
  isArrow: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Dropdown
