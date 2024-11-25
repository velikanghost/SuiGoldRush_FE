//import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import * as bip39 from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import CryptoJS from 'crypto-js'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import {
  getFullnodeUrl,
  PaginatedCoins,
  SuiClient,
  SuiTransactionBlockResponse,
} from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import {
  EstimatedTransaction,
  EstimatedTransfer,
  Tractor,
} from '@/lib/types/all'
import { CountStore } from './CountStore'
import { PaginatedCoinsResult } from '@/lib/types/walletapp'

export class WalletStore {
  countStore: CountStore
  PASS_HASH = import.meta.env.VITE_APP_PASS_HASH
  // use getFullnodeUrl to define Devnet RPC location
  rpcUrl = getFullnodeUrl('testnet')
  // create a client connected to testnet
  suiClient = new SuiClient({ url: this.rpcUrl })

  loading: boolean = true
  wallet: any = null
  walletAddress: string = ''
  walletSeedPhrase: string = ''
  tokensInWallet: PaginatedCoinsResult[] = []
  walletActionSheetOpen: number | null = 0
  responseMessage = {
    type: '',
    text: '',
  }
  encryptedKey: any = null
  encryptedPass: any = null
  isEstimated: boolean = false
  estimatedTransaction: EstimatedTransaction | undefined
  estimatedTransfer: EstimatedTransfer = {
    from: '',
    to: '',
    gas: 0,
    message: '',
    willFail: false,
    tx: new Transaction(),
    amount: 0,
  }
  transferResult: SuiTransactionBlockResponse = {
    digest: '',
  }
  completing: boolean = false
  transactionFinalized: boolean = false
  transferFinalized: boolean = false

  constructor(countStore: CountStore) {
    this.countStore = countStore
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

  // createWallet = async (pwd: string) => {
  //   // Generate a 12-word mnemonic
  //   const mnemonic = bip39.generateMnemonic()
  //   //console.log('Mnemonic:', mnemonic)

  //   // Generate seed from mnemonic
  //   const seed = await bip39.mnemonicToSeed(mnemonic)

  //   // Derive a keypair using a standard path
  //   const path = "m/44'/784'/0'/0'/0'"
  //   const { key } = derivePath(path, seed.toString('hex'))

  //   // Initialize the keypair with the derived secret key
  //   const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))
  //   this.setWalletSeedPhrase(mnemonic)
  //   this.setWallet(keypair)
  //   this.setWalletAddress(keypair.getPublicKey().toSuiAddress())
  //   const encryptedKey = CryptoJS.AES.encrypt(seed.toString(), pwd).toString()
  //   const encryptedPass = CryptoJS.AES.encrypt(
  //     pwd.toString(),
  //     this.PASS_HASH,
  //   ).toString()
  //   localStorage.setItem('pass', encryptedPass)
  //   localStorage.setItem('wallet', encryptedKey)
  // }

  createWallet = async (pwd: string) => {
    const mnemonic = bip39.generateMnemonic()
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const path = "m/44'/784'/0'/0'/0'"
    const { key } = derivePath(path, seed.toString('hex'))
    const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))

    // Logging mnemonic, seed, and public address
    // console.log('Mnemonic (readable):', mnemonic)
    // console.log('Seed (readable):', seed.toString('hex'))
    // console.log(
    //   'Public Address (create):',
    //   keypair.getPublicKey().toSuiAddress(),
    // )
    this.setWalletSeedPhrase(mnemonic)
    this.setWallet(keypair)
    this.setWalletAddress(keypair.getPublicKey().toSuiAddress())

    const encryptedKey = CryptoJS.AES.encrypt(mnemonic, pwd).toString()
    const encryptedPass = CryptoJS.AES.encrypt(
      pwd.toString(),
      this.PASS_HASH,
    ).toString()

