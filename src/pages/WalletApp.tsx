import { useState, useEffect, useContext } from 'react'
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
import { IoCloseOutline, IoCopyOutline } from 'react-icons/io5'
import { TbHistory, TbClockFilled } from 'react-icons/tb'
import { RiHome8Line, RiHome8Fill } from 'react-icons/ri'
import { UserAction } from '@/lib/types/walletapp'
import Receive from '@/components/WalletApp/Receive'
import Send from '@/components/WalletApp/Send'
import Swap from '@/components/WalletApp/Swap'
import Buy from '@/components/WalletApp/Buy'
import { MdExitToApp, MdKeyboardArrowDown } from 'react-icons/md'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@radix-ui/react-dialog'
import { Label } from '@radix-ui/react-label'
import { StoreContext } from '@/mobx store/RootStore'
import { extractTokenName, formatSUIBalance } from '@/lib/helper'

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
  const navigate = useNavigate()
  const { walletStore } = useContext(StoreContext)
  const {
    wallet,
    walletAddress,
    tokensInWallet,
    responseMessage,
    setResponseMessage,
  } = walletStore
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [activeTab, setActiveTab] = useState('home')

  const handleTabChange = (value: any) => {
    setActiveTab(value)
  }
  const usd = 1000000

  const handleCreateWallet = async () => {
    if (password === '' || confirmPassword === '') {
      setResponseMessage('error', 'Fields can not be empty!')
      return
    }
    if (password !== confirmPassword) {
      setResponseMessage('error', 'Passwords do not match!')
      return
    }

    await walletStore.createWallet(confirmPassword)
  }

  useEffect(() => {
    if (walletAddress) walletStore.getTokensInWallet()
  }, [walletAddress])

  useEffect(() => {
    const encryptedPass = localStorage.getItem('pass')
    if (encryptedPass) walletStore.unlockWallet(encryptedPass)
  }, [])

  return (
    <div className="bg-[#F3F0E5] px-6 text-[#4A403A] min-h-[100vh] relative pb-16">
      {wallet ? (
        <>
          <nav className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-1">
              <Avatar className="w-[10%]">
                <AvatarImage
                  className="rounded-[50%]"
                  src="https://github.com/shadcn.png"
                  alt="wallet"
                />
                <AvatarFallback>SR</AvatarFallback>
              </Avatar>
              <MdKeyboardArrowDown />
            </div>
            <MdExitToApp
              onClick={() => navigate('/store')}
              size={32}
              className="w-[14%]"
            />
          </nav>

          <Tabs defaultValue="home">
            <TabsContent
              value="home"
              className="grid pt-4 pb-8 place-items-center"
            >
              <div className="text-center balance">
                <h1
                  onClick={() => walletStore.requestFaucet()}
                  className="mb-1 text-5xl font-semibold"
                >
                  {formatSUIBalance(tokensInWallet[0]?.balance) || 0}
                  <span className="text-3xl"> SUI</span>
                </h1>
                <p className="mb-2 text-xl text-[#7A6E58]">${usd}</p>
                <div className="flex justify-center items-center gap-1 text-[#7A6E58] text-sm">
                  <p>
                    {walletAddress.substring(0, 8)}...
                    {walletAddress.substring(60)}
                  </p>
                  <IoCopyOutline size={14} />
                </div>
              </div>
              <div className="flex items-center justify-center w-[85%] gap-3 mt-6 action">
                {userActions.map((action) => (
                  <Sheet key={action.text}>
                    <SheetTrigger
                      asChild
                      className="bg-[#DBA24D] text-[#4A403A] shadow-lg p-3 text-sm flex flex-1 flex-col justify-center items-center gap-1 rounded"
                    >
                      <div>
                        <div className="">{action.icon}</div>
                        <button className="font-medium">{action.text}</button>
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

              {/*Available Tokens */}
              <div className="flex flex-col justify-center w-full gap-4 mt-10">
                {tokensInWallet?.map((token, index) => (
                  <div
                    key={index}
                    className="bg-[#DBA24D] text-white p-3 flex justify-between items-center rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-[52px] h-[52px] bg-white rounded-[50%] flex justify-center items-center">
                        <img
                          src="https://cryptologos.cc/logos/sui-sui-logo.png?v=035"
                          className="w-full p-2"
                          alt="sui"
                        />
                      </div>
                      <div className="">
                        <h2 className="font-bold">
                          {extractTokenName(token.coinType)}
                        </h2>
                        <p className="text-sm">
                          {formatSUIBalance(token.balance)}{' '}
                          {extractTokenName(token.coinType)}
                        </p>
                      </div>
                    </div>
                    <p className="text-base">$10000</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="swap">
              <Swap />
            </TabsContent>
            <TabsContent value="browse">Browse</TabsContent>
            <TabsContent value="activity">Activity</TabsContent>

            <TabsList className="fixed bottom-0 left-0 flex justify-between w-full border-t border-[#5C4F3A] bg-[#3D2C24]">
              <TabsTrigger
                onClick={() => handleTabChange('home')}
                value="home"
                className={
                  activeTab === 'home'
                    ? 'border-t-2 border-[#E3C5A3] pt-4 shadow-lg px-6 pb-4 text-[#F3F0E5]'
                    : 'pt-4 px-6 pb-4 text-[#F3F0E5]'
                }
              >
                {activeTab === 'home' ? (
                  <RiHome8Fill size={28} className="text-[#F3F0E5]" />
                ) : (
                  <RiHome8Line size={28} className="text-[#F3F0E5]" />
                )}
              </TabsTrigger>
              <TabsTrigger
                onClick={() => handleTabChange('swap')}
                value="swap"
                className={
                  activeTab === 'swap'
                    ? 'border-t-2 border-[#E3C5A3] pt-4 shadow-lg px-6 pb-4 text-[#F3F0E5]'
                    : 'pt-4 px-6 pb-4 text-[#F3F0E5]'
                }
              >
                {activeTab === 'swap' ? (
                  <PiSwap size={28} className="text-[#F3F0E5]" />
                ) : (
                  <PiSwap size={28} className="text-[#F3F0E5]" />
                )}
              </TabsTrigger>
              <TabsTrigger
                onClick={() => handleTabChange('browse')}
                value="browse"
                className={
                  activeTab === 'browse'
                    ? 'border-t-2 border-[#E3C5A3] pt-4 shadow-lg px-6 pb-4 text-[#F3F0E5]'
                    : 'pt-4 px-6 pb-4 text-[#F3F0E5]'
                }
              >
                {activeTab === 'browse' ? (
                  <PiBrowserFill size={28} className="text-[#F3F0E5]" />
                ) : (
                  <PiBrowserLight size={28} className="text-[#F3F0E5]" />
                )}
              </TabsTrigger>
              <TabsTrigger
                onClick={() => handleTabChange('activity')}
                value="activity"
                className={
                  activeTab === 'activity'
                    ? 'border-t-2 border-[#E3C5A3] pt-4 shadow-lg px-6 pb-4 text-[#F3F0E5]'
                    : 'pt-4 px-6 pb-4 text-[#F3F0E5]'
                }
              >
                {activeTab === 'activity' ? (
                  <TbClockFilled size={28} className="text-[#F3F0E5]" />
                ) : (
                  <TbHistory size={28} className="text-[#F3F0E5]" />
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-5 h-[100vh]">
          <nav className="absolute top-0 right-0 px-6 pt-4">
            <MdExitToApp onClick={() => navigate('/store')} size={32} />
          </nav>

          <Dialog>
            <DialogTrigger asChild>
              <button className="shadow-lg btn_primary">Import Wallet</button>
            </DialogTrigger>
            <DialogContent className="absolute bg-[#F3F0E5] w-[90%] shadow-xl p-4 rounded-[8px]">
              <div className="flex items-center justify-between">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-left">
                    Setup your Password
                  </DialogTitle>
                </DialogHeader>
                <DialogClose className="flex text-right">
                  <IoCloseOutline size={28} />
                </DialogClose>
              </div>

              <div className="grid gap-4 py-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="py-5 px-3 border-[#4A403A]"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username" className="font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    required
                    className="py-5 px-3 border-[#4A403A]"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <button className="btn_primary">Submit</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="shadow-lg btn_secondary">
                Create new Wallet
              </button>
            </DialogTrigger>
            <DialogContent className="absolute bg-[#F3F0E5] w-[90%] shadow-xl p-4 rounded-[8px]">
              <div className="flex items-center justify-between">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-left">
                    Setup your Password
                  </DialogTitle>
                </DialogHeader>
                <DialogClose className="flex text-right">
                  <IoCloseOutline size={28} />
                </DialogClose>
              </div>

              <div className="grid gap-4 py-6">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username" className="font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    required
                    className={
                      responseMessage.type === 'error'
                        ? 'py-5 px-3 border-red-600'
                        : `py-5 px-3 border-[#4A403A]`
                    }
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onClick={() => setResponseMessage('', '')}
                  />
                </div>
                {responseMessage.type === 'error' ? (
                  <span className="-my-2 text-sm text-red-600">
                    {responseMessage.text}
                  </span>
                ) : null}
              </div>
              <DialogFooter>
                <button onClick={handleCreateWallet} className="btn_primary">
                  Submit
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default observer(WalletApp)
