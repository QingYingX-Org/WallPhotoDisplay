<template>
  <Modal
    v-model="isOpen"
    title="注册"
    :subtitle="step === 1 ? '创建新账号' : '验证邮箱'"
    size="sm"
    @close="handleClose"
  >
    <!-- Step 1: Fill registration form -->
    <form v-if="step === 1" class="register-form" @submit.prevent="handleSendCode">
      <!-- Username input -->
      <div class="form-group">
        <label for="register-username" class="form-label">用户名</label>
        <input
          id="register-username"
          v-model="form.username"
          type="text"
          class="form-input"
          placeholder="请输入用户名"
          autocomplete="username"
          :disabled="loading"
          required
          maxlength="20"
        />
        <span class="help-text">4-20个字符，字母、数字、下划线</span>
      </div>

      <!-- Email input -->
      <div class="form-group">
        <label for="register-email" class="form-label">邮箱</label>
        <input
          id="register-email"
          v-model="form.email"
          type="email"
          class="form-input"
          placeholder="请输入邮箱地址"
          autocomplete="email"
          :disabled="loading"
          required
        />
      </div>

      <!-- Password input -->
      <div class="form-group">
        <label for="register-password" class="form-label">密码</label>
        <div class="password-input-wrapper">
          <input
            id="register-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="请输入密码"
            autocomplete="new-password"
            :disabled="loading"
            required
            minlength="6"
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? '隐藏密码' : '显示密码'"
          >
            <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
        <span class="help-text">至少6个字符</span>
      </div>

      <!-- Confirm password input -->
      <div class="form-group">
        <label for="register-confirm-password" class="form-label">确认密码</label>
        <div class="password-input-wrapper">
          <input
            id="register-confirm-password"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="请再次输入密码"
            autocomplete="new-password"
            :disabled="loading"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="showConfirmPassword = !showConfirmPassword"
            :aria-label="showConfirmPassword ? '隐藏密码' : '显示密码'"
          >
            <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Captcha -->
      <CaptchaInput
        v-if="captchaEnabled"
        ref="captchaRef"
        :disabled="loading"
        :enabled="captchaEnabled"
        @update:captcha-id="captchaId = $event"
        @update:captcha-text="captchaText = $event"
      />

      <!-- Error message -->
      <Transition name="fade">
        <div v-if="error" class="form-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </Transition>
    </form>

    <!-- Step 2: Email verification code input -->
    <div v-else class="register-form">
      <p class="info-text">验证码已发送至 <strong>{{ form.email }}</strong></p>
      
      <div class="code-inputs" :class="{ 'shake': shake }">
        <input
          v-for="i in 6"
          :key="i"
          ref="codeInputs"
          v-model="verificationCode[i-1]"
          type="text"
          maxlength="1"
          class="code-input"
          :class="{ 'success': isCodeSuccess, 'error': isCodeError }"
          :disabled="loading"
          @input="handleCodeInput(i-1, $event)"
          @keydown.delete="handleCodeDelete(i-1, $event)"
          @paste="handleCodePaste"
        />
      </div>

      <div class="code-actions">
        <button 
          class="btn btn-text" 
          :disabled="timer > 0 || loading"
          @click="resendCode"
        >
          {{ timer > 0 ? `重新发送 (${timer}s)` : '重新发送' }}
        </button>
        <button class="btn btn-text" @click="backToStep1">修改信息</button>
      </div>

      <!-- Error message -->
      <Transition name="fade">
        <div v-if="error" class="form-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </Transition>

      <!-- Success message -->
      <Transition name="fade">
        <div v-if="success" class="form-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ success }}</span>
        </div>
      </Transition>
    </div>

    <!-- @vue-ignore -->
    <template #footer>
      <div class="dialog-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="handleClose"
          :disabled="loading"
        >
          取消
        </button>
        <button
          v-if="step === 1"
          type="submit"
          class="btn btn-primary"
          @click="handleSendCode"
          :disabled="loading || !isStep1Valid"
        >
          <span v-if="loading" class="btn-loading">
            <svg class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </span>
          <span>{{ loading ? '发送中...' : '发送验证码' }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import Modal from '../common/Modal.vue'
import CaptchaInput from '../common/CaptchaInput.vue'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import authApi from '@/api/auth'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const authStore = useAuthStore()
const configStore = useConfigStore()

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Local state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const step = ref(1)
const form = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const captchaId = ref('')
const captchaText = ref('')
const captchaRef = ref<InstanceType<typeof CaptchaInput> | null>(null)

// Step 2 state
const verificationCode = ref<string[]>(new Array(6).fill(''))
const codeInputs = ref<HTMLInputElement[]>([])
const timer = ref(0)
const shake = ref(false)
const isCodeSuccess = ref(false)
const isCodeError = ref(false)
let timerInterval: number | null = null

const captchaEnabled = computed(() => configStore.config?.enableCaptcha !== false)

// Step 1 form validation
const isStep1Valid = computed(() => {
  const usernameValid = form.value.username.trim().length >= 4 && 
                       form.value.username.trim().length <= 20 &&
                       /^[\w]+$/.test(form.value.username.trim())
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())
  const passwordValid = form.value.password.length >= 6
  const passwordsMatch = form.value.password === form.value.confirmPassword
  const captchaValid = captchaEnabled.value ? captchaText.value.trim() !== '' : true
  
  return usernameValid && emailValid && passwordValid && passwordsMatch && captchaValid
})

