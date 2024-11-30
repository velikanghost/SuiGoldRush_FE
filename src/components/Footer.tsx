import { useLocation, useNavigate } from 'react-router-dom'
import { PiFarmFill } from 'react-icons/pi'
import { GiAxeSwing } from 'react-icons/gi'
import { FaTasks } from 'react-icons/fa'
import { MdLeaderboard, MdPostAdd, MdStoreMallDirectory } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

const Footer = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <footer className="fixed bottom-0 z-20 w-full gap-4 p-4">
      {location.pathname === '/' && (
        <div className="flex justify-between mb-6 top">
          <div
            onClick={() => navigate('/leaderboard')}
            className="grid place-items-center bg-[#1d8109] border-[#8cc63f] border-2 rounded-[4px] p-1 w-[70px] h-[70px]"
          >
            <MdLeaderboard size={32} color="gold" />
          </div>
          <div
            onClick={() => navigate('/store')}
            className="grid place-items-center bg-[#1d8109] border-[#8cc63f] border-2 rounded-[4px] p-1 w-[70px] h-[70px]"
          >
            <MdStoreMallDirectory size={32} color="gold" />
          </div>
        </div>
      )}
      <div className="flex justify-between bottom">
        <div
          onClick={() => navigate('/')}
          className="grid place-items-center bg-[#1d8109] border-[#8cc63f] border-2 rounded-[4px] p-1 w-[70px] h-[70px]"
        >
          <PiFarmFill size={32} color="gold" />
          <p className="font-semibold text-white text-[9px] font-headings">
            HOME
          </p>
        </div>
        <div
          onClick={() => navigate('/mine')}
          className="grid place-items-center bg-[#1d8109] border-[#8cc63f] border-2 rounded-[4px] p-1 w-[70px] h-[70px]"
        >
          <GiAxeSwing size={32} color="gold" />
          <p className="font-semibold text-white text-[9px] font-headings">
            MINE
          </p>
        </div>
        <div
          onClick={() => navigate('/tasks')}
          className="grid place-items-center bg-[#1d8109] border-[#8cc63f] border-2 rounded-[4px] p-1 w-[70px] h-[70px]"
        >
          <FaTasks size={32} color="gold" />
          <p className="font-semibold text-white text-[9px] font-headings">
            TASK
          </p>
        </div>
        <div
          onClick={() => navigate('/invites')}
          className="grid place-items-center bg-[#1d8109] border-[#8cc63f] border-2 rounded-[4px] p-1 w-[70px] h-[70px]"
        >
          <MdPostAdd size={32} color="gold" />
          <p className="font-semibold text-white text-[9px] font-headings">
            INVITE
          </p>
        </div>
      </div>
    </footer>
  )
}

export default observer(Footer)