    localStorage.clear() // Clear old data
    localStorage.setItem('pass', encryptedPass) // Save encrypted pass
    localStorage.setItem('wallet', encryptedKey) // Save encrypted seed
  }

  // unlockWallet = async () => {
  //   //const encryptedKey = localStorage.getItem('wallet')

  //   const encryptedKey = localStorage.getItem('wallet')
  //   const encryptedPass = localStorage.getItem('pass')

  //   console.log('ekey', encryptedKey)
  //   if (!encryptedKey) {
  //     this.setWallet(null)
  //     return
  //   }

  //   try {
  //     console.log('epass', encryptedPass)
  //     const pwd = CryptoJS.AES.decrypt(
  //       encryptedPass!,
  //       import.meta.env.VITE_APP_PASS_HASH,
  //     ).toString(CryptoJS.enc.Utf8)

  //     console.log('pwd', pwd)

  //     const decryptedSeed = CryptoJS.AES.decrypt(encryptedKey!, pwd).toString(
  //       CryptoJS.enc.Utf8,
  //     )

  //     const { key } = derivePath("m/44'/784'/0'/0'/0'", decryptedSeed)
  //     const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(key))

  //     console.log('kp', keypair.getPublicKey().toSuiAddress())
  //     this.setWallet(keypair)
  //     this.setWalletAddress(keypair.getPublicKey().toSuiAddress())
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  unlockWallet = async () => {
    const encryptedKey = localStorage.getItem('wallet')
    const encryptedPass = localStorage.getItem('pass')

    if (!encryptedKey) {
      this.setWallet(null)
      return
    }

    try {
      const pwd = CryptoJS.AES.decrypt(
        encryptedPass!,
        import.meta.env.VITE_APP_PASS_HASH,
      ).toString(CryptoJS.enc.Utf8)
      const decryptedSeed = CryptoJS.AES.decrypt(encryptedKey!, pwd).toString(
        CryptoJS.enc.Utf8,
      )

      // const { key } = derivePath("m/44'/784'/0'/0'/0'", decryptedSeed)
      const keypair = Ed25519Keypair.deriveKeypair(decryptedSeed)

      // Logging decrypted seed and public address
      // console.log('Decrypted Seed (readable):', decryptedSeed)
      // console.log(
      //   'Public Address (unlock):',
      //   keypair.getPublicKey().toSuiAddress(),
      // )

      this.setWallet(keypair)
      this.setWalletAddress(keypair.getPublicKey().toSuiAddress())
    } catch (error) {
      console.error('Error during wallet unlocking:', error)
    }
  }

  convertGasUsedToReadable = (gasUsed: {
    computationCost: string
    storageCost: string
    storageRebate: string
  }) => {
    const totalGasUsed =
      Number(gasUsed.computationCost) +
      Number(gasUsed.storageCost) -
      Number(gasUsed.storageRebate)

    const readableGas = totalGasUsed / 1e9
    return readableGas
  }

  beginPurchase = async (tractor: Tractor) => {
    const tx = new Transaction()

    const amountToTransfer = tractor.price * 1e9

    const [coin] = tx.splitCoins(tx.gas, [amountToTransfer])

    tx.transferObjects(
      [coin],
      '0xdb61656f80d44aa85724650fd3f776407b2cd576fabd4f731d326eb6d9989f9c',
    )

    try {
      const balance = await this.suiClient.getBalance({
        owner: this.walletAddress,
        coinType: '0x2::sui::SUI',
      })

      // Simulate the transaction block
      const simulationResult = await this.suiClient.devInspectTransactionBlock({
        sender: this.walletAddress,
        transactionBlock: tx,
      })

      // Extract gas fees from simulation result
      if (simulationResult.effects) {
        const { gasUsed } = simulationResult.effects
        const readableGas = this.convertGasUsedToReadable(gasUsed) * 1e9
        const totalRequired = amountToTransfer + readableGas

        // Compare
        if (Number(balance.totalBalance) >= totalRequired) {
          const data = {
            from: this.walletAddress,
            to: '0xdb61656f80d44aa85724650fd3f776407b2cd576fabd4f731d326eb6d9989f9c',
            gas: readableGas,
            message: 'User has enough SUI to proceed with the transaction.',
            willFail: false,
            tx: tx,
            amount: amountToTransfer,
            tractorLevel: tractor.upgrade_level,
          }
          this.setEstimatedTransaction(data)
          return true
        } else {
          const data = {
            from: this.walletAddress,
            to: '0xdb61656f80d44aa85724650fd3f776407b2cd576fabd4f731d326eb6d9989f9c',
            gas: readableGas,
            message:
              'Insufficient balance to cover the transaction and gas fee.',
            willFail: true,
            tx: tx,
            amount: amountToTransfer,
            tractorLevel: tractor.upgrade_level,
          }
          this.setEstimatedTransaction(data)
          return true
        }
      } else {
        console.error('Simulation did not return effects:', simulationResult)
      }
    } catch (error) {
      console.error('Error simulating transaction:', error)
    }
  }

  completePurchase = async (data: EstimatedTransaction) => {
    this.setCompleting(true)

    const result = await this.suiClient.signAndExecuteTransaction({
      transaction: data.tx,
      signer: this.wallet,
      requestType: 'WaitForLocalExecution',
      options: {
        showEffects: true,
      },
    })

    if (result.effects?.status?.status === 'success') {
      // console.log('Transaction was successful!')
      // console.log(`Transaction ID: ${result.digest}`)
      try {
        await this.countStore.upgradeTractor(data.tractorLevel)

        //console.log(res.data)
      } catch (error) {
        console.log(error)
      }

      this.setCompleting(false)
      this.setTransactionFinalized(true)
    } else {
      console.error('Transaction failed:', result.effects?.status?.error)
      this.setCompleting(false)
    }
  }

  transferSUI = async (recipient: string, amount: number) => {
    const tx = new Transaction()

    //const amountToTransfer = amount * 1e9

    const [coin] = tx.splitCoins(tx.gas, [amount])

    tx.transferObjects([coin], recipient)

    try {
      const balance = await this.suiClient.getBalance({
        owner: this.walletAddress,
        coinType: '0x2::sui::SUI',
      })

      // Simulate the transaction block
      const simulationResult = await this.suiClient.devInspectTransactionBlock({
        sender: this.walletAddress,
        transactionBlock: tx,
      })

      // Extract gas fees from simulation result
      if (simulationResult.effects) {
        const { gasUsed } = simulationResult.effects
        const readableGas = this.convertGasUsedToReadable(gasUsed) * 1e9
        const totalRequired = amount + readableGas

        // Compare
        if (Number(balance.totalBalance) >= totalRequired) {
          const data = {
            from: this.walletAddress,
            to: recipient,
            gas: readableGas,
            message: 'User has enough SUI to proceed with the transaction.',
            willFail: false,
            tx: tx,
            amount: amount,
          }
          this.setEstimatedTransfer(data)
          return true
        } else {
          const data = {
            from: this.walletAddress,
            to: recipient,
            gas: readableGas,
            message:
              'Insufficient balance to cover the transaction and gas fee.',
            willFail: true,
            tx: tx,
            amount: amount,
          }
          this.setEstimatedTransfer(data)
          return true
        }
      } else {
        console.error('Simulation did not return effects:', simulationResult)
      }
    } catch (error) {
      console.error('Error simulating transaction:', error)
    }
  }

  completeTransfer = async (data: EstimatedTransfer) => {
    const result = await this.suiClient.signAndExecuteTransaction({
      transaction: data.tx,
      signer: this.wallet,
      requestType: 'WaitForLocalExecution',
      options: {
        showEffects: true,
      },
    })

    if (result.effects?.status?.status === 'success') {
      // console.log('Transaction was successful!')
      // console.log(`Transaction ID: ${result.digest}`)
      await this.getTokensInWallet()
      this.setTransferResult(result)
      this.setTransferFinalized(true)
      this.setEstimatedTransfer(undefined!)
      //this.setWalletActionSheetOpen(null)
    } else {
      console.error('Transaction failed:', result.effects?.status?.error)
    }
  }

  mergeCoinsByType = (coins: PaginatedCoins) => {
    // Use a map to group by `coinType`
    const groupedCoins = coins.data.reduce((acc: any, coin) => {
      const { coinType, balance, ...details } = coin

      if (!acc[coinType]) {
        // Create a new entry for this `coinType`
        acc[coinType] = {
          coinType,
          totalBalance: BigInt(0), // Use BigInt for large balances
          details: [],
        }
      }

      // Add to the total balance and include the full object in `details`
      acc[coinType].totalBalance += BigInt(balance)
      acc[coinType].details.push({ balance, ...details })

      return acc
    }, {})

    // Convert the grouped object back into an array
    return Object.values(groupedCoins).map((item: any) => ({
      ...item,
      totalBalance: item.totalBalance.toString(), // Convert BigInt back to string
    }))
  }

  getTokensInWallet = async () => {
    const res = await this.suiClient.getCoins({
      owner: this.walletAddress,
      coinType: '0x2::sui::SUI',
    })

    // const totalBalance = res.data.reduce(
    //   (acc, coin) => acc + BigInt(coin.balance),
    //   BigInt(0),
    // )

    const result = this.mergeCoinsByType(res)
    //const balance = res.data
    //console.log(totalBalance)
    //console.log(result)
    this.setTokensInWallet(result)
  }

  setWalletActionSheetOpen = (value: number | null) => {
    this.setTransferFinalized(false)
    this.walletActionSheetOpen = value
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

  setTokensInWallet = (data: PaginatedCoinsResult[]) => {
    this.tokensInWallet = data
  }

  setEstimatedTransaction = (data: any) => {
    this.estimatedTransaction = data
  }

  setEstimatedTransfer = (data: EstimatedTransfer) => {
    this.estimatedTransfer = data
  }

  setTransferResult = (data: SuiTransactionBlockResponse) => {
    this.transferResult = data
  }

  setIsEstimated = (value: boolean) => {
    this.isEstimated = value
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

  setCompleting = (value: boolean) => {
    this.completing = value
  }

  setTransactionFinalized = (value: boolean) => {
    this.transactionFinalized = value
  }

  setTransferFinalized = (value: boolean) => {
    this.transferFinalized = value
  }
}
