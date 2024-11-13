import { makeAutoObservable } from 'mobx'

export class ConnectStore {
  rushing: boolean = true

  constructor() {
    makeAutoObservable(this)
  }

  setRushing = (value: boolean) => {
    this.rushing = value
  }
}
