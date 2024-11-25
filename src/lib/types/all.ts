import { Transaction } from '@mysten/sui/transactions'

export interface User {
  id: number
  telegram_id: number
  username: string
  first_name: string
  last_name: string
  referral_link: string
  created_at: string
  stats: Metrics
  tractor: Tractor
}

export interface Metrics {
  gold_coins: number
  user_rank: number
  referral_count: number
  upgrade_level: number
  energy: number
  max_energy: number
  taps_total: number
}

export interface Tractor {
  id: number
  name: string
  upgrade_level: number
  multiplier: number
  max_energy: number
  image_url: string
  price: number
}

export type Invites = {
  total_referral_count: number
  referral_link: string
  recent_referrals: Referrals[]
}

export type Referrals = {
  telegram_id: number
  username: string
  first_name: string
  last_name: string
  created_at: string
}

export interface Leaderboard {
  telegram_id: number
  username: string
  gold_coins: number
}

export interface EstimatedTransaction {
  from: string
  to: string
  gas: number
  message: string
  willFail: boolean
  tx: Transaction
  amount: number
  tractorLevel: number
}

export interface EstimatedTransfer {
  from: string
  to: string
  gas: number
  message: string
  willFail: boolean
  tx: Transaction
  amount: number
}
