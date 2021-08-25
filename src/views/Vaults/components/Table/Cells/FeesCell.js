import Tooltip from 'components/Tooltip/Tooltip'
import PropTypes from 'prop-types'

const FeesCell = ({ vault, index }) => {
  const { fees } = vault

  return (
    <>
      <Tooltip
        style={{
          zIndex: 1000000 - index,
        }}
        tooltip={
          <div className="w-80 whitespace-normal break-words">
            <p>
              {fees}% of harvest rewards will be used to buyback DFL and burn to
              0x000000000000000000000000000000000000dEaD
            </p>
          </div>
        }
      >
        <div>
          <p>{fees}%</p>
        </div>
      </Tooltip>
      <Tooltip
        style={{
          zIndex: 1000000 - index - 1,
        }}
        tooltip={<>0.09% Withdrawal Fee on holdings will be sent back to Vault</>}
      >
        <div>
          <p>0.09%</p>
        </div>
      </Tooltip>
    </>
  )
}

FeesCell.propTypes = {
  vault: PropTypes.object.isRequired,
  index: PropTypes.number,
}

export default FeesCell
