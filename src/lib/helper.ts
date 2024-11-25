export const formatSUIBalance = (value: string) => {
  const number = Number(value)
  return number / 1_000_000_000
}

export const extractTokenName = (coinType: string): string => {
  const parts = coinType.split('::')
  return parts[parts.length - 1]
}

export const shortenAddress = (address: string): string => {
  const formatted = `${address?.substring(0, 8)}...${address?.substring(60)}`
  return formatted
}
