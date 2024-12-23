import { Outlet } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import telegramService from './lib/utils'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './mobx store/RootStore'
import { Toaster } from './components/ui/sonner'

const Layout = () => {
  const { connectStore } = useContext(StoreContext)
  const { getTelegramUserData } = connectStore

  useEffect(() => {
    telegramService.expandWebApp()
    getTelegramUserData()
  }, [])

  return (
    <div className="waitlist_section">
      <Outlet />
      <Toaster />
    </div>
  )
}

export default observer(Layout)
