import { useState } from 'react'
import SettingsModal from 'views/Swap/components/Settings/SettingsModal'
import { Settings } from 'react-feather'

export default function SettingsTab() {
  const [presentSettingsModal, setPresentSettingsModal] = useState(false)

  const toggleSettingsModal = () => setPresentSettingsModal((prevState) => !prevState)

  return (
    <>
      <SettingsModal open={presentSettingsModal} onDismiss={toggleSettingsModal} />
      <Settings className="text-primary cursor-pointer" onClick={toggleSettingsModal} size={24} />
    </>
  )
}
