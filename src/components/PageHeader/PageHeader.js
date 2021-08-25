import classnames from 'classnames'
import PropTypes from 'prop-types'

const PageHeader = ({ logo, title, subTitle, className, classNameLogo }) => {
  return (
    <div className={classnames('text-center mb-8 relative z-20', className)}>
      <img
        className={classnames('py-10 mx-auto', classNameLogo)}
        alt="logo"
        src={logo || '/logo.png'}
        width="290"
        height="215"
      />
      <p className="text-white text-4xl z-20">{title}</p>
      <div className="text-2xl text-white z-20">{subTitle}</div>
    </div>
  )
}

PageHeader.propTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.any,
  subOfSubTitle: PropTypes.string,
}

export default PageHeader
