import Table from 'components/Table/Table'
import { useLandFromIdoId } from 'store/lands/hook'
import { useParams } from 'react-router-dom'
import { getBalanceNumber } from 'utils/formatBalance'
import OptionRow from './OptionRow'

const Allocation = () => {
  const { id } = useParams()
  const pool = useLandFromIdoId(id)
  const idoBalances = pool?.idoBalances
  const options = pool?.options?.data || []
  return (
    <div className="overflow-auto">
      <Table
        containerClass="mr-0 sm:mr-4 mt-3 custom-scrollbar-scroll"
        style={{
          minWidth: 1150,
        }}
      >
        <thead>
          <tr>
            <th className="font-bold">No.</th>
            <th className="font-bold">Require</th>
            <th className="font-bold">Price per {pool?.tokenInfo?.symbol}</th>
            <th className="font-bold">Total sold</th>
            <th className="font-bold">Open in/End in/Claim</th>
            <th className="font-bold">Staked</th>
            <th className="font-bold">Invested</th>
            <th className="font-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {options?.length ? (
            options?.map((option, index) => {
              const tokenBalance = getBalanceNumber(idoBalances?.[index], pool?.token?.decimals)
              const tokenSold = option?.idoContract?.totalSupply - tokenBalance
              return (
                <OptionRow
                  key={index}
                  index={index}
                  option={option}
                  tokenSold={tokenSold}
                  totalSupply={option?.idoContract?.totalSupply}
                />
              )
            })
          ) : (
            <tr>
              <td colSpan={10}>
                <p className="text-center">No data</p>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Allocation
