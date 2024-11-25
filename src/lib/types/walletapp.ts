import { ReactElement } from 'react'

export type UserAction = {
  index: number
  icon: ReactElement
  text: string
  content: ReactElement
}

export type CoinDetails = {
  balance: string
  coinObjectId: string
  digest: string
  previousTransaction: string
  version: string
}

export type PaginatedCoinsResult = {
  coinType: string
  totalBalance: string
  details: CoinDetails[]
}
