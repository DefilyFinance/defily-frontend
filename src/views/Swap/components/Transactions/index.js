import { useState } from 'react'
import { Clock } from 'react-feather'
import TransactionsModal from 'views/Swap/components/Transactions/TransactionsModal'

const Transactions = () => {
  const [presentTransactionsModal, setPresentTransactionsModal] = useState(false)

  const toggleTransactionModal = () => setPresentTransactionsModal((prevState) => !prevState)

  return (
    <>
      <TransactionsModal open={presentTransactionsModal} onDismiss={toggleTransactionModal} />
      <Clock onClick={toggleTransactionModal} className="text-primary cursor-pointer ml-2" size={24} />
    </>
  )
}

export default Transactions
