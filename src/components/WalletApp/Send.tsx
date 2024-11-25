import { formatSUIBalance, shortenAddress } from '@/lib/helper'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { StoreContext } from '@/mobx store/RootStore'
import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Table, TableBody, TableRow, TableCell } from '../ui/table'
import { BsCheck2Circle } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { MdArrowOutward } from 'react-icons/md'

const Send = () => {
  const { walletStore } = useContext(StoreContext)
  const {
    tokensInWallet,
    estimatedTransfer,
    transferFinalized,
    transferResult,
    setEstimatedTransfer,
    setWalletActionSheetOpen,
  } = walletStore
  const [recipent, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [isStarting, setIsStarting] = useState<boolean>(false)
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false)

  useEffect(() => {
    walletStore.estimatedTransfer
  }, [walletStore])

  const handleSendSUI = async () => {
    setIsStarting(true)
    try {
      const amt = amount * 1e9
      await walletStore.transferSUI(recipent, amt)
      setIsStarting(false)
    } catch (error) {
      console.log(error)
      setIsStarting(false)
    }
  }

  const handleCompleteSend = async () => {
    setIsFinalizing(true)
    try {
      await walletStore.completeTransfer(estimatedTransfer!)
      setIsFinalizing(false)
    } catch (error) {
      console.log(error)
      setIsFinalizing(false)
    }
  }

  // useEffect(() => {
  //   console.log('est:  ', toJS(estimatedTransfer))
  // }, [])

  return (
    <>
      {transferFinalized ? (
        <div className="flex flex-col items-center justify-center mt-6 text-center">
          <BsCheck2Circle size={70} />
          <h2 className="mt-6 mb-4 text-xl font-bold">Transfer Complete</h2>
          <p className="w-[85%] text-base mb-5">
            You have successfully made a transfer of{' '}
            <span className="text-xl font-semibold">{amount}</span> SUI to{' '}
            <span className="text-xl font-semibold">
              {shortenAddress(recipent)}
            </span>
          </p>
          <Link
            className="mt-1 flex items-center justify-center gap-1 font-medium bg-[#4A403A] text-primary-foreground px-4 py-2 rounded"
            to={`https://suiscan.xyz/testnet/tx/${transferResult.digest}`}
            target="_blank"
          >
            View on Suiscan <MdArrowOutward size={20} />
          </Link>
        </div>
      ) : (
        <>
          <div className="w-[72px] h-[72px] bg-white rounded-[50%] flex justify-center items-center mx-auto shadow-lg">
            <img
              src="https://cryptologos.cc/logos/sui-sui-logo.png?v=035"
              className="w-full p-2"
              alt="sui"
            />
          </div>

          {!estimatedTransfer || estimatedTransfer.to === '' ? (
            <div className="mt-12">
              <Input
                className="py-6 px-3 border-[#4A403A] mb-5"
                type="text"
                placeholder="Recipient SUI address"
                value={recipent}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <Input
                className="py-6 px-3 border-[#4A403A] appearance-none"
                inputMode="numeric"
                type="number"
                min={0}
                placeholder="Amount to send"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
              />
              <div className="mt-2 text-end">
                <Label>
                  {tokensInWallet.length > 0
                    ? formatSUIBalance(tokensInWallet[0]?.totalBalance).toFixed(
                        4,
                      )
                    : 0}{' '}
                  SUI
                </Label>
                <span
                  onClick={() => {
                    const max = tokensInWallet[0]?.totalBalance
                    setAmount(+max / 1e9)
                  }}
                  className="text-[9px] bg-[#4A403A] text-primary-foreground px-4 py-2 rounded-xl align-middle ml-2"
                >
                  MAX
                </span>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 text-xl font-semibold text-center">
                Sending {estimatedTransfer.amount / 1e9} SUI
              </p>
              <Table className="mt-2">
                <TableBody>
                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableCell className="font-medium">From:</TableCell>
                    <TableCell className="text-right text-[#5C4F3A]">
                      {estimatedTransfer?.from.substring(0, 8)}...
                      {estimatedTransfer?.from.substring(60)}
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableCell className="font-medium">To:</TableCell>
                    <TableCell className="text-right text-[#5C4F3A]">
                      {estimatedTransfer?.to.substring(0, 8)}...
                      {estimatedTransfer?.to.substring(60)}
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableCell className="font-medium">Gas:</TableCell>
                    <TableCell className="text-right text-[#5C4F3A]">
                      {estimatedTransfer?.gas! / 1e9}
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableCell className="font-medium">
                      Amount (plus gas):
                    </TableCell>
                    <TableCell className="text-right text-[#5C4F3A]">
                      {(estimatedTransfer?.amount! + estimatedTransfer?.gas!) /
                        1e9}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}

          {estimatedTransfer?.willFail ? (
            <p className="p-3 mt-2 text-center text-red-600 border border-red-500 rounded">
              {estimatedTransfer.message}
            </p>
          ) : null}

          <div className="fixed bottom-0 left-0 flex w-full gap-3 px-6 mt-6 mb-4">
            <button
              onClick={() => {
                setEstimatedTransfer(undefined!)
                setWalletActionSheetOpen(null)
              }}
              className="w-full btn_secondary"
            >
              Cancel
            </button>
            {!estimatedTransfer || estimatedTransfer.to === '' ? (
              <button onClick={handleSendSUI} className="w-full btn_primary">
                {isStarting ? 'Wait..' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleCompleteSend}
                className="w-full btn_primary"
              >
                {isFinalizing ? 'Sending..' : 'Send'}
              </button>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default observer(Send)
