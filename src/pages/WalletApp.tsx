import { useState, useEffect, useContext } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from '@/components/ui/sheet'
import { HiOutlineQrcode } from 'react-icons/hi'
import { FiSend } from 'react-icons/fi'
import {
  PiBrowserLight,
  PiCurrencyDollarSimpleBold,
  PiBrowserFill,
} from 'react-icons/pi'
import { IoCloseOutline, IoCopyOutline } from 'react-icons/io5'
import { TbHistory, TbClockFilled } from 'react-icons/tb'
import { RiHome8Line, RiHome8Fill } from 'react-icons/ri'
import { ManageWallet, UserAction } from '@/lib/types/walletapp'
import Receive from '@/components/WalletApp/Receive'
import Send from '@/components/WalletApp/Send'
import Buy from '@/components/WalletApp/Buy'
import { MdExitToApp, MdKeyboardArrowDown } from 'react-icons/md'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { EstimatedTransaction } from '@/lib/types/all'
import { BsCheck2Circle } from 'react-icons/bs'
import Browse from '@/components/WalletApp/Browse'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'
import ManagePhrase from '@/components/WalletApp/ManagePhrase'
import ManageKey from '@/components/WalletApp/ManageKey'

const userActions: UserAction[] = [
  {
    index: 1,
    icon: <HiOutlineQrcode size={26} />,
    text: 'Receive',
    content: <Receive />,
  },
  {
    index: 2,
    icon: <FiSend size={26} />,
    text: 'Send',
    content: <Send />,
  },
  {
    index: 3,
    icon: <PiCurrencyDollarSimpleBold size={26} />,
    text: 'Buy',
    content: <Buy />,
  },
]

const manageWalletActions: ManageWallet[] = [
  {
    index: 1,
    text: 'Export Secret Phrase',
    content: <ManagePhrase />,
  },
  {
    index: 2,
    text: 'Export Private Key',
    content: <ManageKey />,
  },
]

