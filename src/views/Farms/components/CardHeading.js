import DoubleLogo from 'components/Logo/DoubleLogo'
import { formatLogo } from 'utils/formatLogo'
import { getNameLpToken } from 'utils/tokenHelpers'

const CardHeading = ({ token0, token1, multiplier }) => {
  const lpTokenName = getNameLpToken(token0, token1)
  const logo = formatLogo(token0, token1)

  return (
    <div className="flex justify-between items-center">
      <DoubleLogo src0={logo.src0} src1={logo.src1} alt0={logo.alt0} alt1={logo.alt1} size={60} />
      <div className="flex flex-col items-end">
        <p className="text-center text-primary text-2xl font-bold">{lpTokenName}</p>
        <p className="bg-primary px-2 rounded-lg min-w-min">{multiplier ? multiplier : '...'}X</p>
      </div>
    </div>
  )
}

export default CardHeading
