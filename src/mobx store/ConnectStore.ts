import { Metrics, Tractor, User } from '@/lib/types/all'
import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'

export class ConnectStore {
  API_KEY = import.meta.env.VITE_APP_API_KEY
  BASE_URL = import.meta.env.VITE_APP_BASE_URL
  rushing: boolean = true
  user: User = {
    id: 0,
    telegram_id: 0,
    username: '',
    first_name: '',
    last_name: '',
    referral_link: '',
    created_at: '',
    stats: {
      gold_coins: 0,
      user_rank: 0,
      referral_count: 0,
      upgrade_level: 0,
      energy: 0,
      max_energy: 0,
    },
    tractor: {
      id: 0,
      name: '',
      upgrade_level: 0,
      multiplier: 0,
      max_energy: 0,
      image_url: '',
      price: 0,
    },
  }

  localMetrics: Metrics = {
    gold_coins: 0,
    user_rank: 0,
    referral_count: 0,
    upgrade_level: 0,
    energy: 0,
    max_energy: 0,
  }

  userMetrics: Metrics = {
    gold_coins: 0,
    user_rank: 0,
    referral_count: 0,
    upgrade_level: 0,
    energy: 0,
    max_energy: 0,
  }

  tractor: Tractor = {
    id: 0,
    name: '',
    upgrade_level: 0,
    multiplier: 0,
    max_energy: 0,
    image_url: '',
    price: 0,
  }

  constructor() {
    makeAutoObservable(this)
    // Load saved metrics from localStorage on store initialization
    const savedMetrics = localStorage.getItem('userMetrics')
    if (savedMetrics) {
      runInAction(() => {
        this.localMetrics = JSON.parse(savedMetrics)
      })
    }
  }

  getTelegramUserData = async () => {
    const telegram = (window as any).Telegram?.WebApp
    try {
      const res = await axios.get(
        `${this.BASE_URL}/api/user/profile/${telegram.initDataUnsafe.user.id}`,
        {
          headers: {
            Accept: 'application/json',
            'x-api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        },
      )

      // console.log('local: ', toJS(this.localMetrics))
      // console.log('api: ', res.data?.stats)

      if (res) {
        this.setUser(res.data)

        const higherCoinsObject =
          this.localMetrics.gold_coins > res.data?.stats?.gold_coins
            ? this.localMetrics
            : this.localMetrics.gold_coins < res.data?.stats?.gold_coins
            ? res.data?.stats
            : null

        if (higherCoinsObject) {
          //console.log('higher: ', toJS(higherCoinsObject))
          this.setUserMetrics(higherCoinsObject)
        } else {
          this.setUserMetrics(this.localMetrics)
        }
        this.setTractor(res.data?.tractor)
      }
    } catch (error) {
      console.log(error)
    }
  }

  setUser = (data: User) => {
    this.user = data
  }

  setUserMetrics = (data: Metrics) => {
    this.userMetrics = data
  }

  setTractor = (data: Tractor) => {
    this.tractor = data
  }

  setRushing = (value: boolean) => {
    this.rushing = value
  }
}
