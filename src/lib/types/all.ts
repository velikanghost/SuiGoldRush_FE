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
