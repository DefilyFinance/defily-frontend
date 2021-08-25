import Account from 'components/Account/Account'
import Logo from 'components/Header/Logo'
import Menu from 'components/Header/Menu'
import MenuMobile from 'components/Header/MenuMobile'

const Header = () => {
  return (
    <header
      id="defily-header-page"
      className="bg-blue1 py-4 xl:py-1 px-3 relative z-50 flex justify-between items-center"
    >
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center flex-1">
        <Logo className="sm:flex" />
        <Menu className="xl:flex flex-wrap justify-center hidden" />
        <Account />
      </div>
      <MenuMobile />
    </header>
  )
}

export default Header
