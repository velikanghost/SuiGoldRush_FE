import { makeAutoObservable } from 'mobx'
import telegramService from '../lib/utils'
import { ConnectStore } from './ConnectStore'
import axios from 'axios'

export class CountStore {
  connectStore: ConnectStore
  API_KEY = import.meta.env.VITE_APP_API_KEY
  BASE_URL = import.meta.env.VITE_APP_BASE_URL
  count: number = 0
  tapCost: number = 0
  //audio = new Audio('/pickup_gold.mp3')
  audioContext = new window.AudioContext()
  soundBuffer: any = {}

  constructor(connectStore: ConnectStore) {
    this.connectStore = connectStore
    makeAutoObservable(this)
    setInterval(() => {
      this.syncMetricsToDb()
    }, 900000)
    //this.audio.load()

    fetch('/pickup_gold.mp3')
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        this.soundBuffer = buffer
      })

    //this.startDailyResetTimer()
  }

  tapTractor = () => {
    if (this.connectStore.userMetrics.energy > 0) {
      // if (this.audio.paused) {
      //   this.audio.currentTime = 0
      //   this.audio.play()
      // }

      const source = this.audioContext.createBufferSource()
      source.buffer = this.soundBuffer
      source.connect(this.audioContext.destination)
      source.start(0)

      this.connectStore.userMetrics.gold_coins +=
        this.connectStore.tractor.multiplier
      this.connectStore.userMetrics.energy -= 1
      this.connectStore.userMetrics.taps_total += 1
      this.saveMetrics()
    }
  }

  syncMetricsToDb = async () => {
    const userId = telegramService.initDataUnsafe?.user?.id
    const data = {
      user_id: userId,
      tap_count: this.connectStore.userMetrics.taps_total,
      energy: this.connectStore.userMetrics.energy,
    }

    try {
      const res = await axios.post(`${this.BASE_URL}/api/sync-tap`, data, {
        headers: {
          Accept: 'application/json',
          'x-api-key': this.API_KEY,
          'Content-Type': 'application/json',
        },
      })

      if (res.data === 'success') {
        this.connectStore.getTelegramUserData()
      }

      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  upgradeTractor = async (level: number) => {
    const userId = telegramService.initDataUnsafe?.user?.id
    // this.connectStore.tractor.upgrade_level += 1
    // this.connectStore.tractor.multiplier += 1
    // this.connectStore.userMetrics.max_energy += 1000

    try {
      const res = await axios.post(
        `${this.BASE_URL}/api/user/upgrade_tractor?user_id=${userId}&upgrade_level=${level}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            'x-api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('up: ', res.data)
      //this.saveMetrics() // Save metrics to localStorage after update
    } catch (error) {
      console.log(error)
    }
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
