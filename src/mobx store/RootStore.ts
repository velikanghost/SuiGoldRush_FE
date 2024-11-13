import { createContext } from 'react'
import { ConnectStore } from './ConnectStore'
import { CountStore } from './CountStore'

interface StoreContextInterface {
  connectStore: ConnectStore
  countStore: CountStore
}

const connectStore = new ConnectStore()
const countStore = new CountStore()

export const StoreContext = createContext<StoreContextInterface>({
  connectStore,
  countStore,
})
