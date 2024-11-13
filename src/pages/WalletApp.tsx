import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
// import * as bip39 from 'bip39'
// import { derivePath } from 'ed25519-hd-key'
// import CryptoJS from 'crypto-js'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetFooter,
} from '@/components/ui/sheet'
import { HiOutlineQrcode } from 'react-icons/hi'
import { FiSend } from 'react-icons/fi'
import {
  PiBrowserLight,
  PiCurrencyDollarSimpleBold,
  PiSwap,
  PiBrowserFill,
} from 'react-icons/pi'
import { TbHistory, TbClockFilled } from 'react-icons/tb'
import { RiHome8Line, RiHome8Fill } from 'react-icons/ri'
import { UserAction } from '@/lib/types/walletapp'
import Receive from '@/components/WalletApp/Receive'
import Send from '@/components/WalletApp/Send'
import Swap from '@/components/WalletApp/Swap'
import Buy from '@/components/WalletApp/Buy'

const userActions: UserAction[] = [
  {
    icon: <HiOutlineQrcode size={26} />,
    text: 'Receive',
    content: <Receive />,
  },
  {
    icon: <FiSend size={26} />,
    text: 'Send',
    content: <Send />,
  },
  {
    icon: <PiCurrencyDollarSimpleBold size={26} />,
    text: 'Buy',
    content: <Buy />,
  },
]
const WalletApp = () => {
  //const [step, setStep] = useState('setup') // setup | mnemonic | wallet
  //const [password, setPassword] = useState('')
  //const [wallet, setWallet] = useState<any>(null)
  const [walletAddress, setWalletAddress] = useState<string>('')
  //const [balance, setBalance] = useState(0)
  const [activeTab, setActiveTab] = useState('home')

  const handleTabChange = (value: any) => {
    setActiveTab(value)
  }
  const sui = 500
  const usd = 1000000

  useEffect(() => {
    const keyPair = Ed25519Keypair.deriveKeypair(
      'prevent exile gas clutch speak offer arm jacket lazy dove general lion',
    )
    setWalletAddress(keyPair.getPublicKey().toSuiAddress())
  }, [])

  // const generateWallet = async (pwd: any) => {
  //   // Generate a 12-word mnemonic
  //   const mnemonic = bip39.generateMnemonic()
  //   console.log('Mnemonic:', mnemonic)

  //   // Generate seed from mnemonic
  //   const seed = await bip39.mnemonicToSeed(mnemonic)

  //   // Derive a keypair using a standard path
  //   const path = "m/44'/784'/0'/0'/0'"
  //   const { key } = derivePath(path, seed.toString('hex'))

  //   // Initialize the keypair with the derived secret key
  //   const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))
  //   console.log('Address:', keypair.getPublicKey().toSuiAddress())
  //   console.log('Secret Key:', keypair.getSecretKey())
  //   const encryptedKey = CryptoJS.AES.encrypt(seed.toString(), pwd).toString()
  //   localStorage.setItem('wallet', encryptedKey)
  //   setWallet(keypair)
  //   setStep('mnemonic')
  // }

  // // Unlock wallet with stored encrypted seed
  // const unlockWallet = (pwd: any) => {
  //   const encryptedKey = localStorage.getItem('wallet')
  //   if (!encryptedKey) return setStep('setup') // No wallet, return to setup

  //   try {
  //     const decryptedSeed = CryptoJS.AES.decrypt(encryptedKey, pwd).toString(
  //       CryptoJS.enc.Utf8,
  //     )
  //     const { key } = derivePath("m/44'/784'/0'/0'/0'", decryptedSeed)
  //     const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))
  //     setWallet(keypair)
  //     setStep('wallet')
  //   } catch {
  //     alert('Incorrect password')
  //   }
  // }

  return (
    <div className="bg-[#effef2] h-[100dvh] px-6 text-[#003B4A]">
      <Tabs defaultValue="home">
        <TabsContent value="home" className="grid py-8 place-items-center">
          <div className="text-center balance">
            <h1 className="mb-1 text-5xl font-semibold ">
              {sui}
              <span className="text-3xl"> SUI</span>
            </h1>
            <p className="mb-2 text-2xl">${usd}</p>
            <p>
              {walletAddress.substring(0, 8)}...{walletAddress.substring(60)}
            </p>
          </div>
          <div className="flex items-center justify-center w-[85%] gap-3 mt-6 action">
            {userActions.map((action) => (
              <Sheet key={action.text}>
                <SheetTrigger
                  asChild
                  className="bg-[#22758A] text-white p-3 text-sm flex flex-1 flex-col justify-center items-center gap-1 rounded"
                >
                  <div>
                    <div className="">{action.icon}</div>
                    <button>{action.text}</button>
                  </div>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  aria-describedby={`description-${action.text}`}
                >
                  <SheetHeader>
                    <SheetTitle>{action.text}</SheetTitle>
                    <SheetDescription className="invisible">
                      {action.text}
                    </SheetDescription>
                  </SheetHeader>
                  {action.content}
                  <SheetFooter>
                    <SheetClose asChild>
                      <button>CLOSE</button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ))}
          </div>
          {/* {step === 'setup' && (
            <div>
              <h2>Create a Password</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={() => generateWallet(password)}>
                Create Wallet
              </button>
            </div>
          )}
          {step === 'mnemonic' && (
            <div>
              <h2>Save Your Mnemonic</h2>
              <p>{mnemonic}</p>
              <button onClick={() => setStep('wallet')}>
                I have saved my mnemonic
              </button>
            </div>
          )} */}
        </TabsContent>
        <TabsContent value="swap">
          <Swap />
        </TabsContent>
        <TabsContent value="browse">Browse</TabsContent>
        <TabsContent value="activity">Activity</TabsContent>

        <TabsList className="fixed bottom-0 left-0 flex justify-between w-full px-6 pb-4 border-t border-[#003B4A]">
          <TabsTrigger
            onClick={() => handleTabChange('home')}
            value="home"
            className={
              activeTab === 'home' ? 'border-t-2 border-[#003B4A] pt-4' : 'pt-4'
            }
          >
            {activeTab === 'home' ? (
              <RiHome8Fill size={28} />
            ) : (
              <RiHome8Line size={28} />
            )}
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleTabChange('swap')}
            value="swap"
            className={
              activeTab === 'swap' ? 'border-t-2 border-[#003B4A] pt-4' : 'pt-4'
            }
          >
            {activeTab === 'swap' ? <PiSwap size={28} /> : <PiSwap size={28} />}
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleTabChange('browse')}
            value="browse"
            className={
              activeTab === 'browse'
                ? 'border-t-2 border-[#003B4A] pt-4'
                : 'pt-4'
            }
          >
            {activeTab === 'browse' ? (
              <PiBrowserFill size={28} />
            ) : (
              <PiBrowserLight size={28} />
            )}
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleTabChange('activity')}
            value="activity"
            className={
              activeTab === 'activity'
                ? 'border-t-2 border-[#003B4A] pt-4'
                : 'pt-4'
            }
          >
            {activeTab === 'activity' ? (
              <TbClockFilled size={28} />
            ) : (
              <TbHistory size={28} />
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default WalletApp
