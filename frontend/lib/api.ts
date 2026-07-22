import axios, { AxiosError } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({ baseURL })

// Attach the JWT token from localStorage to every outgoing request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  return config
})

function handleError(error: unknown): never {
  const err = error as AxiosError<{ message?: string; error?: string }>
  const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Request failed'
  throw new Error(message)
}

export type Product = {
  id?: string
  name: string
  price: number
  category?: string
  description?: string
  image_url?: string
  in_stock?: boolean
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await api.get('/api/products')
    if (res.data && Array.isArray(res.data.products)) {
      return res.data.products
    }
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    handleError(error)
  }
}

export async function createProduct(input: Product): Promise<Product> {
  try {
    const res = await api.post('/api/products', input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product> {
  try {
    const res = await api.put(`/api/products/${id}`, input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/api/products/${id}`)
  } catch (error) {
    handleError(error)
  }
}

export type SummarizeFeedbackInput = { feedback?: string; product_id?: string }
export type SummarizeFeedbackOutput = { summary: string; average_rating?: number; total_reviews?: number }

export async function aiSummarizeFeedback(body: SummarizeFeedbackInput): Promise<SummarizeFeedbackOutput> {
  try {
    const res = await api.post('/ai/summarize-feedback', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type GenerateDescriptionInput = { name: string; category?: string; features?: string[]; tone?: 'friendly' | 'formal' | 'playful' }
export type GenerateDescriptionOutput = { description: string }

export async function aiGenerateDescription(body: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  try {
    const res = await api.post('/ai/generate-description', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type SemanticSearchInput = { query: string; top_k?: number }
export type SemanticSearchOutput = { results: Array<{ id: string; score: number; name?: string; description?: string; category?: string }> }

export async function aiSemanticSearch(body: SemanticSearchInput): Promise<SemanticSearchOutput> {
  try {
    const res = await api.post('/ai/semantic-search', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type RecommendationsInput = { product_id?: string; category?: string; top_k?: number }
export type RecommendationsOutput = { results: Array<{ id: string; score: number; name?: string; description?: string; category?: string }> }

export async function aiRecommendations(body: RecommendationsInput): Promise<RecommendationsOutput> {
  try {
    const res = await api.post('/ai/recommendations', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type InsightsInput = { timeframe?: 'daily' | 'weekly' | 'monthly' }
export type InsightsOutput = { insights: string }

export async function aiInsights(body: InsightsInput): Promise<InsightsOutput> {
  try {
    const res = await api.post('/ai/insights', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type OrderItem = {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export type Order = {
  id?: string
  customer_name: string
  total_amount: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: OrderItem[]
  created_at?: string
}

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await api.get('/api/orders')
    if (res.data && Array.isArray(res.data.orders)) {
      return res.data.orders
    }
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    handleError(error)
  }
}

export async function createOrder(input: Order): Promise<Order> {
  try {
    const res = await api.post('/api/orders', input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function updateOrder(id: string, input: Partial<Order>): Promise<Order> {
  try {
    const res = await api.put(`/api/orders/${id}`, input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await api.delete(`/api/orders/${id}`)
  } catch (error) {
    handleError(error)
  }
}

export type User = {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export type AuthResponse = {
  message: string
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await api.post('/api/auth/login', { email, password })
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const res = await api.post('/api/auth/register', { email, password, name })
    return res.data
  } catch (error) {
    handleError(error)
  }
}


// --- Safety & Sensory Module APIs ---

export type BiometricVerificationInput = {
  type: 'face' | 'palm'
  imageData: string // base64 encoded image
}

export type BiometricVerificationOutput = {
  verified: boolean
  userId?: string
  confidence: number
  message?: string
}

export async function verifyBiometric(body: BiometricVerificationInput): Promise<BiometricVerificationOutput> {
  try {
    const res = await api.post('/api/safety/biometric-verify', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type SentimentData = {
  overall_score: number // -1.0 to 1.0
  mood: 'Happy' | 'Neutral' | 'Unhappy' | 'Angry'
  active_shoppers: number
  timestamp: string
}

export async function getStoreSentiment(): Promise<SentimentData> {
  try {
    const res = await api.get('/api/safety/sentiment')
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type EmergencyAlert = {
  type: 'Fire' | 'Medical' | 'Security' | 'Other'
  location: string
  details?: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
}

export async function triggerEmergencyAlert(body: EmergencyAlert): Promise<{ status: string; alert_id: string }> {
  try {
    const res = await api.post('/api/safety/emergency', body)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export type ColdChainMetric = {
  id: string
  zone: string
  temperature: number
  humidity: number
  status: 'Normal' | 'Warning' | 'Critical'
  last_updated: string
}

export async function getColdChainMetrics(): Promise<ColdChainMetric[]> {
  try {
    const res = await api.get('/api/safety/cold-chain')
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    handleError(error)
  }
}

export type WasteMetric = {
  id: string
  category: 'Recyclable' | 'Compost' | 'Landfill'
  weight_kg: number
  fill_level: number // 0-100
  location: string
}

export async function getWasteMetrics(): Promise<WasteMetric[]> {
  try {
    const res = await api.get('/api/safety/waste')
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    handleError(error)
  }
}

// --- Supplier Management ---

export type Supplier = {
  id?: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  status?: 'Active' | 'Inactive'
  rating?: number
  category?: string
}

export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const res = await api.get('/api/suppliers')
    return Array.isArray(res.data.suppliers) ? res.data.suppliers : (Array.isArray(res.data) ? res.data : [])
  } catch (error) {
    handleError(error)
  }
}

export async function createSupplier(input: Supplier): Promise<Supplier> {
  try {
    const res = await api.post('/api/suppliers', input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function updateSupplier(id: string, input: Partial<Supplier>): Promise<Supplier> {
  try {
    const res = await api.put(`/api/suppliers/${id}`, input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    await api.delete(`/api/suppliers/${id}`)
  } catch (error) {
    handleError(error)
  }
}

// --- Settings ---

export type UserSettings = {
  id?: string
  darkMode?: boolean
  emailNotifications?: boolean
  pushNotifications?: boolean
  smsNotifications?: boolean
  currency?: string
  language?: string
  lowStockThreshold?: number
  theme?: string
  storeName?: string
}

export async function getSettings(): Promise<UserSettings> {
  try {
    const res = await api.get('/api/settings')
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function updateSettings(input: Partial<UserSettings>): Promise<UserSettings> {
  try {
    const res = await api.put('/api/settings', input)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

// --- Notifications ---
// Named 'AppNotification' to avoid conflict with browser's built-in Notification API
export type AppNotification = {
  id?: string
  user_id?: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at?: string
}

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const res = await api.get('/api/notifications')
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    handleError(error)
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await api.put(`/api/notifications/${id}/read`)
  } catch (error) {
    handleError(error)
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await api.delete(`/api/notifications/${id}`)
  } catch (error) {
    handleError(error)
  }
}

// --- Inventory Intelligence ---

export type StockAlert = {
  product_id: string
  product_name: string
  current_stock: number
  threshold: number
  severity: 'low' | 'critical'
}

export async function getInventoryStockAlerts(): Promise<StockAlert[]> {
  try {
    const res = await api.get('/api/inventory/stock-alerts')
    return Array.isArray(res.data.alerts) ? res.data.alerts : []
  } catch (error) {
    handleError(error)
  }
}

export async function optimizeInventory(): Promise<{ recommendations: string[] }> {
  try {
    const res = await api.post('/api/inventory/optimization')
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function getInventoryForecast(): Promise<{ forecast: Record<string, number> }> {
  try {
    const res = await api.get('/api/inventory/forecast')
    return res.data
  } catch (error) {
    handleError(error)
  }
}

// --- Pricing Engine ---

export async function optimizePricing(productIds: string[]): Promise<{ recommendations: Record<string, number> }> {
  try {
    const res = await api.post('/api/pricing/optimize', { product_ids: productIds })
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function getCompetitorAnalysis(productId: string): Promise<{ competitor_prices: Record<string, number> }> {
  try {
    const res = await api.get(`/api/pricing/competitor-analysis?product_id=${productId}`)
    return res.data
  } catch (error) {
    handleError(error)
  }
}

export async function getDemandBasedPricing(productId: string): Promise<{ recommended_price: number; demand_score: number }> {
  try {
    const res = await api.post('/api/pricing/demand-based', { product_id: productId })
    return res.data
  } catch (error) {
    handleError(error)
  }
}
