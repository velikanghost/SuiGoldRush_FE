import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'

const Invites = () => {
  const { connectStore } = useContext(StoreContext)
  const { invites } = connectStore
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(invites.referral_link)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1000)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="relative w-[93%] rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-4 h-[calc(100%-11.5rem)]">
      <div className="">
        <h1 className="pb-2 text-3xl font-bold text-[#ffd700] font-body">
          Invite Friends!
        </h1>
        <p className="font-semibold text-[#e0d6b9]">You both get gold coins.</p>
      </div>

      <div className="bg-[#F5EAD1] w-full p-2 rounded mt-4 overflow-y-auto relative h-[calc(100%-9.5rem)]">
        <div className="flex justify-between items-center font-bold text-[#5C4F3A] w-full border-b border-[#5C4F3A] pb-2">
          <p>{invites.total_referral_count} friend(s)</p>
          <p>+ {invites.total_referral_count * 5000}</p>
        </div>
        <Table>
          <TableBody>
            {invites.recent_referrals.map((ref, index) => (
              <TableRow key={index} className="border-transparent">
                <TableCell className="text-[#5C4F3A] capitalize">
                  {ref.username}
                </TableCell>
                <TableCell className="text-right text-[#5C4F3A]">
                  5000
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <button
        onClick={handleCopyLink}
        className="w-full mt-4 shadow-lg btn_primary"
      >
        {isCopied ? 'Link Copied!' : 'Invite Friends!'}
      </button>
    </div>
  )
}

export default observer(Invites)
