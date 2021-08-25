import Loader from 'components/Loader/Loader'
import ProjectCard from './ProjectCard'
import PropTypes from 'prop-types'

const ListProjects = ({ title, data }) => {
  return (
    <div>
      <h2 className="text-center text-primary text-2xl mt-4 mb-8 font-bold">{title}</h2>
      {data.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-4">
          {data.map((item, index) => (
            <ProjectCard key={index} pool={item} index={index} />
          ))}
        </div>
      ) : (
        <Loader className="border-t-4 h-20 w-20 mx-auto mt-12 mb-8" />
      )}
    </div>
  )
}

ListProjects.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
}

export default ListProjects
