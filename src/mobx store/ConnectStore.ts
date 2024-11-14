//import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export class ConnectStore {
  API_KEY = import.meta.env.VITE_APP_API_KEY
  BASE_URL = import.meta.env.VITE_APP_BASE_URL
  rushing: boolean = true
  userId: string = ''
  username: string = ''
  firstName: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  // utils/getTelegramUserData.ts
  getTelegramUserData = async () => {
    const telegram = (window as any).Telegram?.WebApp
    try {
      const data = {
        userId: telegram.initDataUnsafe.user.id,
        username: telegram.initDataUnsafe.user.username,
        firstName: telegram.initDataUnsafe.user.first_name,
      }
      this.setUser(data)
      // const res = await axios.get(
      //   `${this.BASE_URL}/api/user/profile/${telegram.initDataUnsafe.user.id}`,
      // )
      // if (res) {
      //   console.log(res.data)
      // }
    } catch (error) {
      console.log(error)
    }
  }

  setUser = (data: { userId: string; username: string; firstName: string }) => {
    this.userId = data.userId
    this.username = data.username
    this.firstName = data.firstName
  }

  setRushing = (value: boolean) => {
    this.rushing = value
  }
}
