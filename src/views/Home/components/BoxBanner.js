import Value from '../../../components/Value/Value'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useHistory } from 'react-router-dom'
const data = [
  {
    name: '7/12',
    pv: 70,
  },
  {
    name: '8/12',
    pv: 100,
  },
  {
    name: '9/12',
    pv: 80,
  },
  {
    name: '10/12',
    pv: 180,
  },
  {
    name: '11/12',
    pv: 200,
  },
  {
    name: '12/12',
    pv: 250,
  },
  {
    name: '13/12',
    pv: 300,
  },
  {
    name: '10/12',
    pv: 180,
  },
  {
    name: '11/12',
    pv: 200,
  },
  {
    name: '8/12',
    pv: 100,
  },
  {
    name: '10/12',
    pv: 180,
  },
  {
    name: '11/12',
    pv: 200,
  },
  {
    name: '12/12',
    pv: 250,
  },
  {
    name: '13/12',
    pv: 300,
  },
]

const BoxBanner = ({ farm }) => {
  const history = useHistory()
  const renderNamePool = () => {
    if (farm?.t1?.symbol && farm?.t0?.symbol) {
      if (farm?.lpAddress === '0x256b8a99f69dbdbb5ac781e97f11080a336f5507') {
        return 'DFL-KAI'
      }
      return `${farm?.t1?.symbol}-${farm?.t0?.symbol}`
    }
    if (farm?.symbol !== 'KLP') {
      return farm?.symbol
    }
    return null
  }
  return (
    <div
      className="col-span-3 border-2 border-primary rounded-xl p-4 mx-2 mt-2 bg-blue1 cursor-pointer"
      onClick={() => history.push(`/farms`)}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <div className="relative" style={{ height: 35, width: farm?.t1 ? 60 : 35 }}>
            {!farm?.t1 ? (
              <>
                <img
                  className="absolute mx-auto rounded-50 bg-white object-contain"
                  src={`/tokens/${farm?.icon ?? 'dfl.png'}`}
                  alt="logo"
                  style={{
                    height: 35,
                    width: 35,
                  }}
                />
              </>
            ) : (
              <>
                <img
                  className="absolute mx-auto rounded-50 bg-white object-contain"
                  src={`/tokens/${farm?.t0?.symbol?.toLowerCase()}.png`}
                  alt="logo"
                  style={{
                    left: '42%',
                    height: 35,
                    width: 35,
                  }}
                />
                <img
                  className="absolute mx-auto rounded-50 bg-white object-contain"
                  src={`/tokens/${farm?.t1?.symbol?.toLowerCase()}.png`}
                  alt="logo"
                  style={{
                    right: '42%',
                    height: 35,
                    width: 35,
                  }}
                />
              </>
            )}
          </div>
          <div className="ml-2 text-white text-sm-md">
            <p>{renderNamePool()}</p>
            <p>KAI DEX LP</p>
          </div>
        </div>
        {typeof farm?.apr?.yearlyAPR !== 'undefined' ? (
          <Value className="text-primary" value={farm?.apr?.yearlyAPR} decimals={2} unit="%" />
        ) : (
          '--'
        )}
      </div>
      <div className="grid grid-cols-12 mt-5">
        <div className="col-span-6 text-white font-bold flex items-end">
          <div>
            <span>TVL </span>
            {typeof farm?.stakedTvl === 'number' ? (
              <Value className="inline" value={farm?.stakedTvl} decimals={2} prefix="$" />
            ) : (
              '--'
            )}
          </div>
        </div>
        <div className="col-span-6" style={{ minHeight: 65 }}>
          <ResponsiveContainer>
            <LineChart height={65} data={data}>
              {/*<Tooltip content={ChartTooltip} />*/}
              <Line dot={false} dataKey="pv" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default BoxBanner
