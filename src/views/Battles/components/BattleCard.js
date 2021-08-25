import BigNumber from 'bignumber.js'
import Button from 'components/Button/Button'
import Card from 'components/Card/Card'
import { showToastError, showToastSuccess } from 'components/CustomToast/CustomToast'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import { useModalWalletConnect } from 'store/modal/hooks'
import { useApproveDragonBattle } from 'hooks/useApprove'
import useFight from 'hooks/useFight'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, updateUserBalance } from 'store/battles/index'
import PropTypes from 'prop-types'
import ModalRequireDragon from 'views/Battles/components/ModalRequireDragon'

const BattleCard = ({ battle, tokenBalance }) => {
  const dispatch = useDispatch()
  const { account } = useKardiachain()
  const [openRequired, setOpenRequired] = useState(false)
  const { onToggleConnectModal } = useModalWalletConnect()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requestedFight, setRequestedFight] = useState(false)
  const { onApproveDragon } = useApproveDragonBattle(battle.battleAddress)

  const toggleModalRequired = () => setOpenRequired(!openRequired)

  const { onFight } = useFight(battle.battleAddress, battle.method)

  const allowance = battle.allowance
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApproveDragon()
      showToastSuccess('Contract Enabled')
      dispatch(updateUserAllowance(battle.bid, account, battle.battleAddress))
      setRequestedApproval(false)
    } catch (e) {
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setRequestedApproval(false)
    }
  }, [account, battle.battleAddress, battle.bid, dispatch, onApproveDragon])

  const handleFight = async () => {
    if (!new BigNumber(tokenBalance).isGreaterThanOrEqualTo(new BigNumber(battle.cost).times(DEFAULT_TOKEN_DECIMAL))) {
      return toggleModalRequired()
    }
    try {
      setRequestedFight(true)
      await onFight()
      dispatch(updateUserBalance(account, battle.earn, battle.cost))
      setRequestedFight(false)
    } catch (e) {
      console.log(e)
      showToastError('Canceled', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      setRequestedFight(false)
    }
  }

  return (
    <>
      <ModalRequireDragon toggleModal={toggleModalRequired} open={openRequired} />
      <Card className="mx-4 flex-1 max-w-xs farm-card mb-8">
        <div className="p-5 h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="text-center mb-4">
              <div className="h-20">
                <img
                  className="mx-auto mb-2 rounded-50 bg-white object-contain"
                  alt="logo"
                  src={`/tokens/dfl.png`}
                  style={{
                    maxHeight: 80,
                    height: 80,
                  }}
                  width="80"
                  height="80"
                />
              </div>
              <p className="text-white text-xl">{battle.title}</p>
              <p className="text-white text-xl">Earn {battle.earn} Dragon Tokens</p>
              <p className="text-white text-xl">Cost {battle.cost} Dragon Tokens</p>
            </div>
            {account ? (
              isApproved ? (
                <Button isLoading={requestedFight} disabled={requestedFight} className="w-full" onClick={handleFight}>
                  {requestedFight ? 'Fighting' : battle.btnTitle}
                </Button>
              ) : (
                <Button isLoading={requestedApproval} disabled={requestedApproval} onClick={handleApprove}>
                  Approve Contract
                </Button>
              )
            ) : (
              <Button className="w-full" onClick={onToggleConnectModal}>
                Connect wallet
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

BattleCard.propTypes = {
  battle: PropTypes.object.isRequired,
  tokenBalance: PropTypes.instanceOf(BigNumber),
}

export default BattleCard
