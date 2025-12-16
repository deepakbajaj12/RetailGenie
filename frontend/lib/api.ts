import axios, { AxiosError } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({ baseURL })

function handleError(error: unknown): never {
  const err = error as AxiosError<{ message?: string }>
  const message = err.response?.data?.message || err.message || 'Request failed'
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

