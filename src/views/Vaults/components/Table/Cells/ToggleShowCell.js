import PropTypes from 'prop-types'
import { ChevronUp, ChevronDown } from 'react-feather'

const ToggleShowCell = ({ row }) => {
  return (
    <div>
      <span className="text-primary font-bold hidden sm:block">{row.isExpanded ? 'HIDE' : 'SHOW'}</span>
      <span className="text-primary font-bold block sm:hidden">{row.isExpanded ? <ChevronUp /> : <ChevronDown />}</span>
    </div>
  )
}

ToggleShowCell.propTypes = {
  row: PropTypes.object.isRequired,
}

export default ToggleShowCell
