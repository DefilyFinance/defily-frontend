import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'react-feather'
import { getUrlAddress } from 'utils/getUrl'
import { getNameLpToken } from 'utils/tokenHelpers'

const DetailsSection = ({ lpAddress, token0, token1 }) => {
  const [isView, setIsView] = useState(false)
  const lpTokenName = getNameLpToken(token0, token1)

  return (
    <div>
      <div
        className="text-primary font-bold flex items-center justify-center cursor-pointer mt-4"
        onClick={() => setIsView(!isView)}
      >
        <span>Detail</span> {isView ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isView && (
        <div className="text-white mt-2 text-center">
          {token1 && (
            <a
              className="flex items-center justify-center cursor-pointer hover:underline"
              href={`https://defily.io/#/add/${token0.address}/${token1.address}`}
              target="_blank"
            >
              Get {lpTokenName} LP
              <ExternalLink className="ml-1" size={16} />
            </a>
          )}
          <a
            className="flex items-center justify-center cursor-pointer hover:underline"
            href={getUrlAddress(lpAddress)}
            target="_blank"
          >
            View Contract <ExternalLink className="ml-1" size={16} />
          </a>
          <a
            className="flex items-center justify-center cursor-pointer hover:underline"
            href={
              token1
                ? `https://defily.io/#/pipe/0x7cd3c7aFeDD16A72Fba66eA35B2e2b301d1B7093/${lpAddress}`
                : `https://defily.io/#/swap?inputCurrency=kai&outputCurrency=${lpAddress}`
            }
            target="_blank"
          >
            View Exchange
            <ExternalLink className="ml-1" size={16} />
          </a>
        </div>
      )}
    </div>
  )
}

export default DetailsSection