// Reset form when dialog opens
watch(isOpen, (newValue) => {
  if (newValue) {
    step.value = 1
    form.value = { username: '', email: '', password: '', confirmPassword: '' }
    showPassword.value = false
    showConfirmPassword.value = false
    error.value = ''
    success.value = ''
    captchaId.value = ''
    captchaText.value = ''
    verificationCode.value = new Array(6).fill('')
    isCodeSuccess.value = false
    isCodeError.value = false
    timer.value = 0
    if (timerInterval) clearInterval(timerInterval)
  }
})

// Handle close
function handleClose(): void {
  if (!loading.value) {
    isOpen.value = false
  }
}

function backToStep1(): void {
  step.value = 1
  error.value = ''
  verificationCode.value = new Array(6).fill('')
  isCodeSuccess.value = false
  isCodeError.value = false
}

function startTimer() {
  timer.value = 60
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = window.setInterval(() => {
    timer.value--
    if (timer.value <= 0 && timerInterval) {
      clearInterval(timerInterval)
    }
  }, 1000)
}

// Step 1: Validate form and send verification code
async function handleSendCode(): Promise<void> {
  if (!isStep1Valid.value || loading.value) return

  loading.value = true
  error.value = ''

  // Validate inputs
  const trimmedUsername = form.value.username.trim()
  if (trimmedUsername.length < 4) {
    error.value = '用户名至少需要4个字符'
    loading.value = false
    return
  }
  if (trimmedUsername.length > 20) {
    error.value = '用户名不能超过20个字符'
    loading.value = false
    return
  }
  if (!/^[\w]+$/.test(trimmedUsername)) {
    error.value = '用户名只能包含字母、数字和下划线'
    loading.value = false
    return
  }

  if (form.value.password.length < 6) {
    error.value = '密码至少需要6个字符'
    loading.value = false
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    loading.value = false
    return
  }

  try {
    const response = await authApi.sendVerificationCode(form.value.email.trim())
    
    if (response.success) {
      step.value = 2
      startTimer()
      nextTick(() => {
        codeInputs.value[0]?.focus()
      })
    } else {
      error.value = response.error || '发送验证码失败，请稍后重试'
      captchaRef.value?.reset()
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

async function resendCode(): Promise<void> {
  if (timer.value > 0 || loading.value) return
  loading.value = true
  error.value = ''
  
  try {
    const response = await authApi.sendVerificationCode(form.value.email.trim())
    if (response.success) {
      startTimer()
    } else {
      error.value = response.error || '发送验证码失败'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// Step 2: Submit registration with verification code
async function handleRegister(): Promise<void> {
  const fullCode = verificationCode.value.join('')
  if (fullCode.length !== 6 || loading.value) return

  loading.value = true
  error.value = ''
  isCodeError.value = false

  try {
    const result = await authStore.register({
      username: form.value.username.trim(),
      password: form.value.password,
      email: form.value.email.trim(),
      verificationCode: fullCode
    }, captchaEnabled.value ? captchaId.value : undefined,
       captchaEnabled.value ? captchaText.value : undefined)
    
    if (result.success) {
      isCodeSuccess.value = true
      success.value = '注册成功！正在跳转...'
      
      setTimeout(() => {
        emit('success')
        isOpen.value = false
      }, 1000)
    } else {
      isCodeError.value = true
      shake.value = true
      error.value = result.error || '注册失败，请稍后重试'
      setTimeout(() => {
        shake.value = false
        isCodeError.value = false
        verificationCode.value = new Array(6).fill('')
        codeInputs.value[0]?.focus()
      }, 1000)
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// Code input handlers
function handleCodeInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const cleanValue = input.value.replace(/\D/g, '').slice(-1)
  
  if (input.value !== cleanValue) {
    input.value = cleanValue
  }
  
  verificationCode.value[index] = cleanValue
  
  if (cleanValue && index < 5) {
    setTimeout(() => {
      const nextInput = codeInputs.value[index + 1]
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
    }, 10)
  } else if (cleanValue && index === 5) {
    setTimeout(() => handleRegister(), 10)
  }
}

function handleCodeDelete(index: number, event: KeyboardEvent) {
  if (!verificationCode.value[index] && index > 0) {
    event.preventDefault()
    setTimeout(() => {
      const prevInput = codeInputs.value[index - 1]
      if (prevInput) {
        prevInput.value = ''
        verificationCode.value[index - 1] = ''
        prevInput.focus()
      }
    }, 10)
  }
}

function handleCodePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  if (!pastedData) return

  const numbers = pastedData.replace(/\D/g, '').slice(0, 6)
  
  numbers.split('').forEach((num, i) => {
    if (codeInputs.value[i]) {
      codeInputs.value[i].value = num
      verificationCode.value[i] = num
    }
  })
  
  setTimeout(() => {
    if (numbers.length === 6) {
      handleRegister()
    } else if (numbers.length > 0) {
      const nextIndex = Math.min(numbers.length, 5)
      codeInputs.value[nextIndex]?.focus()
    }
  }, 10)
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  background-color: var(--color-bg-primary);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--color-text-placeholder);
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-text-primary);
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.help-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.form-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: rgba(255, 59, 48, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.form-error svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.form-success {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: rgba(52, 199, 89, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-success);
  font-size: var(--font-size-sm);
}

.form-success svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.info-text {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.code-inputs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.code-input {
  width: 3rem;
  height: 3.5rem;
  text-align: center;
  font-size: 1.5rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition: all 0.2s;
}

.code-input:focus {
  border-color: var(--color-accent);
  outline: none;
}

.code-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.code-input.success {
  border-color: var(--color-success);
  box-shadow: 0 0 10px rgba(52, 199, 89, 0.3);
}

.code-input.error {
  border-color: var(--color-error);
  box-shadow: 0 0 10px rgba(255, 59, 48, 0.3);
}

.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.code-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  padding: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.btn-text:disabled {
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-hover);
}

.btn-primary:active:not(:disabled) {
  background-color: var(--color-accent-active);
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-bg-tertiary);
}

.btn-loading .spinner {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

.btn-loading .spinner circle {
  stroke-dasharray: 60;
  stroke-dashoffset: 45;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
