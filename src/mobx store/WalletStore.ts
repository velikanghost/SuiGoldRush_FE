//import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import * as bip39 from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import CryptoJS from 'crypto-js'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { CoinStruct, getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { requestSuiFromFaucetV0, getFaucetHost } from '@mysten/sui/faucet'

export class WalletStore {
  PASS_HASH = import.meta.env.VITE_APP_PASS_HASH
  // use getFullnodeUrl to define Devnet RPC location
  rpcUrl = getFullnodeUrl('testnet')
  // create a client connected to testnet
  suiClient = new SuiClient({ url: this.rpcUrl })

  loading: boolean = true
  wallet: any = null
  walletAddress: string = ''
  walletSeedPhrase: string = ''
  tokensInWallet: CoinStruct[] = []
  responseMessage = {
    type: '',
    text: '',
  }
  encryptedKey: any = null
  encryptedPass: any = null

  constructor() {
    makeAutoObservable(this)
    const wallet = localStorage.getItem('wallet')
    const pass = localStorage.getItem('pass')
    if (wallet) {
      runInAction(() => {
        this.encryptedKey = wallet
        this.encryptedPass = pass
      })
    }
  }

  //TODO:
  /*
  set lock time
  auto unlock wallet after refresh if within time
  require password if lock time passed
  diff btwn first time and recurring
  encrypt pass before saving to LS
  */

  createWallet = async (pwd: string) => {
    // Generate a 12-word mnemonic
    const mnemonic = bip39.generateMnemonic()
    //console.log('Mnemonic:', mnemonic)

    // Generate seed from mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic)

    // Derive a keypair using a standard path
    const path = "m/44'/784'/0'/0'/0'"
    const { key } = derivePath(path, seed.toString('hex'))

    // Initialize the keypair with the derived secret key
    const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))
    this.setWalletSeedPhrase(mnemonic)
    this.setWallet(keypair)
    this.setWalletAddress(keypair.getPublicKey().toSuiAddress())
    const encryptedKey = CryptoJS.AES.encrypt(seed.toString(), pwd).toString()
    const encryptedPass = CryptoJS.AES.encrypt(
      pwd.toString(),
      this.PASS_HASH,
    ).toString()
    localStorage.setItem('pass', encryptedPass)
    localStorage.setItem('wallet', encryptedKey)
  }

  unlockWallet = async () => {
    //const encryptedKey = localStorage.getItem('wallet')

    if (!this.encryptedKey) {
      this.setWallet(null)
      return
    }

    try {
      const pwd = CryptoJS.AES.decrypt(
        this.encryptedPass,
        import.meta.env.VITE_APP_PASS_HASH,
      ).toString(CryptoJS.enc.Utf8)

      const decryptedSeed = CryptoJS.AES.decrypt(
        this.encryptedKey,
        pwd,
      ).toString(CryptoJS.enc.Utf8)
      const { key } = derivePath("m/44'/784'/0'/0'/0'", decryptedSeed)
      const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))
      this.setWallet(keypair)
      this.setWalletAddress(keypair.getPublicKey().toSuiAddress())
    } catch (error) {
      console.log(error)
    }
  }

  getTokensInWallet = async () => {
    const res = await this.suiClient.getCoins({
      owner: this.walletAddress,
    })

    const balance = res.data
    console.log(balance)
    this.setTokensInWallet(balance)
  }

  requestFaucet = async () => {
    await requestSuiFromFaucetV0({
      host: getFaucetHost('testnet'),
      recipient: this.walletAddress,
    })
  }

  setWallet = (data: any) => {
    this.wallet = data
  }

  setWalletAddress = (value: string) => {
    this.walletAddress = value
  }

  setWalletSeedPhrase = (value: string) => {
    this.walletSeedPhrase = value
  }

  setTokensInWallet = (data: CoinStruct[]) => {
    this.tokensInWallet = data
  }

  setResponseMessage = (type: string, text: string) => {
    this.responseMessage = {
      type,
      text,
    }
  }

  setLoading = (value: boolean) => {
    this.loading = value
  }
}
