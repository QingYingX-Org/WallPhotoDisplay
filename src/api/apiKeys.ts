import request from '@/utils/request'
import type { ApiResponse, ApiKeyInfo } from '@/types'

export default {
  async listApiKeys(): Promise<ApiKeyInfo[]> {
    const res = await request.get('/api-keys') as unknown as ApiResponse<ApiKeyInfo[]>
    if (!res.data) throw new Error(res.error || 'Failed to list API keys')
    return res.data
  },

  async createApiKey(name: string): Promise<ApiKeyInfo> {
    const res = await request.post('/api-keys', { name }) as unknown as ApiResponse<ApiKeyInfo>
    if (!res.data) throw new Error(res.error || 'Failed to create API key')
    return res.data
  },

  async deleteApiKey(id: number): Promise<void> {
    await request.delete(`/api-keys/${id}`) as unknown as ApiResponse<{ id: number }>
  }
}
