import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Overlay from './components/Overlay'
import { useContext, useEffect } from 'react'
import Welcome from './pages/Welcome'
import telegramService from './lib/utils'
import { observer } from 'mobx-react-lite'
import { StoreContext } from './mobx store/RootStore'

const Layout = () => {
  const { connectStore, countStore } = useContext(StoreContext)
  const { rushing, setRushing, getTelegramUserData } = connectStore
  const { syncMetricsToDb, metrics } = countStore
  const location = useLocation()
  const home = location.pathname === '/'
  const mine = location.pathname === '/mine'

  useEffect(() => {
    telegramService.expandWebApp()
    getTelegramUserData()

    setTimeout(() => {
      setRushing(false)
    }, 3000)

    // Show the BackButton when the component mounts
    telegramService.WebApp?.BackButton.show()

    // Add the back button click listener
    telegramService.WebApp?.BackButton.onClick(handleBackButtonClick)

    // Cleanup function to remove the click listener and hide the BackButton
    return () => {
      telegramService.WebApp?.BackButton.hide()
      telegramService.WebApp?.BackButton.onClick(() => {}) // Clears any previously attached callback
    }
  }, [])

  const handleBackButtonClick = async () => {
    await syncMetricsToDb(metrics)
    telegramService.showPopup(
      {
        title: 'Confirm Close',
        message: 'Are you sure you want to close the app?',
        buttons: [
          {
            id: 'confirmClose',
            type: 'destructive',
            text: 'Yes, Close',
          },
          {
            id: 'cancelClose',
            type: 'cancel',
            text: 'Cancel',
          },
        ],
      },
      (buttonId) => {
        if (buttonId === 'confirmClose') {
          telegramService.WebApp?.close()
        }
      },
    )
  }

  if (rushing) {
    return <Welcome />
  }

  return (
    <div
      className={home ? 'home_section' : mine ? 'mine_section' : 'home_section'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Header />
      <Overlay />
      <Outlet />
      <Footer />
    </div>
  )
}

export default observer(Layout)
