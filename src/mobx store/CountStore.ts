import { UserMetrics, Tractor } from '@/lib/types/all'
import { makeAutoObservable, runInAction } from 'mobx'
import telegramService from '../lib/utils'
//import axios from 'axios'

export class CountStore {
  API_KEY = import.meta.env.VITE_APP_API_KEY
  BASE_URL = import.meta.env.VITE_APP_BASE_URL
  count: number = 0
  tapCost: number = 0

  metrics: UserMetrics = {
    coins: 0,
    energy: 150,
    energyLimit: 150,
    energyRegenRate: 0,
  }

  tractor: Tractor = {
    level: 1,
    energyRegenBonus: 0,
    coinMultiplier: 1,
  }

  constructor() {
    makeAutoObservable(this)

    // Load saved metrics from localStorage on store initialization
    const savedMetrics = localStorage.getItem('userMetrics')
    if (savedMetrics) {
      runInAction(() => {
        this.metrics = JSON.parse(savedMetrics)
      })
    }

    this.startDailyResetTimer() // Start daily reset timer
  }

  tapTractor = () => {
    if (this.metrics.energy > 0) {
      this.metrics.coins += this.tractor.coinMultiplier
      this.metrics.energy -= 1
      this.saveMetrics() // Save metrics to localStorage after update
    }
  }

  //  {
  //     Accept: 'application/json',
  //     Authorization: `Bearer ${this.token}`,
  //     'Content-Type': 'application/json',

  //           'x-api-key': this.API_KEY,
  //   }

  syncMetricsToDb = async (metrics: UserMetrics) => {
    const userId = telegramService.initDataUnsafe?.user?.id
    const data = {
      user_id: userId,
      tap_count: metrics.coins,
      energy: metrics.energy,
    }

    try {
      console.log('fromsync ', data)
      // const res = await axios.post(`/api/sync-tap`, data, {
      //   headers: {
      //     Accept: 'application/json',
      //     Authorization: this.API_KEY,
      //     'Content-Type': 'application/json',
      //   },
      // })
      // console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  upgradeTractor = () => {
    this.tractor.level += 1
    this.tractor.energyRegenBonus += 1000 // energy bonus
    this.tractor.coinMultiplier += 1
    this.metrics.energyLimit += 1000
    this.saveMetrics() // Save metrics to localStorage after update
  }

  resetEnergy = () => {
    this.metrics.energy = Math.min(
      this.metrics.energy + this.metrics.energyRegenRate,
      this.metrics.energyLimit,
    )
    this.saveMetrics() // Save metrics to localStorage after update
  }

  dailyReset = () => {
    this.metrics.energy = this.metrics.energyLimit
    this.saveMetrics() // Save metrics to localStorage after reset
  }

  // Automatically reset energy daily
  startDailyResetTimer = () => {
    //setInterval(() => this.dailyReset(), 24 * 60 * 60 * 1000)
    setInterval(() => this.dailyReset(), 2 * 60 * 1000)
  }

  setCount = (value: number) => {
    this.count = value
  }

  setTapCost = (value: number) => {
    this.tapCost = value
  }

  // Save the current metrics to localStorage
  private saveMetrics = () => {
    localStorage.setItem('userMetrics', JSON.stringify(this.metrics))
  }
}
