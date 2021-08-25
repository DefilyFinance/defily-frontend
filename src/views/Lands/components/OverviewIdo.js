import React, { useMemo } from 'react'
import Value from '../../../components/Value/Value'

const OverviewIdo = ({ countProjects, totalHolders, totalFund }) => {
  return (
    <div className="box-detail-idos">
      <div
        style={{
          backgroundColor: '#012a4acc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
        className="box-detail-idos"
      >
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl text-center pt-2 font-bold p-3 pb-2 text-primary">
            Decentralize the way your projects raise capital.
          </h2>
          <div className="flex justify-center">
            <p
              style={{
                maxWidth: 600,
              }}
              className="p-5 pt-1 text-center text-white"
            >
              The first IDO Launchpad on Kardiachain is here. Be the first to join Defily IDO Launchpad, a Protocol
              built for cross-chain token pools and auctions, enabling projects to raise capital on a decentralized and
              interoperable approach.
            </p>
          </div>
        </div>
        <div className="flex sm:hidden items-end">
          <div className="w-full px-6">
            <div className="container max-w-screen-xl mx-auto grid sm:grid-cols-3">
              <div className="text-white text-center py-1 sm:py-6">
                <p className="text-sm-md">Total Funds Raised</p>
                <Value className="text-3xl font-bold" prefix={'$'} value={totalFund} decimals={0} />
              </div>
              <div className="text-white text-center py-1 sm:py-6">
                <p className="text-sm-md">Projects Launched</p>
                <p className="text-3xl font-bold">{countProjects}</p>
              </div>
              <div className="text-white text-center py-1 sm:py-6">
                <p className="text-sm-md">All-time Unique Participants</p>
                {totalHolders !== null ? (
                  <Value className="text-3xl font-bold" value={totalHolders} decimals={0} />
                ) : (
                  '--'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewIdo
