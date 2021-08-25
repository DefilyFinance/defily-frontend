import Button from 'components/Button/Button'
import Modal from 'components/Modal/Modal'
import ModalTitle from 'components/Modal/ModalTitle'
import QuestionHelper from 'components/QuestionHelper/index'
import Switch from 'components/Switch/Switch'
import { useState } from 'react'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from 'store/user/hooks'

import { useSwapActionHandlers } from 'store/swap/hooks'
import TransactionSettings from 'views/Swap/components/Settings/TransactionSettings'

const SettingsModal = ({ onDismiss, open }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const { onChangeRecipient } = useSwapActionHandlers()

  const toggleShowConfirmExpertModal = () => setShowConfirmExpertModal((prevState) => !prevState)

  if (showConfirmExpertModal) {
    return (
      <Modal open={showConfirmExpertModal} onDismiss={toggleShowConfirmExpertModal} style={{ maxWidth: '420px' }}>
        <ModalTitle onClose={toggleShowConfirmExpertModal}>Are you sure?</ModalTitle>
        <div>
          <div>
            <p>
              Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result
              in bad rates and lost funds.
            </p>
          </div>
          <p>Only use this mode if you know what you’re doing.</p>
          <Button
            className="mx-auto mt-2"
            color="danger"
            id="confirm-expert-mode"
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                toggleExpertMode()
                setShowConfirmExpertModal(false)
              }
            }}
          >
            Turn On Expert Mode
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onDismiss}>
      <ModalTitle onClose={onDismiss}>Settings</ModalTitle>
      <div>
        <div style={{ padding: '1rem' }}>
          <p className="font-bold text-xl">Transaction Settings</p>
          <TransactionSettings
            rawSlippage={userSlippageTolerance}
            setRawSlippage={setUserslippageTolerance}
            deadline={ttl}
            setDeadline={setTtl}
          />
          <p className="font-bold text-xl mt-6">Interface Settings</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p>Toggle Expert Mode</p>
              <QuestionHelper
                text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                classNameToolTip="tooltip-center"
              />
            </div>
            <Switch
              id="expertMode"
              checked={expertMode}
              onChange={
                expertMode
                  ? () => {
                      onChangeRecipient(null)
                      toggleExpertMode()
                    }
                  : () => setShowConfirmExpertModal(true)
              }
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <p>Disable Multihops</p>
              <QuestionHelper
                text="Restricts swaps to direct pairs only."
                classNameToolTip="tooltip-center tooltip-top"
              />
            </div>
            <Switch
              id="singleHopOnly"
              checked={singleHopOnly}
              onChange={() => {
                setSingleHopOnly(!singleHopOnly)
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SettingsModal
