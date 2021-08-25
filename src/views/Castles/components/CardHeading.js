import DoubleLogo from 'components/Logo/DoubleLogo'
import { CASTLE_TAGS } from 'constants/index'
import tokens from 'constants/tokens'
import { formatLogo } from 'utils/formatLogo'
import { getParameterCaseInsensitive } from 'utils/index'

const CardHeading = ({ stakingToken, tags, isFinished }) => {
  const token0 = getParameterCaseInsensitive(tokens, stakingToken?.token0?.symbol ?? '') ?? stakingToken
  const token1 = getParameterCaseInsensitive(tokens, stakingToken?.token1?.symbol ?? '') ?? ''
  const logo = formatLogo(stakingToken.token1 ? token0 : stakingToken, token1)

  return (
    <div className="flex justify-between items-center">
      <DoubleLogo src0={logo.src0} src1={logo.src1} alt0={logo.alt0} alt1={logo.alt1} size={60} />
      <div className="flex flex-col items-end">
        <p className="text-center text-primary text-2xl font-bold">{stakingToken.symbol}</p>
        <div className="flex">
          {tags.map((tag, i) => (
            <p key={i} className="bg-primary px-2 rounded-lg min-w-min ml-1 capitalize">
              {tag}
            </p>
          ))}

          {isFinished && <p className="bg-primary px-2 rounded-lg min-w-min ml-1 capitalize">{CASTLE_TAGS.ended}</p>}
        </div>
      </div>
    </div>
  )
}

export default CardHeading
