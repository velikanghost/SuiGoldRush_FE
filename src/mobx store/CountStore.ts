import { makeAutoObservable } from 'mobx'
import telegramService from '../lib/utils'
import { ConnectStore } from './ConnectStore'
import { Metrics } from '@/lib/types/all'
import axios from 'axios'

export class CountStore {
  connectStore: ConnectStore
  API_KEY = import.meta.env.VITE_APP_API_KEY
  BASE_URL = import.meta.env.VITE_APP_BASE_URL
  count: number = 0
  tapCost: number = 0

  constructor(connectStore: ConnectStore) {
    this.connectStore = connectStore
    makeAutoObservable(this)

    // // Load saved metrics from localStorage on store initialization
    // const savedMetrics = localStorage.getItem('userMetrics')
    // if (savedMetrics) {
    //   runInAction(() => {
    //     this.connectStore.userMetrics = JSON.parse(savedMetrics)
    //   })
    // }

    this.startDailyResetTimer() // Start daily reset timer
  }

  tapTractor = () => {
    if (this.connectStore.userMetrics.energy > 0) {
      this.connectStore.userMetrics.gold_coins +=
        this.connectStore.tractor.multiplier
      this.connectStore.userMetrics.energy -= 1
      this.saveMetrics() // Save metrics to localStorage after update
    }
  }

  syncMetricsToDb = async (metrics: Metrics) => {
    const userId = telegramService.initDataUnsafe?.user?.id
    const data = {
      user_id: userId,
      tap_count: metrics.gold_coins,
      energy: metrics.energy,
    }

    try {
      const res = await axios.post(`${this.BASE_URL}/api/sync-tap`, data, {
        headers: {
          Accept: 'application/json',
          'x-api-key': this.API_KEY,
          'Content-Type': 'application/json',
        },
      })

      console.log(res.data?.status)
    } catch (error) {
      console.log(error)
    }
  }

  upgradeTractor = () => {
    this.connectStore.tractor.upgrade_level += 1
    this.connectStore.tractor.multiplier += 1
    this.connectStore.userMetrics.max_energy += 1000
    this.saveMetrics() // Save metrics to localStorage after update
  }

  resetEnergy = () => {
    this.connectStore.userMetrics.energy = Math.min(
      this.connectStore.userMetrics.max_energy,
    )
    this.saveMetrics() // Save metrics to localStorage after update
  }

  dailyReset = () => {
    this.connectStore.userMetrics.energy =
      this.connectStore.userMetrics.max_energy
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
    localStorage.setItem(
      'userMetrics',
      JSON.stringify(this.connectStore.userMetrics),
    )
  }
}
