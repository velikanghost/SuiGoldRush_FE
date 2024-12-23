import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { StoreContext } from '@/mobx store/RootStore'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import telegramService from '../lib/utils'

const Waitlist = () => {
  const { connectStore } = useContext(StoreContext)
  const { isWaitlisted } = connectStore
  const [waitlistData, setWaitlistData] = useState({
    email: '',
    twitterUsername: '',
  })
  const [loading, setLoading] = useState<boolean>(false)

  const [formErrors, setFormErrors] = useState({
    email: '',
    twitterUsername: '',
  })

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const errors: any = {}
    if (!isValidEmail(waitlistData.email)) {
      errors.email = 'Please enter a valid email address!'
    }

    if (waitlistData.twitterUsername === '') {
      errors.twitterUsername = 'Your twitter username is required!'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      await connectStore.joinWaitlist(waitlistData)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="container px-6 mx-auto flex flex-col items-center justify-center min-h-screen text-[#4A403A]">
      {isWaitlisted ? (
        <Sheet
          open={isWaitlisted} // Control visibility
          //   onOpenChange={(isOpen) =>
          //     setWalletActionSheetOpen(isOpen ? action.index : null)
          //   }
        >
          {/* <SheetTrigger
            asChild
            className="bg-[#DBA24D] text-[#4A403A] shadow-lg p-3 text-sm flex flex-1 flex-col justify-center items-center gap-1 rounded"
          >
            <div>
              <button className="font-medium">close</button>
            </div>
          </SheetTrigger> */}
          <SheetContent
            className="flex flex-col items-center justify-center h-full bg-wallet waitlist_sheet"
            side="bottom"
            aria-describedby={`description-waitlisted`}
          >
            <SheetHeader style={{ display: 'none' }}>
              <SheetTitle className="invisible">Waitlisted</SheetTitle>
              <SheetDescription className="invisible">
                You have been waitlisted
              </SheetDescription>
            </SheetHeader>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full max-w-md bg-wallet">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle
                      style={{ display: 'flex' }}
                      className="w-16 h-16 mx-auto mb-4 text-[#4A403A]"
                    />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold">
                    You're on the list!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4 ">
                    We've added{' '}
                    <span className="font-semibold">{waitlistData.email}</span>{' '}
                    to our waitlist. You'll be notified you as soon as we're
                    ready to welcome you aboard!
                  </p>
                  <p className="text-sm text-gray-500">
                    While you wait, follow us on social media for more updates.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                  <Link
                    to="https://x.com/0xVelik"
                    target="_blank"
                    className="btn_primary"
                  >
                    Follow us
                  </Link>
                  <button
                    onClick={() => {
                      telegramService.WebApp?.close()
                    }}
                    className="btn_secondary"
                  >
                    Close
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <img
            src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731425317/logo_1_tmtgnf.png"
            alt="logo"
            className="relative z-20 px-4 mb-6"
          />
          <h1 className="mb-1 text-2xl font-bold">Join Our Waitlist</h1>
          <p className="mb-6 text-lg">Be the first to know when we launch!</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full max-w-sm gap-4"
          >
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              required
              className={
                formErrors.email
                  ? 'py-6 px-3 border-red-600 bg-slate-50'
                  : `py-6 px-3 border-[#4A403A] bg-slate-50`
              }
              onChange={(e) =>
                setWaitlistData({ ...waitlistData, email: e.target.value })
              }
              onClick={() => setFormErrors({ ...formErrors, email: '' })}
            />
            {formErrors.email ? (
              <span className="self-start -my-2 text-sm text-red-600">
                {formErrors.email}
              </span>
            ) : null}

            <Input
              id="twitter_id"
              type="text"
              placeholder="Your twitter username"
              required
              className={
                formErrors.twitterUsername
                  ? 'py-6 px-3 border-red-600 bg-slate-50'
                  : `py-6 px-3 border-[#4A403A] bg-slate-50`
              }
              onChange={(e) =>
                setWaitlistData({
                  ...waitlistData,
                  twitterUsername: e.target.value,
                })
              }
              onClick={() =>
                setFormErrors({ ...formErrors, twitterUsername: '' })
              }
            />
            {formErrors.twitterUsername ? (
              <span className="self-start -my-2 text-sm text-red-600">
                {formErrors.twitterUsername}
              </span>
            ) : null}
            <button type="submit" className="w-full mt-3 btn_primary">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default observer(Waitlist)
