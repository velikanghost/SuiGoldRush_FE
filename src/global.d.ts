declare global {
  interface Window {
    Telegram: {
      WebApp: {
        isExpanded: boolean
        initData: string
        initDataUnsafe: {
          user: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
          [key: string]: any
        }
        close: () => void
        expand: () => void
        sendData: (data: string) => void

        // Popup method
        showPopup: (
          params: {
            title?: string
            message: string
            buttons?: Array<{
              id: string
              type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
              text: string
            }>
          },
          callback?: (buttonId: string) => void,
        ) => void

        // Haptic feedback
        HapticFeedback: {
          impactOccurred: (
            style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
          ) => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }

        MainButton: {
          setText: (text: string) => void
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void // Accepts callback
          isVisible: boolean
          enable: () => void
          disable: () => void
          setParams: (params: { color?: string; textColor?: string }) => void
        }

        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void // Accepts callback
          isVisible: boolean
        }

        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }

        viewportHeight: number
        version: string
      }
    }
  }
}

export {}
