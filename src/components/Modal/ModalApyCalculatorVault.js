import tokens from 'constants/tokens'
import { useMemo } from 'react'
import Modal from './Modal'
import ModalTitle from './ModalTitle'
import PropTypes from 'prop-types'
import { formatNumberMinifiedCharacters } from 'utils'
import { ExternalLink } from 'react-feather'
import { Link } from 'react-router-dom'

const ModalApyCalculatorVault = ({ open, onClose, data, apy, roundingDecimals = 2 }) => {
  const linkGetToken = useMemo(() => {
    if (data?.token0?.symbol && data?.token1?.symbol) {
      return {
        route: `/add/${data?.token0?.address}/${data?.token1?.address}`,
        label: `Get ${data?.token0?.symbol}-${data?.token1?.symbol} LP`,
      }
    }
    if (data?.token0?.symbol === 'DRAGON') {
      return {
        route: `/swap?&outputCurrency=${tokens.dragon.address}`,
        label: `Get ${data?.token0?.symbol} Token`,
      }
    }
    return {
      label: `Get ${data?.token0?.symbol} Token`,
      route: `/swap?inputCurrency=kai&outputCurrency=${data?.token0.address}`,
    }
  }, [data])

  const dataTable = [
    {
      label: '1d',
      roi: apy.dailyApy,
    },
    {
      label: '7d',
      roi: apy.weeklyApy,
    },
    {
      label: '30d',
      roi: apy.monthlyApy,
    },
    {
      label: '60d',
      roi: apy.monthly60Apy,
    },
    {
      label: '180d',
      roi: apy.monthly180Apy,
    },
    {
      label: '365d',
      roi: apy.yearlyApy,
    },
  ]

  return (
    <Modal open={open} onClose={onClose} size={'sm'}>
      <ModalTitle onClose={onClose}>
        <strong>APY</strong>
      </ModalTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm-md sm:text-md">
          <thead>
            <tr className="text-gray-500 font-medium uppercase">
              <th className="p-1">Timeframe</th>
              <th className="p-1 text-right">APY</th>
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((item, index) => {
              const roi = formatNumberMinifiedCharacters(item?.roi, roundingDecimals)
              return (
                <tr key={index}>
                  <td className="p-1">{item?.label}</td>
                  <td className="p-1 text-right">
                    {roi?.value}
                    {`${roi?.unit}%`}
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

ModalApyCalculatorVault.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  apy: PropTypes.object,
  roundingDecimals: PropTypes.number,
}

export default ModalApyCalculatorVault
