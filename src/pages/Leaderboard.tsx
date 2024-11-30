import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

const Leaderboard = () => {
  const { connectStore } = useContext(StoreContext)
  const { leaderboard } = connectStore
  return (
    <div className="relative w-[93%] rounded mx-auto bg-[#0a3d00]/50 border border-[#8cc63f] p-4 h-[calc(100%-11.5rem)]">
      <div className="pb-4 border-b border-[#ffd700]">
        <h1 className="text-3xl font-bold text-[#ffd700] font-body">
          Leaderboard
        </h1>
      </div>

      <div className="bg-[#F5EAD1] w-full flex flex-col p-2 rounded items-start mt-4 overflow-y-auto h-[calc(100%-4.5rem)]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#3d2c24]">
              <TableHead>No</TableHead>
              <TableHead>Miner</TableHead>
              <TableHead className="text-right">Golds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={index} className="border-transparent">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-[#5C4F3A] capitalize">
                  {user.username}
                </TableCell>
                <TableCell className="text-right text-[#5C4F3A]">
                  {user.gold_coins}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default observer(Leaderboard)
