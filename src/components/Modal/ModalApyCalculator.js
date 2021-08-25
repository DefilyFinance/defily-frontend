import tokens from 'constants/tokens'
import { useMemo } from 'react'
import Modal from './Modal'
import ModalTitle from './ModalTitle'
import PropTypes from 'prop-types'
import { getRoi, tokenEarnedPerThousandDollarsCompounding } from 'utils/compoundApyHelpers'
import { formatNumberMinifiedCharacters } from 'utils'
import { TRADING_FEE } from 'config'
import { ExternalLink } from 'react-feather'
import { Link } from 'react-router-dom'

const ModalApyCalculator = ({
  open,
  onClose,
  earningTokenSymbol = 'DFL',
  apr,
  tokenPrice,
  data,
  roundingDecimals = 2,
  compoundFrequency = 1,
  performanceFee = 0,
  tokenEarnedPerThousandDaily,
  isFarm = false,
}) => {
  const oneThousandDollarsWorthOfToken = 1000 / tokenPrice
  let tokenEarnedPerThousand1D = undefined
  let tokenEarnedPerThousand7D = undefined
  let tokenEarnedPerThousand30D = undefined
  let tokenEarnedPerThousand365D = undefined
  if (!isFarm) {
    tokenEarnedPerThousand1D = tokenEarnedPerThousandDollarsCompounding({
      numberOfDays: 1,
      farmApr: apr,
      tokenPrice,
      roundingDecimals,
      compoundFrequency,
      performanceFee,
    })
    tokenEarnedPerThousand7D = tokenEarnedPerThousandDollarsCompounding({
      numberOfDays: 7,
      farmApr: apr,
      tokenPrice,
      roundingDecimals,
      compoundFrequency,
      performanceFee,
    })
    tokenEarnedPerThousand30D = tokenEarnedPerThousandDollarsCompounding({
      numberOfDays: 30,
      farmApr: apr,
      tokenPrice,
      roundingDecimals,
      compoundFrequency,
      performanceFee,
    })
    tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
      numberOfDays: 365,
      farmApr: apr,
      tokenPrice,
      roundingDecimals,
      compoundFrequency,
      performanceFee,
    })
  } else {
    tokenEarnedPerThousand1D = tokenEarnedPerThousandDaily
    tokenEarnedPerThousand7D = tokenEarnedPerThousandDaily * 7
    tokenEarnedPerThousand30D = tokenEarnedPerThousandDaily * 30
    tokenEarnedPerThousand365D = tokenEarnedPerThousandDaily * 365
  }

  const linkGetToken = useMemo(() => {
    if (data?.t0?.symbol && data?.t1?.symbol) {
      return {
        route: `/add/${data?.t0?.address}/${data?.t1?.address}`,
        label: `Get ${data?.t0?.symbol}-${data?.t1?.symbol} LP`,
      }
    }
    if (data?.stakingToken?.symbol === 'DRAGON') {
      return {
        route: `/swap?&outputCurrency=${tokens.dragon.address}`,
        label: `Get ${data?.stakingToken?.symbol} Token`,
      }
    }
    if (data?.token0?.symbol.includes('DDT')) {
      return {
        route: '/vaults',
        label: `Get ${data?.stakingToken?.symbol} Token`,
      }
    }
    if (data?.stakingToken?.symbol) {
      return {
        label: `Get ${data?.stakingToken?.symbol} Token`,
        route: data?.stakingToken?.token1
          ? `/pipe/0x7cd3c7aFeDD16A72Fba66eA35B2e2b301d1B7093/${data?.stakingToken.address}`
          : `/swap?inputCurrency=kai&outputCurrency=${data?.stakingToken.address}`,
      }
    }
    return null
  }, [data])

  const dataTable = [
    {
      label: '1d',
      roi: getRoi({ amountEarned: tokenEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfToken }),
      tokenEarned: tokenEarnedPerThousand1D,
    },
    {
      label: '7d',
      roi: getRoi({ amountEarned: tokenEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfToken }),
      tokenEarned: tokenEarnedPerThousand7D,
    },
    {
      label: '30d',
      roi: getRoi({ amountEarned: tokenEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfToken }),
      tokenEarned: tokenEarnedPerThousand30D,
    },
    {
      label: '365d (APY)',
      roi: getRoi({ amountEarned: tokenEarnedPerThousand365D, amountInvested: oneThousandDollarsWorthOfToken }),
      tokenEarned: tokenEarnedPerThousand365D,
    },
  ]

  return (
    <Modal open={open} onClose={onClose} size={'sm'}>
      <ModalTitle onClose={onClose}>
        <strong>ROI</strong>
      </ModalTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm-md sm:text-md">
          <thead>
            <tr className="text-gray-500 font-medium uppercase">
              <th className="p-1">Timeframe</th>
              <th className="p-1 text-right">ROI</th>
              <th className="p-1 text-right">{earningTokenSymbol} per $1,000</th>
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((item, index) => {
              const roi = formatNumberMinifiedCharacters(item?.roi, roundingDecimals)
              const tokenEarned = formatNumberMinifiedCharacters(item?.tokenEarned, roundingDecimals)
              return (
                <tr key={index}>
                  <td className="p-1">{item?.label}</td>
                  <td className="p-1 text-right">
                    {roi?.value}
                    {`${roi?.unit}%`}
                  </td>
                  <td className="p-1 text-right">
                    {tokenEarned?.value}
                    {`${tokenEarned?.unit}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <ul className="m-2 mt-6 text-sm-md text-gray-500">
          <li
            style={{
              textIndent: '0.5rem',
            }}
          >
            - Calculated based on current rates.
          </li>
          {isFarm && data?.t1?.symbol ? (
            <li
              style={{
                textIndent: '0.5rem',
              }}
            >
              - LP rewards: {TRADING_FEE}% trading fees, distributed proportionally among LP token holders.
            </li>
          ) : null}
          <li
            style={{
              textIndent: '0.5rem',
            }}
          >
            - All figures are estimates provided for your convenience only, and by no means represent guaranteed
            returns.
          </li>
        </ul>
        {linkGetToken ? (
          <>
            {linkGetToken?.route ? (
              <Link
                className="flex items-center justify-center cursor-pointer hover:underline"
                to={linkGetToken?.route}
                target="_blank"
              >
                {linkGetToken?.label}
                <ExternalLink className="ml-1" size={16} />
              </Link>
            ) : (
              <a
                className="flex justify-center items-center text-blue1 font-semibold hover:underline my-3"
                target="_blank"
                href={linkGetToken?.link}
              >
                {linkGetToken?.label} <ExternalLink className="ml-1" size={16} />
              </a>
            )}
          </>
        ) : null}
      </div>
    </Modal>
  )
}

ModalApyCalculator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tokenPrice: PropTypes.number.isRequired,
  earningTokenSymbol: PropTypes.string,
  linkLabel: PropTypes.string,
  linkHref: PropTypes.string,
  data: PropTypes.object,
  apr: PropTypes.number,
  isFarm: PropTypes.bool,
  roundingDecimals: PropTypes.number,
  compoundFrequency: PropTypes.number,
  performanceFee: PropTypes.number,
  tokenEarnedPerThousandDaily: PropTypes.number,
}

export default ModalApyCalculator
