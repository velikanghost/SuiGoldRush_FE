import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { BiSolidCrown } from 'react-icons/bi'
import { FaCoins } from 'react-icons/fa'

const Header = () => {
  const { connectStore } = useContext(StoreContext)
  const { userMetrics } = connectStore

  return (
    <nav className="relative z-20 flex items-center justify-between w-full gap-4 p-4 mt-3">
      <button className="flex justify-center items-center gap-2 py-1 px-3 bg-[#1d8109] border-2 border-[#8cc63f] rounded-3xl text-xl font-medium shadow-[0px 4px 6px rgba(0, 0, 0, 0.1)] cursor-pointer transform-[0.2s] active:scale-[1.05]">
        <span className="text-base text-white font-headings">
          LVL {userMetrics.user_rank}
        </span>
        <BiSolidCrown color="gold" />
      </button>
      <button className="flex justify-center items-center gap-2 py-1 px-3 bg-[#1d8109] border-2 border-[#8cc63f] rounded-3xl text-xl font-medium shadow-[0px 4px 6px rgba(0, 0, 0, 0.1)] cursor-pointer transform-[0.2s] active:scale-[1.05]">
        <span className="text-base text-white font-headings">
          {userMetrics.gold_coins}
        </span>
        <FaCoins color="gold" />
      </button>
    </nav>
  )
}

export default observer(Header)
