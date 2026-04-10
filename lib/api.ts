const RAW_API_BASE_URL = "https://mobilewalletbackend.vercel.app/"

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "")

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${API_BASE_URL}${normalizedPath}`
}