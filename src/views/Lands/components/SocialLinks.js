import PropTypes from 'prop-types'

const SocialLinks = ({ data, className }) => {
  return (
    <div className={className}>
      {Array.isArray(data) &&
        data.map((item, index) => (
          <a
            className="mr-3"
            target="_blank"
            key={index}
            href={item.link}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <img src={item?.src} alt={item?.title} className="m-auto" width="25" height="25" />
          </a>
        ))}
    </div>
  )
}

SocialLinks.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
}

export default SocialLinks
