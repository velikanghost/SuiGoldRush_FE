import { StoreContext } from '@/mobx store/RootStore'
import { Label } from '@radix-ui/react-label'
import { useContext, useState } from 'react'
import { Input } from '../ui/input'
import { observer } from 'mobx-react-lite'
import { IoCopyOutline } from 'react-icons/io5'

const ManagePhrase = () => {
  const { walletStore } = useContext(StoreContext)
  const {
    decryptState,
    walletSeedPhrase,
    responseMessage,
    manualUnlockWallet,
    setResponseMessage,
  } = walletStore

  const [password, setPassword] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleSubmit = async () => {
    await manualUnlockWallet(password)
  }

  const handleCopyPhrase = () => {
    navigator.clipboard
      .writeText(walletSeedPhrase)
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
    <div className="flex flex-col justify-center h-[75%] px-6">
      {decryptState === true && walletSeedPhrase !== '' ? (
        <div>
          <h2 className="mt-8 mb-4 text-lg font-semibold">
            Your Secret Phrase
          </h2>
          <p className="px-3 py-5 mb-8 font-medium text-left text-red-600 border border-red-600 rounded">
            Do not share this secret phrase. <br /> Anyone with your secret
            phrase will have full control of your wallet.
          </p>
          <div className="flex flex-col items-center justify-center border-[#4A403A] border-2 rounded-xl py-3">
            <p className="border-b border-[#4A403A] px-3 pb-3">
              {walletSeedPhrase}
            </p>
            <span
              className="flex items-center gap-2 pt-3 cursor-pointer"
              onClick={handleCopyPhrase}
            >
              {isCopied ? 'Copied' : 'Copy'} <IoCopyOutline size={14} />
            </span>
          </div>
        </div>
      ) : (
        <>
          <p className="px-3 py-5 mb-8 font-medium text-left text-red-600 border border-red-600 rounded">
            Do not share this secret phrase. <br /> Anyone with your secret
            phrase will have full control of your wallet.
          </p>
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="name" className="font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              className={
                responseMessage.type === 'error'
                  ? 'py-5 px-3 border-red-600'
                  : `py-5 px-3 border-[#4A403A]`
              }
              onChange={(e) => setPassword(e.target.value)}
              onClick={() => setResponseMessage('', '')}
            />
          </div>
          {responseMessage.type === 'error' ? (
            <span className="mt-2 text-sm text-left text-red-600">
              {responseMessage.text}
            </span>
          ) : null}
          <button onClick={handleSubmit} className="w-full mt-6 btn_primary">
            Continue
          </button>
        </>
      )}
    </div>
  )
}

export default observer(ManagePhrase)
