import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const Tabs = ({ children, className, ...rest }) => {
  return (
    <ul {...rest} className={classnames('flex border-b-2 border-blue2 overflow-x-auto', className)}>
      {children}
    </ul>
  )
}
Tabs.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
}

const NavItem = ({ active, children, className, ...rest }) => {
  return (
    <li
      {...rest}
      className={classnames(
        'pt-3 pb-2 sm:pb-3 sm:pr-3 mr-3 sm:mr-10 text-primary cursor-pointer',
        {
          'border-b-4 border-primary': active,
        },
        className,
      )}
    >
      {children}
    </li>
  )
}
NavItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
}

const TabContent = ({ activeTab, children, ...rest }) => {
  if (!Array.isArray(children)) {
    children = [children]
  }
  return (
    <div {...rest}>{children?.map((item, index) => React.cloneElement(item, { active: activeTab, key: index }))}</div>
  )
}

TabContent.propTypes = {
  activeTab: PropTypes.any,
  children: PropTypes.any,
}

const TabPane = ({ active, tabId, className, children, ...rest }) => {
  if (!tabId?.toString() || active?.toString() !== tabId?.toString()) return null
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

TabPane.propTypes = {
  active: PropTypes.any,
  tabId: PropTypes.any,
  className: PropTypes.string,
  children: PropTypes.any,
}

export { Tabs, NavItem, TabContent, TabPane }
