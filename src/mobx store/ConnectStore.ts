import { makeAutoObservable } from 'mobx'

export class ConnectStore {
  rushing: boolean = true
  userId: string | null = null
  username: string | null = null
  firstName: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // utils/getTelegramUserData.ts
  getTelegramUserData = () => {
    const telegram = (window as any).Telegram?.WebApp
    try {
      const data = {
        userId: telegram.initDataUnsafe.user.id,
        username: telegram.initDataUnsafe.user.username,
        firstName: telegram.initDataUnsafe.user.first_name,
      }
      this.setUser(data)
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
