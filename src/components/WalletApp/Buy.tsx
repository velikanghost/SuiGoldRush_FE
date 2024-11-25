import { IoIosArrowForward } from 'react-icons/io'
import { Link } from 'react-router-dom'

const Buy = () => {
  return (
    <div>
      <Link
        to="https://neocrypto.net"
        target="_blank"
        className="bg-[#5c4f3a] text-primary-foreground flex justify-between items-center p-2 gap-3 rounded-xl shadow-lg mb-4"
      >
        <div className="bg-[#fff] p-4 flex justify-center items-center rounded-xl w-1/4">
          <img src="/images/logo.svg" alt="" />
        </div>
        <div className="">
          <h2 className="font-bold">Neocrypto</h2>
          <p>Instantly buy crypto with a credit card</p>
        </div>
        <IoIosArrowForward size={24} />
      </Link>

      <Link
        to="https://mercuryo.io"
        target="_blank"
        className="bg-[#5c4f3a] text-primary-foreground flex justify-between items-center p-2 gap-3 rounded-xl shadow-lg mb-4"
      >
        <div className="bg-[#fff] p-2 flex justify-center items-center rounded-xl w-1/4">
          <img src="/images/mercuryyo.png" alt="" />
        </div>
        <div className="">
          <h2 className="font-bold">Mecuryyo</h2>
          <p>Instantly buy crypto with a credit card</p>
        </div>
        <IoIosArrowForward size={24} />
      </Link>

      <Link
        to="https://changelly.com"
        target="_blank"
        className="bg-[#5c4f3a] text-primary-foreground flex justify-between items-center p-2 gap-3 rounded-xl shadow-lg mb-4"
      >
        <div className="bg-[#fff] p-2 flex justify-center items-center rounded-xl w-1/4">
          <img src="/images/changelly.png" alt="" />
        </div>
        <div className="">
          <h2 className="font-bold">Changelly</h2>
          <p>Instant simple swap between any crypto</p>
        </div>
        <IoIosArrowForward size={24} />
      </Link>
    </div>
  )
}

export default Buy
