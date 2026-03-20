<template>
  <div class="apikey-settings">
    <h3 class="section-title">API Key 管理</h3>

    <!-- 使用方法按钮 -->
    <button class="btn btn-secondary usage-btn" @click="showUsage = true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      使用方法
    </button>

    <!-- 使用方法弹窗 -->
    <Modal v-model="showUsage" title="API 使用方法" size="lg">
      <div class="usage-content">
        <div class="usage-section">
          <h4>接口地址</h4>
          <code class="code-block">POST {{ apiBaseUrl }}/api/photos/api-upload</code>
        </div>

        <div class="usage-section">
          <h4>请求头</h4>
          <code class="code-block">X-API-Key: 你的API密钥</code>
        </div>

        <div class="usage-section">
          <h4>请求体</h4>
          <p>使用 <code>multipart/form-data</code> 格式：</p>
          <ul>
            <li><code>photos</code> - 图片文件（支持多文件，最多20个，单个不超过10MB）</li>
            <li><code>tags</code> - 标签（可选，格式：<code>#标签1 #标签2</code>）</li>
          </ul>
          <p>支持的图片格式：JPEG、PNG、GIF、WebP</p>
        </div>

        <div class="usage-section">
          <h4>cURL 示例</h4>
          <div class="code-block-wrapper">
            <pre class="code-block">curl -X POST {{ apiBaseUrl }}/api/photos/api-upload \
  -H "X-API-Key: 你的API密钥" \
  -F "photos=@/path/to/photo.jpg" \
  -F "tags=#风景 #旅行"</pre>
            <button class="copy-code-btn" @click="copyCurlExample" title="复制">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        <div class="usage-section">
          <h4>Python 示例</h4>
          <div class="code-block-wrapper">
            <pre class="code-block">import requests

