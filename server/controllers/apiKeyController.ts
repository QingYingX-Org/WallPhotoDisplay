import type { Response } from 'express'
import type { AuthenticatedRequest } from '../types/index.js'
import ApiKey from '../models/ApiKey.js'

const MAX_API_KEYS_PER_USER = 5

/**
 * 获取当前用户的 API Key 列表
 * GET /api/api-keys
 */
export async function listApiKeys(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' })
      return
    }
    const keys = ApiKey.findByUserId(req.user.id)
    res.json({ success: true, data: keys })
  } catch (error) {
    console.error('List API keys error:', error)
    res.status(500).json({ success: false, error: 'Failed to list API keys' })
  }
}

/**
 * 创建新的 API Key
 * POST /api/api-keys
 */
export async function createApiKey(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' })
      return
    }

    const { name } = req.body as { name?: string }
    if (!name || name.trim().length === 0) {
      res.status(400).json({ success: false, error: '请输入密钥名称' })
      return
    }

    if (name.trim().length > 50) {
      res.status(400).json({ success: false, error: '密钥名称不能超过50个字符' })
      return
    }

    // 限制每个用户的 API Key 数量
    const count = ApiKey.countByUserId(req.user.id)
    if (count >= MAX_API_KEYS_PER_USER) {
      res.status(400).json({ success: false, error: `每个用户最多创建 ${MAX_API_KEYS_PER_USER} 个 API Key` })
      return
    }

    const { apiKey, rawKey } = ApiKey.create(req.user.id, name.trim())
    res.status(201).json({
      success: true,
      data: { ...apiKey, rawKey }
    })
  } catch (error) {
    console.error('Create API key error:', error)
    res.status(500).json({ success: false, error: 'Failed to create API key' })
  }
}

/**
 * 删除 API Key
 * DELETE /api/api-keys/:id
 */
export async function deleteApiKey(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' })
      return
    }

    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid API key ID' })
      return
    }

    const deleted = ApiKey.delete(id, req.user.id)
    if (!deleted) {
      res.status(404).json({ success: false, error: 'API key not found' })
      return
    }

    res.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Delete API key error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete API key' })
  }
}
