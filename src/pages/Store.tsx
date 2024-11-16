import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundForward } from 'react-icons/io'

const Store = () => {
  const navigate = useNavigate()
  const hasWallet = localStorage.getItem('wallet') !== null

  const handleConnectWallet = () => {
    navigate('/wallet')
  }

  return (
    <>
      {!hasWallet ? (
        <div className="relative grid place-items-center">
          <button
            onClick={handleConnectWallet}
            className="bg-[#F5EAD1] text-[#5C4F3A] border-[#5C4F3A] self-center font-medium py-6 px-12 rounded-[32px] text-xl font-headings shadow-[4.4px_4.4px_0px_#d0c3a1] hover:shadow-[2.2px_2.2px_0px_#d0c3a1] hover:translate-y-1"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div
            onClick={() => navigate('/wallet')}
            className="flex justify-center gap-4 items-center relative z-20 shadow-lg text-[#3d2c24] py-3 rounded border-[#5C4F3A] w-[93%] mx-auto mb-3 font-headings bg-[#F5EAD1]"
          >
            <p>Wallet</p>
            <IoMdArrowRoundForward className="animate-bounce" size={28} />
          </div>
          <div className="relative h-full w-[93%] rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-4 flex flex-col overflow-y-auto">
            <div className="pb-4 border-b border-[#ffd700]">
              <h1 className="pb-2 text-3xl font-bold text-[#ffd700] font-body">
                Study Power-ups
              </h1>
              <p className="font-semibold text-[#e0d6b9]">
                You get even more gold coins!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#F5EAD1] flex flex-col p-2 rounded items-start justify-between">
                <img
                  src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423602/tractor_dqo8q7.png"
                  className="transition-transform duration-200"
                  alt="tractor"
                />
                <p className="py-2 text-sm font-semibold">+5000 Energy</p>
                <button className="w-full buy_btn">BUY for $5</button>
              </div>
              <div className="bg-[#F5EAD1] flex flex-col p-2 rounded items-start justify-between">
                <img
                  src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731773810/tractor2_ckfx43.png"
                  className="transition-transform duration-200"
                  alt="tractor"
                />
                <p className="py-2 text-sm font-semibold">+5000 Energy</p>
                <button className="w-full buy_btn">BUY for $5</button>
              </div>
              <div className="bg-[#F5EAD1] flex flex-col p-2 rounded items-start justify-between">
                <img
                  src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423602/tractor_dqo8q7.png"
                  className="transition-transform duration-200"
                  alt="tractor"
                />
                <p className="py-2 text-sm font-semibold">+5000 Energy</p>
                <button className="w-full buy_btn">BUY for $5</button>
              </div>
              <div className="bg-[#F5EAD1] flex flex-col p-2 rounded items-start justify-between">
                <img
                  src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731773810/tractor2_ckfx43.png"
                  className="transition-transform duration-200"
                  alt="tractor"
                />
                <p className="py-2 text-sm font-semibold">+5000 Energy</p>
                <button className="w-full buy_btn">BUY for $5</button>
              </div>
              <div className="bg-[#F5EAD1] flex flex-col p-2 rounded items-start justify-between">
                <img
                  src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423602/tractor_dqo8q7.png"
                  className="transition-transform duration-200"
                  alt="tractor"
                />
                <p className="py-2 text-sm font-semibold">+5000 Energy</p>
                <button className="w-full buy_btn">BUY for $5</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default observer(Store)
