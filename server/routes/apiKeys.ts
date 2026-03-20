import express from 'express'
import { listApiKeys, createApiKey, deleteApiKey } from '../controllers/apiKeyController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

/**
 * @route GET /api/api-keys
 * @desc 获取当前用户的 API Key 列表
 * @access Protected
 */
router.get('/', authMiddleware, listApiKeys)

/**
 * @route POST /api/api-keys
 * @desc 创建新的 API Key
 * @access Protected
 */
router.post('/', authMiddleware, createApiKey)

/**
 * @route DELETE /api/api-keys/:id
 * @desc 删除 API Key
 * @access Protected
 */
router.delete('/:id', authMiddleware, deleteApiKey)

export default router
