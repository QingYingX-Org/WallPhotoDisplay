import db from '../config/database.js'
import crypto from 'crypto'

interface ApiKeyRow {
  id: number
  userId: number
  keyPrefix: string
  name: string
  createdAt: string
  lastUsedAt: string | null
}

interface ApiKeyWithHash extends ApiKeyRow {
  keyHash: string
}

export interface ApiKeyPublic {
  id: number
  userId: number
  keyPrefix: string
  name: string
  createdAt: string
  lastUsedAt: string | null
}

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

const ApiKey = {
  /**
   * 创建新的 API Key
   * 返回包含原始密钥的对象（仅此一次可见）
   */
  create(userId: number, name: string): { apiKey: ApiKeyPublic; rawKey: string } {
    const rawKey = `pk_${crypto.randomBytes(24).toString('hex')}`
    const keyHash = hashKey(rawKey)
    const keyPrefix = rawKey.substring(0, 7) + '...' + rawKey.substring(rawKey.length - 4)

    const stmt = db.prepare(`
      INSERT INTO api_keys (user_id, key_hash, key_prefix, name)
      VALUES (?, ?, ?, ?)
    `)
    const result = stmt.run(userId, keyHash, keyPrefix, name)

    const apiKey: ApiKeyPublic = {
      id: result.lastInsertRowid as number,
      userId,
      keyPrefix,
      name,
      createdAt: new Date().toISOString(),
      lastUsedAt: null
    }

    return { apiKey, rawKey }
  },

  /**
   * 根据用户 ID 查找所有 API Key（不含 hash）
   */
  findByUserId(userId: number): ApiKeyPublic[] {
    const stmt = db.prepare(`
      SELECT id, user_id as userId, key_prefix as keyPrefix, name,
             created_at as createdAt, last_used_at as lastUsedAt
      FROM api_keys WHERE user_id = ?
      ORDER BY created_at DESC
    `)
    return stmt.all(userId) as ApiKeyPublic[]
  },

  /**
   * 通过原始 key 查找用户（用于认证）
   */
  findByRawKey(rawKey: string): ApiKeyWithHash | null {
    const keyHash = hashKey(rawKey)
    const stmt = db.prepare(`
      SELECT id, user_id as userId, key_hash as keyHash, key_prefix as keyPrefix, name,
             created_at as createdAt, last_used_at as lastUsedAt
      FROM api_keys WHERE key_hash = ?
    `)
    return (stmt.get(keyHash) as ApiKeyWithHash) || null
  },

  /**
   * 更新最后使用时间
   */
  updateLastUsed(id: number): void {
    db.prepare('UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?').run(id)
  },

  /**
   * 删除 API Key
   */
  delete(id: number, userId: number): boolean {
    const result = db.prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?').run(id, userId)
    return result.changes > 0
  },

  /**
   * 获取用户的 API Key 数量
   */
  countByUserId(userId: number): number {
    const row = db.prepare('SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?').get(userId) as { count: number }
    return row.count
  }
}

export default ApiKey
