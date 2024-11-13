import Overlay from '@/components/Overlay'
import { StoreContext } from '@/mobx store/RootStore'
import { CSSProperties, useContext } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
}

const Welcome = () => {
  const { connectStore } = useContext(StoreContext)
  const { rushing } = connectStore
  return (
    <div className="flex flex-col items-center justify-center w-full home_section">
      <Overlay />
      <img
        src="https://res.cloudinary.com/dwz1rvu5m/image/upload/v1731425317/logo_1_tmtgnf.png"
        alt="logo"
        className="relative z-20 px-4 mb-6"
      />
      <BeatLoader
        color={'gold'}
        loading={rushing}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="relative z-20"
      />
    </div>
  )
}

export default Welcome
