import { IoIosArrowForward } from 'react-icons/io'
import { Link } from 'react-router-dom'

const Browse = () => {
  return (
    <div>
      <Link
        to="https://portalbridge.com"
        target="_blank"
        className="bg-[#5c4f3a] -mt-5 text-primary-foreground flex justify-between items-center p-2 gap-3 rounded-xl shadow-lg mb-4"
      >
        <div className="bg-[#fff] p-4 flex justify-center items-center rounded-xl w-1/4">
          <img src="/images/wh.png" alt="" />
        </div>
        <div className="">
          <h2 className="font-bold">Wormhole Bridge</h2>
          <p>Bridge tokens from any supported chain into Sui.</p>
        </div>
        <IoIosArrowForward size={24} />
      </Link>

      {/* <Link
        to="https://hop.ag/swap/SUI-USDC"
        target="_blank"
        className="bg-[#5c4f3a] text-primary-foreground flex justify-between items-center p-2 gap-3 rounded-xl shadow-lg mb-4"
      >
        <div className="bg-[#fff] p-2 flex justify-center items-center rounded-xl w-1/4">
          <img src="/images/mercuryyo.png" alt="" />
        </div>
        <div className="">
          <h2 className="font-bold">Sui Name Service</h2>
          <p>Own your identity, Find and manage your @sui name!</p>
        </div>
        <IoIosArrowForward size={24} />
      </Link> */}
    </div>
  )
}

export default Browse
