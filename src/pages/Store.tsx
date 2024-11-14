import { observer } from 'mobx-react-lite'
import { useState } from 'react'

const Store = () => {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = () => {
    //check if wallet is connected ? display store : navigate to /wallet

    //simulation
    setIsConnected(false)
  }

  return (
    <>
      {isConnected === false ? (
        <div className="relative grid place-items-center">
          <button
            onClick={handleConnectWallet}
            className="bg-[#F5EAD1] text-[#5C4F3A] border-[#5C4F3A]  self-center font-medium py-6 px-12 rounded-[32px] text-xl font-headings shadow-[4.4px_4.4px_0px_#d0c3a1] hover:shadow-[2.2px_2.2px_0px_#d0c3a1] hover:translate-y-1"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="relative h-full w-[93%] rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-4 flex flex-col">
          <div className="pb-4 border-b border-[#ffd700]">
            <h1 className="pb-2 text-3xl font-bold text-[#ffd700] font-body">
              Study Power-ups
            </h1>
            <p className="font-semibold text-[#e0d6b9]">
              You get even more gold coins!
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default observer(Store)