const WalletApp = () => {
  const navigate = useNavigate()
  const { walletStore } = useContext(StoreContext)
  const {
    wallet,
    walletSeedPhrase,
    walletAddress,
    tokensInWallet,
    isNewWallet,
    responseMessage,
    estimatedTransaction,
    completing,
    transactionFinalized,
    walletActionSheetOpen,
    manageWalletSheetOpen,
    setIsNewWallet,
    setManageWalletSheetOpen,
    setWalletActionSheetOpen,
    setResponseMessage,
  } = walletStore
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [activeTab, setActiveTab] = useState('home')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const bool = searchParams.get('buydal') === 'true'
    if (bool) {
      setIsOpen(true)
    }
  }, [searchParams])

  const handleTabChange = (value: any) => {
    setActiveTab(value)
  }

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

  useEffect(() => {
    if (walletAddress) walletStore.getTokensInWallet()
  }, [walletAddress])

  useEffect(() => {
    walletStore.unlockWallet()
  }, [])

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 500)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  const handleCompletePurchase = async (data: EstimatedTransaction) => {
    await walletStore.completePurchase(data)
  }

  return (
    <div className="bg-[#F3F0E5] px-6 text-[#4A403A] min-h-[100vh] relative pb-16">
      {wallet ? (
        <>
          {isNewWallet ? (
            <div className="flex flex-col justify-center h-full text-center pt-[7%]">
              <h2 className="pt-8 mb-4 text-3xl font-medium">
                Wallet Created!
              </h2>
              <h3 className="text-lg font-bold">SECRET PHRASE</h3>
              <p className="mb-6">
                Your secret phrase is the only way to recover your wallet.
              </p>

              <div className="flex flex-col items-center justify-center border-[#4A403A] border-2 rounded-xl py-3">
                <p className="border-b text-left border-[#4A403A] px-3 pb-3">
                  {walletSeedPhrase}
                </p>
                <span
                  className="flex items-center gap-2 pt-3 cursor-pointer"
                  onClick={handleCopyPhrase}
                >
                  {isCopied ? 'Copied' : 'Copy'} <IoCopyOutline size={14} />
                </span>
              </div>
              <div className="px-3 py-5 mt-6 mb-8 font-medium text-center text-red-600 border border-red-600 rounded">
                <p>Never disclose your secret phrase.</p>
                <p>
                  Anyone with your secret phrase will have full control of your
                  wallet.
                </p>
              </div>
              <button
                onClick={() => setIsNewWallet(false)}
                className="w-full mb-6 btn_primary"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <nav className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar className="w-[10%]">
                        <AvatarImage
                          className="rounded-[50%]"
                          src="https://github.com/shadcn.png"
                          alt="wallet"
                        />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="ml-7 mt-2 pb-5 shadow-3xl bg-[#3D2C24] w-60 py-4 rounded text-primary-foreground outline-none border border-[#3D2C24]">
                      <div className="flex flex-col gap-5">
                        <h2 className="border-b border-[#F3F0E5] px-4 pb-3 font-semibold">
                          Manage Wallet
                        </h2>
                        {manageWalletActions.map((action) => (
                          <Sheet
                            open={manageWalletSheetOpen === action.index}
                            onOpenChange={(isOpen) =>
                              setManageWalletSheetOpen(
                                isOpen ? action.index : null,
                              )
                            }
                            key={action.text}
                          >
                            <SheetTrigger
                              asChild
                              className="flex flex-col gap-1 px-4 text-sm cursor-pointer text-primary-foreground"
                            >
                              <div className="font-medium">{action.text}</div>
                            </SheetTrigger>
                            <SheetContent
                              className="h-full bg-wallet"
                              side="bottom"
                              aria-describedby={`description-${action.text}`}
                              tabIndex={action.index}
                            >
                              <SheetHeader>
                                <SheetTitle>{action.text}</SheetTitle>
                                <SheetDescription className="invisible">
                                  {action.text}
                                </SheetDescription>
                              </SheetHeader>
                              {action.content}
                            </SheetContent>
                          </Sheet>
                        ))}
                        <button
                          onClick={() => navigate('/store')}
                          className="px-4 text-sm font-medium text-left outline-none"
                        >
                          Exit Wallet
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

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
                    <h1 className="mb-1 text-5xl font-semibold">
                      {tokensInWallet.length > 0
                        ? formatSUIBalance(
                            tokensInWallet[0].totalBalance,
                          ).toFixed(4)
                        : 0}
                      <span className="text-3xl"> SUI</span>
                    </h1>
                    {/* <p className="mb-2 text-xl text-[#7A6E58]">${usd}</p> */}
                    <div
                      onClick={handleCopyAddress}
                      className="flex justify-center items-center gap-1 text-[#7A6E58] text-sm"
                    >
                      <p>
                        {walletAddress.substring(0, 8)}...
                        {walletAddress.substring(60)}
                      </p>
                      {isCopied ? (
                        <span className="text-[9px] bg-[#4A403A] text-primary-foreground px-2 rounded-xl">
                          Copied!
                        </span>
                      ) : (
                        <IoCopyOutline size={14} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-[85%] gap-3 mt-6 action">
                    {userActions.map((action) => (
                      <Sheet
                        open={walletActionSheetOpen === action.index} // Control visibility
                        onOpenChange={(isOpen) =>
                          setWalletActionSheetOpen(isOpen ? action.index : null)
                        }
                        key={action.text}
                      >
                        <SheetTrigger
                          asChild
                          className="bg-[#DBA24D] text-[#4A403A] shadow-lg p-3 text-sm flex flex-1 flex-col justify-center items-center gap-1 rounded"
                        >
                          <div>
                            <div className="">{action.icon}</div>
                            <button className="font-medium">
                              {action.text}
                            </button>
                          </div>
                        </SheetTrigger>
                        <SheetContent
                          className="h-full bg-wallet"
                          side="bottom"
                          aria-describedby={`description-${action.text}`}
                          tabIndex={action.index}
                        >
                          <SheetHeader>
                            <SheetTitle>{action.text} SUI</SheetTitle>
                            <SheetDescription className="invisible">
                              {action.text} SUI
                            </SheetDescription>
                          </SheetHeader>
                          {action.content}
                        </SheetContent>
                      </Sheet>
                    ))}
                  </div>

                  <div>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                      <SheetContent
                        side="bottom"
                        aria-describedby={`description-`}
                      >
                        <SheetHeader>
                          <SheetTitle>
                            {transactionFinalized
                              ? 'Payment Successful'
                              : 'Review Transaction'}
                          </SheetTitle>
                        </SheetHeader>

                        {transactionFinalized ? (
                          <div className="flex flex-col items-center justify-center mt-6">
                            <BsCheck2Circle size={70} />
                            <p className="mt-3 text-xl">Tractor Upgraded</p>
                            <div className="flex w-full gap-3 mt-6">
                              <button
                                className="w-full btn_primary"
                                onClick={() => navigate('/mine')}
                              >
                                Start Mining
                              </button>
                              <button
                                className="w-full btn_secondary"
                                onClick={() => {
                                  walletStore.getTokensInWallet()
                                  setIsOpen(false)
                                }}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        ) : (
                          <Table className="mt-5">
                            <TableBody>
                              <TableRow className="border-transparent hover:bg-transparent">
                                <TableCell className="font-medium">
                                  From:
                                </TableCell>
                                <TableCell className="text-right text-[#5C4F3A]">
                                  {estimatedTransaction?.from.substring(0, 8)}
                                  ...
                                  {estimatedTransaction?.from.substring(60)}
                                </TableCell>
                              </TableRow>

                              <TableRow className="border-transparent hover:bg-transparent">
                                <TableCell className="font-medium">
                                  To:
                                </TableCell>
                                <TableCell className="text-right text-[#5C4F3A]">
                                  {estimatedTransaction?.to.substring(0, 8)}...
                                  {estimatedTransaction?.to.substring(60)}
                                </TableCell>
                              </TableRow>

                              <TableRow className="border-transparent hover:bg-transparent">
                                <TableCell className="font-medium">
                                  Gas:
                                </TableCell>
                                <TableCell className="text-right text-[#5C4F3A]">
                                  {estimatedTransaction?.gas! / 1e9}
                                </TableCell>
                              </TableRow>

                              <TableRow className="border-transparent hover:bg-transparent">
                                <TableCell className="font-medium">
                                  Amount (plus gas):
                                </TableCell>
                                <TableCell className="text-right text-[#5C4F3A]">
                                  {(estimatedTransaction?.amount! +
                                    estimatedTransaction?.gas!) /
                                    1e9}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}

                        {estimatedTransaction?.willFail ? (
                          <p className="p-3 mt-2 text-center text-red-600 border border-red-500 rounded">
                            {estimatedTransaction.message}
                          </p>
                        ) : null}

                        {transactionFinalized ? null : (
                          <div className="flex items-center justify-between gap-6 mt-6">
                            <button
                              className="w-full btn_secondary"
                              onClick={() => {
                                setIsOpen(false)
                                navigate('/store')
                              }}
                            >
                              Decline
                            </button>
                            <button
                              disabled={estimatedTransaction?.willFail}
                              className={
                                estimatedTransaction?.willFail
                                  ? 'w-full btn_primary__diabled'
                                  : 'w-full btn_primary'
                              }
                              onClick={() =>
                                handleCompletePurchase(estimatedTransaction!)
                              }
                            >
                              {completing ? 'Confirming...' : 'Confirm'}
                            </button>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
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
                              {formatSUIBalance(token.totalBalance).toFixed(4)}{' '}
                              {extractTokenName(token.coinType)}
                            </p>
                          </div>
                        </div>
                        {/* <p className="text-base">$10000</p> */}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                {/* <TabsContent value="swap">
              <Swap />
            </TabsContent> */}
                <TabsContent value="browse">
                  <Browse />
                </TabsContent>
                <TabsContent value="activity">
                  Your transaction history will appear here when available
                </TabsContent>

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
                  {/* <TabsTrigger
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
              </TabsTrigger> */}
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
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-5 h-[100vh]">
          <nav className="absolute top-0 right-0 px-6 pt-4">
            <MdExitToApp onClick={() => navigate('/store')} size={32} />
          </nav>

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
