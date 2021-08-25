import Banner from 'views/Dashboard/components/Banner/Banner'
import StartEarning from 'views/Dashboard/components/StartEarning/StartEarning'
import StatsDefily from 'views/Dashboard/components/StatsDefily/StatsDefily'

import 'styles/home.scss'

const Dashboard = () => {
  return (
    <>
      <Banner>
        <StatsDefily />
      </Banner>
      <StartEarning />
    </>
  )
}

export default Dashboard
