export interface UserMetrics {
  coins: number
  energy: number
  energyLimit: number
  energyRegenRate: number // extra energy per upgrade level
}

export interface Tractor {
  level: number
  energyRegenBonus: number // Energy increase per upgrade level
  coinMultiplier: number // Coins gained per tap per level
}
