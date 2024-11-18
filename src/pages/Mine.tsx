import { useContext, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import telegramService from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import { AiFillThunderbolt } from 'react-icons/ai'

const Mine = () => {
  const navigate = useNavigate()
  const { countStore, connectStore } = useContext(StoreContext)
  const { tapTractor } = countStore
  const { userMetrics, tractor } = connectStore

  const [isTossing, setIsTossing] = useState(false)

  const handleTractorClick = () => {
    if (userMetrics.energy === 0) {
      telegramService.showPopup(
        {
          title: 'Out of Energy',
          message: `You are out of energy, upgrade your tractor in store to get more energy.`,
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
      <div className="relative z-50 w-full rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-3 flex justify-between gap-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <h2 className="text-sm text-primary-foreground font-headings">
              {userMetrics.energy}/{userMetrics.max_energy}
            </h2>
            <AiFillThunderbolt color="gold" />
          </div>
          <Progress
            className="text-start self-start bg-slate-600  border border-[#8cc63f] custom_progress"
            value={(userMetrics.energy / userMetrics.max_energy) * 100}
          />
          <p className="text-sm text-primary-foreground font-headings">
            Energy Level
          </p>
        </div>
        <div className="flex flex-col items-end justify-between name font-headings text-primary-foreground">
          <h2 className="text-sm">{tractor.name}</h2>
          <p className="text-sm">
            Multiplier{' '}
            <span className="text-xl text-[#ffd700]">
              {tractor.multiplier}x
            </span>
          </p>
        </div>
      </div>

      <div
        onClick={handleTractorClick}
        className={
          userMetrics.energy > 0
            ? '-top-[11%] h-[320px] w-[320px] p-10 rounded-[50%] z-20  flex justify-center items-center border-yellow-300 transition-transform duration-1000 ease-in-out active:scale-[1.05] active:shadow-[0_0_25px_15px_rgba(255,223,0,0.6)] relative'
            : '-top-[11%] h-[320px] w-[320px] p-10 rounded-[50%] z-20  flex justify-center items-center transition-transform duration-1000 ease-in-out active:shadow-[0_0_25px_15px_rgba(255,0,0,0.6)] relative'
        }
      >
        <img
          src={
            tractor.image_url ||
            'https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423602/tractor_dqo8q7.png'
          }
          className="w-full transition-transform duration-300"
          alt={tractor.name}
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
    </section>
  )
}

export default observer(Mine)