url = "{{ apiBaseUrl }}/api/photos/api-upload"
headers = {"X-API-Key": "你的API密钥"}
files = [("photos", open("photo.jpg", "rb"))]
data = {"tags": "#风景 #旅行"}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())</pre>
            <button class="copy-code-btn" @click="copyPythonExample" title="复制">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        <div class="usage-section">
          <h4>响应格式</h4>
          <pre class="code-block">{
  "success": true,
  "data": {
    "photos": [
      {
        "id": 1,
        "filename": "uuid.jpg",
        "url": "/uploads/photos/uuid.jpg",
        "thumbnailUrl": "/uploads/photos/thumb_uuid.jpg"
      }
    ]
  }
}</pre>
        </div>

        <div class="usage-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>注意：通过 API 上传的图片同样受审核限制。如果管理员开启了上传审核，图片需要审核通过后才会展示。</span>
        </div>
      </div>
    </Modal>

    <!-- 创建新密钥 -->
    <div class="create-section">
      <div class="create-form">
        <input
          v-model="newKeyName"
          type="text"
          class="form-input"
          placeholder="输入密钥名称（如：我的脚本）"
          maxlength="50"
          @keyup.enter="handleCreate"
        />
        <button class="btn btn-primary" :disabled="creating || !newKeyName.trim()" @click="handleCreate">
          {{ creating ? '创建中...' : '创建密钥' }}
        </button>
      </div>
    </div>

    <!-- 新创建的密钥展示（仅显示一次） -->
    <div v-if="newlyCreatedKey" class="new-key-alert">
      <div class="alert-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>请立即复制密钥，此密钥仅显示一次！</span>
      </div>
      <div class="key-display">
        <code class="key-value">{{ newlyCreatedKey }}</code>
        <button class="btn btn-sm btn-copy" @click="copyKey(newlyCreatedKey)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          复制
        </button>
      </div>
    </div>

    <!-- 密钥列表 -->
    <div class="keys-list">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="keys.length === 0" class="empty-state">
        <p>暂无 API 密钥</p>
      </div>
      <div v-else class="key-items">
        <div v-for="key in keys" :key="key.id" class="key-item">
          <div class="key-info">
            <span class="key-name">{{ key.name }}</span>
            <code class="key-prefix">{{ key.keyPrefix }}</code>
            <span class="key-meta">
              创建于 {{ formatDate(key.createdAt) }}
              <template v-if="key.lastUsedAt"> · 最后使用 {{ formatDate(key.lastUsedAt) }}</template>
            </span>
          </div>
          <button class="btn btn-sm btn-danger" @click="handleDelete(key)" :disabled="deleting === key.id">
            {{ deleting === key.id ? '删除中...' : '删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Modal from '../common/Modal.vue'
import apiKeysApi from '@/api/apiKeys'
import { useToast } from '@/composables/useToast'
import type { ApiKeyInfo } from '@/types'

const toast = useToast()

const keys = ref<ApiKeyInfo[]>([])
const loading = ref(false)
const creating = ref(false)
const deleting = ref<number | null>(null)
const newKeyName = ref('')
const newlyCreatedKey = ref<string | null>(null)
const showUsage = ref(false)

const apiBaseUrl = computed(() => {
  return window.location.origin
})

onMounted(() => {
  fetchKeys()
})

async function fetchKeys() {
  loading.value = true
  try {
    keys.value = await apiKeysApi.listApiKeys()
  } catch (error: any) {
    toast.error(error.error || '获取密钥列表失败')
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  const name = newKeyName.value.trim()
  if (!name) return

  creating.value = true
  try {
    const result = await apiKeysApi.createApiKey(name)
    newlyCreatedKey.value = result.rawKey || null
    newKeyName.value = ''
    await fetchKeys()
    toast.success('密钥创建成功')
  } catch (error: any) {
    toast.error(error.error || '创建密钥失败')
  } finally {
    creating.value = false
  }
}

async function handleDelete(key: ApiKeyInfo) {
  if (!confirm(`确定要删除密钥"${key.name}"吗？删除后无法恢复。`)) return

  deleting.value = key.id
  try {
    await apiKeysApi.deleteApiKey(key.id)
    keys.value = keys.value.filter(k => k.id !== key.id)
    toast.success('密钥已删除')
  } catch (error: any) {
    toast.error(error.error || '删除失败')
  } finally {
    deleting.value = null
  }
}

function copyKey(key: string) {
  navigator.clipboard.writeText(key).then(() => {
    toast.success('已复制到剪贴板')
  }).catch(() => {
    toast.error('复制失败，请手动复制')
  })
}

function copyCurlExample() {
  const text = `curl -X POST ${apiBaseUrl.value}/api/photos/api-upload \\
  -H "X-API-Key: 你的API密钥" \\
  -F "photos=@/path/to/photo.jpg" \\
  -F "tags=#风景 #旅行"`
  navigator.clipboard.writeText(text).then(() => {
    toast.success('已复制到剪贴板')
  }).catch(() => {
    toast.error('复制失败')
  })
}

function copyPythonExample() {
  const text = `import requests

url = "${apiBaseUrl.value}/api/photos/api-upload"
headers = {"X-API-Key": "你的API密钥"}
files = [("photos", open("photo.jpg", "rb"))]
data = {"tags": "#风景 #旅行"}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`
  navigator.clipboard.writeText(text).then(() => {
    toast.success('已复制到剪贴板')
  }).catch(() => {
    toast.error('复制失败')
  })
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return d.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.apikey-settings {
  max-width: 600px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.usage-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--spacing-lg);
}

/* Create section */
.create-section {
  margin-bottom: var(--spacing-lg);
}

.create-form {
  display: flex;
  gap: var(--spacing-sm);
}

.create-form .form-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.create-form .form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-transparent);
}

/* New key alert */
.new-key-alert {
  background: var(--color-bg-warning-light, #fff8e1);
  border: 1px solid var(--color-warning, #f9a825);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.alert-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-warning, #f57f17);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.key-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-bg-primary);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
}

.key-value {
  flex: 1;
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
  color: var(--color-text-primary);
}

/* Keys list */
.keys-list {
  display: flex;
  flex-direction: column;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
}

.key-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.key-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  gap: var(--spacing-md);
}

.key-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.key-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.key-prefix {
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.key-meta {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
}

/* Usage modal content */
.usage-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.usage-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.usage-section p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.usage-section ul {
  padding-left: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.usage-section ul li {
  margin-bottom: 4px;
}

.code-block-wrapper {
  position: relative;
}

.copy-code-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.75rem;
  transition: all var(--transition-fast);
}

.copy-code-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.code-block {
  display: block;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--color-text-primary);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

pre.code-block {
  white-space: pre;
  word-break: normal;
}

.usage-note {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.usage-note svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* Buttons */
.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.85rem;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-elevated);
}

.btn-danger {
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.btn-danger:hover {
  background: var(--color-bg-danger-light, rgba(255, 59, 48, 0.1));
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-copy:hover {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 767px) {
  .create-form {
    flex-direction: column;
  }
  
  .key-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .key-item .btn-danger {
    align-self: flex-end;
  }
}
</style>
