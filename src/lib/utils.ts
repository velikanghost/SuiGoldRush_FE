import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/telegramService.ts
class TelegramService {
  private static instance: TelegramService
  public WebApp: typeof window.Telegram.WebApp | null = null

  private constructor() {
    // Only assign if Telegram is available
    if (window.Telegram?.WebApp) {
      this.WebApp = window.Telegram.WebApp
    }
  }

  // Get instance to ensure singleton
  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService()
    }
    return TelegramService.instance
  }

  // Show popup with optional callback
  public showPopup(
    params: Parameters<typeof window.Telegram.WebApp.showPopup>[0],
    callback?: Parameters<typeof window.Telegram.WebApp.showPopup>[1],
  ) {
    if (!this.WebApp) {
      throw new Error('Telegram WebApp is not initialized.')
    }
    this.WebApp.showPopup(params, callback)
  }

  // Close the WebApp
  public closeWebApp() {
    this.WebApp?.close()
  }

  // Expand the WebApp to full screen
  public expandWebApp() {
    this.WebApp?.expand()
  }

  // Send data to Telegram
  public sendData(data: string) {
    this.WebApp?.sendData(data)
  }

  // Access theme parameters
  public getThemeParams() {
    return this.WebApp?.themeParams
  }

  // MainButton methods
  public showMainButton(text: string, color?: string, textColor?: string) {
    if (this.WebApp) {
      this.WebApp.MainButton.setText(text)
      if (color || textColor) {
        this.WebApp.MainButton.setParams({ color, textColor })
      }
      this.WebApp.MainButton.show()
    }
  }

  public hideMainButton() {
    this.WebApp?.MainButton.hide()
  }

  public onMainButtonClick(callback: () => void) {
    this.WebApp?.MainButton.onClick(callback)
  }

  public enableMainButton() {
    this.WebApp?.MainButton.enable()
  }

  public disableMainButton() {
    this.WebApp?.MainButton.disable()
  }

  // BackButton methods
  public showBackButton() {
    this.WebApp?.BackButton.show()
  }

  public hideBackButton() {
    this.WebApp?.BackButton.hide()
  }

  public onBackButtonClick(callback: () => void) {
    this.WebApp?.BackButton.onClick(callback)
  }

  // Haptic feedback methods
  public triggerImpactFeedback(
    style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
  ) {
    this.WebApp?.HapticFeedback.impactOccurred(style)
  }

  public triggerNotificationFeedback(type: 'error' | 'success' | 'warning') {
    this.WebApp?.HapticFeedback.notificationOccurred(type)
  }

  public triggerSelectionFeedback() {
    this.WebApp?.HapticFeedback.selectionChanged()
  }

  // Check if WebApp is expanded
  public isExpanded(): boolean {
    return this.WebApp?.isExpanded ?? false
  }

  // Get WebApp version
  public getWebAppVersion(): string {
    return this.WebApp?.version || 'unknown'
  }

  // Get viewport height
  public getViewportHeight(): number {
    return this.WebApp?.viewportHeight || 0
  }
}

// Export the singleton instance for use throughout your app
export default TelegramService.getInstance()
