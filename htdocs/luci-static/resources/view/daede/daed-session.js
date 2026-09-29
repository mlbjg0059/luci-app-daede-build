// daed-session.js - 会话管理

export const SessionManager = {
  token: null,
  expiry: 0,

  async login(username, password) {
    try {
      const res = await fetch('/cgi-bin/luci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      })
      const text = await res.text()
      const match = text.match(/sysauth=([^;]+)/)
      if (match) {
        this.token = match[1]
        this.expiry = Date.now() + 3600000 // 1小时
        document.cookie = `sysauth=${this.token}; path=/; max-age=3600`
        return true
      }
      return false
    } catch (e) {
      console.error('Login failed:', e)
      return false
    }
  },

  logout() {
    this.token = null
    this.expiry = 0
    document.cookie = 'sysauth=; path=/; max-age=0'
  },

  isAuthenticated() {
    return this.token && Date.now() < this.expiry
  },

  getAuthHeader() {
    return this.token ? `sysauth=${this.token}` : ''
  }
}

export default SessionManager