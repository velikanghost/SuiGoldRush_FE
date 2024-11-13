import { useContext, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import telegramService from '../lib/utils'
import { useNavigate } from 'react-router-dom'

const Mine = () => {
  const navigate = useNavigate()
  const { countStore, connectStore } = useContext(StoreContext)
  const { tapTractor, metrics } = countStore
  const { userId } = connectStore

  const [isTossing, setIsTossing] = useState(false)

  const handleTractorClick = () => {
    if (metrics.energy === 0) {
      // Save to localStorage
      localStorage.setItem('userMetrics', JSON.stringify(metrics))
      telegramService.showPopup(
        {
          title: 'Out of Energy',
          message: `id: ${userId} You are out of energy, upgrade your tractor in store to get more energy.`,
          buttons: [
            {
              id: 'close',
              type: 'destructive',
              text: 'Close',
            },
            {
              id: 'store',
              type: 'default',
              text: 'Go to Store',
            },
          ],
        },
        (buttonId: string) => {
          if (buttonId === 'store') {
            navigate('/')
          }
        },
      )
      return
    }

    tapTractor()

    if (!isTossing) {
      setIsTossing(true)
    }
  }

  return (
    <section className="flex flex-col items-center justify-between h-full px-4">
      <div
        onClick={handleTractorClick}
        className={
          metrics.energy > 0
            ? 'top-[25%] h-[320px] w-[320px] p-10 rounded-[50%] z-20  flex justify-center items-center border-yellow-300 transition-transform duration-1000 ease-in-out active:scale-[1.05] active:shadow-[0_0_25px_15px_rgba(255,223,0,0.6)] relative'
            : 'top-[25%] h-[320px] w-[320px] p-10 rounded-[50%] z-20  flex justify-center items-center transition-transform duration-1000 ease-in-out active:shadow-[0_0_25px_15px_rgba(255,0,0,0.6)] relative'
        }
      >
        <img
          src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423602/tractor_dqo8q7.png"
          className="w-full transition-transform duration-200"
          alt="tractor"
        />

        <img
          src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423636/golc_coin_y7kgaj.png"
          alt="gold coins"
          className={`absolute w-12 h-12 bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 z-30 ${
            isTossing ? 'toss' : 'opacity-0'
          }`}
          onAnimationEnd={() => setIsTossing(false)}
        />
      </div>
      <div className="relative z-50 w-full">
        <h2 className="text-sm text-primary-foreground font-headings">
          {metrics.energy}/{metrics.energyLimit}
        </h2>
        <Progress
          className="max-w-[30%] text-start self-start bg-slate-600 custom_progress"
          value={(metrics.energy / metrics.energyLimit) * 100}
        />
      </div>
    </section>
  )
}

export default observer(Mine)
