import Button from 'components/Button/Button'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

const ActionCell = ({ pool }) => {
  const history = useHistory()
  return (
    <Button
      className="text-black"
      onClick={() => {
        if (pool.link) return window.open(pool.link)
        history.push(pool.route)
      }}
    >
      Stake
    </Button>
  )
}

ActionCell.propTypes = {
  pool: PropTypes.object.isRequired,
}

export default ActionCell
