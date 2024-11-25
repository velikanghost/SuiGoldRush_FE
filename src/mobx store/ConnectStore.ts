import { Invites, Leaderboard, Metrics, Tractor, User } from '@/lib/types/all'
import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import telegramService from '../lib/utils'

export class ConnectStore {
  API_KEY = import.meta.env.VITE_APP_API_KEY
  BASE_URL = import.meta.env.VITE_APP_BASE_URL
  rushing: boolean = true
  localMetrics: Metrics = {
    gold_coins: 0,
    user_rank: 0,
    referral_count: 0,
    upgrade_level: 0,
    energy: 0,
    max_energy: 0,
    taps_total: 0,
  }

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
      taps_total: 0,
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
  userMetrics: Metrics = {
    gold_coins: 0,
    user_rank: 0,
    referral_count: 0,
    upgrade_level: 0,
    energy: 0,
    max_energy: 0,
    taps_total: 0,
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

  tractors: Tractor[] = []
  leaderboard: Leaderboard[] = []
  invites: Invites = {
    total_referral_count: 0,
    referral_link: '',
    recent_referrals: [],
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
      console.log('api: ', res.data)

      if (res) {
        this.setUser(res.data)

        const higherCoinsObject =
          this.localMetrics.gold_coins > res.data?.stats?.gold_coins
            ? this.localMetrics
            : this.localMetrics.gold_coins < res.data?.stats?.gold_coins
            ? res.data?.stats
            : null

        if (higherCoinsObject) {
          this.setUserMetrics(higherCoinsObject)
        } else {
          this.setUserMetrics(res.data?.stats)
        }
        this.setTractor(res.data?.tractor)
      }
    } catch (error) {
      console.log(error)
    }
  }

  getLeaderboard = async () => {
    try {
      const res = await axios.get(`${this.BASE_URL}/api/leaderboard`, {
        headers: {
          Accept: 'application/json',
          'x-api-key': this.API_KEY,
          'Content-Type': 'application/json',
        },
      })

      this.setLeaderboard(res.data)

      //console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  getTractors = async () => {
    try {
      const res = await axios.get(`${this.BASE_URL}/api/tractors`, {
        headers: {
          Accept: 'application/json',
          'x-api-key': this.API_KEY,
          'Content-Type': 'application/json',
        },
      })

      this.setTractors(res.data)

      console.log('tracts', res.data)
    } catch (error) {
      console.log(error)
    }
  }

  getInvites = async () => {
    const id = telegramService.initDataUnsafe?.user?.id
    try {
      const res = await axios.get(
        `${this.BASE_URL}/api/user/invites?telegram_id=${id}`,
        {
          headers: {
            Accept: 'application/json',
            'x-api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        },
      )

      this.setInvites(res.data)

      console.log(res.data)
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

  setLeaderboard = (data: Leaderboard[]) => {
    this.leaderboard = data
  }

  setTractors = (data: Tractor[]) => {
    this.tractors = data
  }

  setInvites = (data: Invites) => {
    this.invites = data
  }

  setRushing = (value: boolean) => {
    this.rushing = value
  }
}
