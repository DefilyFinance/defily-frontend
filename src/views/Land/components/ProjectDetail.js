import PropTypes from 'prop-types'
import { getLink } from 'utils'

const ProjectDetail = ({ pool }) => {
  const { name, detail } = pool
  return (
    <div className="flex-1 flex justify-center mt-3">
      <div className="bg-blue2 text-white p-3 md:p-10 rounded-xl w-full">
        <h3 className="text-2xl mb-3 font-bold">{name}</h3>
        <div>
          {Array.isArray(detail?.description) &&
            detail?.description?.map((text, index) => (
              <p key={index} className="mb-3">
                {text}
              </p>
            ))}
        </div>
        <div>
          {Array.isArray(detail?.links) &&
            detail?.links?.map((link, index) => (
              <div key={index} className="pt-2">
                <p className="break-words">
                  <span className="font-bold block sm:inline">{link?.label}:</span>
                  {link?.url ? (
                    <a
                      href={getLink(link.url)}
                      target="_blank"
                      className="ml-0 sm:ml-2 hover:underline hover:text-primary"
                    >
                      {link?.url}
                    </a>
                  ) : null}
                </p>
                {Array.isArray(link?.regionUrl) &&
                  link?.regionUrl?.map((subLink, i) => (
                    <p className="ml-2 break-words" key={i}>
                      <span>
                        {subLink?.label}:{' '}
                        <a href={getLink(subLink?.url)} target="_blank" className="hover:underline hover:text-primary">
                          {subLink?.url}
                        </a>
                      </span>
                    </p>
                  ))}
              </div>
            ))}
        </div>
        <div className="px-0 flex justify-center item-end">
          {detail?.videoUrl ? (
            <div className="my-6 md:my-12">
              <video id="video" controls autoPlay>
                <source id="source" src={detail?.videoUrl} type="video/mp4" />
              </video>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

ProjectDetail.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default ProjectDetail
