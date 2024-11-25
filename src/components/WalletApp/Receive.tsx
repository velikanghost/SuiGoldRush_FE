import { StoreContext } from '@/mobx store/RootStore'
import { QRCodeCanvas } from 'qrcode.react'
import { useContext, useState } from 'react'
import { IoCopyOutline } from 'react-icons/io5'

const Receive = () => {
  const { walletStore } = useContext(StoreContext)
  const { walletAddress } = walletStore
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <QRCodeCanvas
        className="p-2 shadow-lg rounded-2xl"
        value={walletAddress}
        size={256}
        bgColor="#ffffff"
        fgColor="#000000"
        level="L"
      />
      <h2 className="mt-8 mb-4 font-bold">Your SUI Address</h2>
      <div className="flex flex-col items-center justify-center border-[#4A403A] border-2 rounded-xl py-3">
        <p className="border-b border-[#4A403A] px-3 pb-3">
          {`${walletAddress?.substring(0, 14)}.......${walletAddress?.substring(
            52,
          )}`}
        </p>
        <span
          className="flex items-center gap-2 pt-3 cursor-pointer"
          onClick={handleCopyAddress}
        >
          {isCopied ? 'Copied' : 'Copy'} <IoCopyOutline size={14} />
        </span>
      </div>
    </div>
  )
}

export default Receive
