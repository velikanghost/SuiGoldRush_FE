import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

const Invites = () => {
  const { connectStore } = useContext(StoreContext)
  const { invites } = connectStore

  return (
    <div className="relative h-full w-[93%] rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-4">
      <div className="">
        <h1 className="pb-2 text-3xl font-bold text-[#ffd700] font-body">
          Invite Friends!
        </h1>
        <p className="font-semibold text-[#e0d6b9]">You both get gold coins.</p>
      </div>

      <div className="bg-[#F5EAD1] w-full p-2 rounded mt-4 max-h-[21.5rem] overflow-y-auto">
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
    </div>
  )
}

export default observer(Invites)
