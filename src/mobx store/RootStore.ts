import { createContext } from 'react'
import { ConnectStore } from './ConnectStore'
import { CountStore } from './CountStore'
import { WalletStore } from './WalletStore'

interface StoreContextInterface {
  connectStore: ConnectStore
  countStore: CountStore
  walletStore: WalletStore
}

const connectStore = new ConnectStore()
const countStore = new CountStore(connectStore)
const walletStore = new WalletStore()

export const StoreContext = createContext<StoreContextInterface>({
  connectStore,
  countStore,
  walletStore,
})
