import { formatDDMMM, formatDDMMMYYYYHHmm } from 'utils/formatDateTime'
import Table from 'components/Table/Table'
import Value from 'components/Value/Value'
import Card from 'components/Card/Card'
import Button from 'components/Button/Button'
import classnames from 'classnames'

const SaleOptions = ({ actionBuy, pool }) => {
  const { tokenInfo, options } = pool
  if (!options) return null
  const { data, labels } = options
  return (
    <div>
      <div className={`grid grid-cols-1 md:grid-cols-10`}>
        <div className={classnames(`col-span-${options?.data?.length > 1 ? '7' : '6'} overflow-auto`)}>
          <Table
            containerClass="mt-3 custom-scrollbar-scroll"
            style={{
              minWidth: options?.data?.length > 1 ? 650 : 'unset',
            }}
          >
            <thead>
              <tr>
                <th className="font-bold"></th>
                {data?.map((item, index) => (
                  <th className="font-bold" key={index}>
                    {item?.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels?.map((row, iRow) => (
                <tr key={iRow}>
                  <td>{row.text}</td>
                  {data?.map((col, iCol) => {
                    const content = data?.[iCol]?.values?.[row?.key]
                    return (
                      <td key={iCol} style={{ width: `${100 / (data?.length + 1)}%` }}>
                        {content?.text}
                        {content?.dateOpen ? formatDDMMMYYYYHHmm(content?.dateOpen) : null}
                        {content?.dateClose ? ' - ' + formatDDMMMYYYYHHmm(content?.dateClose) : null}
                        {content?.number ? (
                          <Value
                            value={content?.number}
                            decimals={content?.decimals || 0}
                            prefix={content?.prefix}
                            unit={content?.unit}
                          />
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Table containerClass="mt-3 ml-0 md:ml-4 col-span-3 custom-scrollbar-scroll">
          <thead>
            <tr>
              <th className="font-bold text-" colSpan={2}>
                Token information
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{tokenInfo?.name}</td>
            </tr>
            <tr>
              <td>Token Symbol</td>
              <td>{tokenInfo?.symbol}</td>
            </tr>
            <tr>
              <td>Total Supply</td>
              <td>
                <Value value={tokenInfo?.totalSupply} decimals={0} />
              </td>
            </tr>
            {tokenInfo?.totalSupplyOnKai ? (
              <tr>
                <td>Total Supply on Kai</td>
                <td>
                  <Value value={tokenInfo?.totalSupplyOnKai} decimals={0} />
                </td>
              </tr>
            ) : null}
            <tr className="hidden md:block">
              <td />
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10">
        <div className="col-span-7 overflow-auto">
          <div className={`grid gap-8 grid-cols-1 sm:grid-cols-${data?.length} mt-5`}>
            {Array.isArray(data) &&
              data?.map((option, index) => {
                const totalCollected = pool?.totalCollecteds?.[index]
                const hardCap = option?.idoContract?.hardCap
                const softCap = option?.idoContract?.softCap
                const isSoldOut = hardCap - totalCollected < softCap
                return (
                  <Card
                    className={classnames(
                      'p-5 bg-blue2 text-white mt-2 text-center flex flex-col justify-between max-w-sm',
                    )}
                    key={index}
                  >
                    <div>
                      <h2 className="text-xl font-bold mb-2">{option?.label}</h2>
                      <p>Starts {formatDDMMM(option?.values?.saleDate?.dateOpen)}</p>
                      <Value
                        className="text-white"
                        value={option?.values?.pricePerToken?.number}
                        decimals={option?.values?.pricePerToken?.decimals}
                        unit={` ${pool?.buyToken?.symbol} per token`}
                      />
                      <p>{option?.values?.lockupRelease?.text}</p>
                      <p>
                        Require {option?.poolContract?.stakingRequire?.toLocaleString()} {pool?.stakingToken?.symbol}
                      </p>
                    </div>
                    <Button
                      className="d-block mt-5 text-blue2"
                      color="primary"
                      onClick={actionBuy}
                      disabled={isSoldOut}
                    >
                      {isSoldOut ? 'Sold out' : 'Buy'}
                    </Button>
                  </Card>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleOptions
