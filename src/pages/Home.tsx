import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <section className="relative top-[8%] grid place-items-center">
      <img
        src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423605/miner_qexap3.png"
        className="w-[70%] z-10 -ml-5"
        alt="miner"
      />
      <img
        onClick={() => navigate('/mine')}
        className="absolute top-[70%] w-[63%] transform-[0.2s] active:scale-[1.05] z-10"
        src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731423609/start_button_xwbwnr.png"
        alt="start mining"
      />
    </section>
  )
}

export default Home
