<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const isAuthenticated = ref(false);
const isAdmin = ref(false);
const isPemilik = ref(false);

const notifications = ref([]);
const showNotifications = ref(false);
let fetchInterval = null;

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  isAdmin.value = role.toLowerCase() === 'admin';
  isPemilik.value = role.toLowerCase() === 'pemilik';
  if (isAuthenticated.value) {
    fetchNotifications();
    startPolling();
  } else {
    stopPolling();
  }
};

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length;
});

const fetchNotifications = async () => {
  if (!isAuthenticated.value) return;
  try {
    const response = await api.get('/api/notifications');
    if (response.data && response.data.success) {
      notifications.value = response.data.data || [];
    }
  } catch (error) {
    console.error('Gagal mengambil notifikasi:', error);
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    fetchNotifications();
  }
};

const markAsRead = async (id) => {
  try {
    await api.put(`/api/notifications/${id}/read`);
    fetchNotifications();
  } catch (error) {
    console.error('Gagal menandai notifikasi dibaca:', error);
  }
};

const markAllAsRead = async () => {
  try {
    await api.put('/api/notifications/read-all');
    fetchNotifications();
  } catch (error) {
    console.error('Gagal menandai semua notifikasi dibaca:', error);
  }
};

const startPolling = () => {
  if (!fetchInterval) {
    fetchInterval = setInterval(fetchNotifications, 15000); // Polling setiap 15 detik
  }
};

const stopPolling = () => {
  if (fetchInterval) {
    clearInterval(fetchInterval);
    fetchInterval = null;
  }
};

const closeNotifications = (e) => {
  if (!e.target.closest('.notification-container')) {
    showNotifications.value = false;
  }
};

// Re-check authentication status on route change
watch(() => route.path, () => {
  checkAuth();
  showNotifications.value = false;
}, { immediate: true });

onMounted(() => {
  document.addEventListener('click', closeNotifications);
});

onUnmounted(() => {
  document.removeEventListener('click', closeNotifications);
  stopPolling();
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('kyc_status');
  isAuthenticated.value = false;
  isAdmin.value = false;
  isPemilik.value = false;
  stopPolling();
  router.push('/login');
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo-link">
        <span>Sewa<span class="text-[#ff385c]">Ki</span></span>
      </router-link>
    </div>
    
    <div class="navbar-links">
      <router-link to="/" class="nav-item">Beranda</router-link>
      
      <!-- Guest Navigation Links -->
      <template v-if="!isAuthenticated">
        <router-link to="/login" class="nav-item">Masuk</router-link>
        <router-link to="/register" class="nav-item nav-btn">Daftar</router-link>
      </template>
      
      <!-- Authenticated Navigation Links -->
      <template v-else>
        <router-link v-if="isAdmin" to="/admin/dashboard" class="nav-item">Admin Panel</router-link>
        <router-link v-if="isPemilik" to="/dashboard" class="nav-item">Dashboard</router-link>
        <router-link v-if="isPemilik" to="/tambah-barang" class="nav-item">Tambah Barang</router-link>
        <router-link to="/riwayat" class="nav-item">Pesananku</router-link>
        <router-link v-if="isPemilik" to="/kelola" class="nav-item">Kelola Pesanan</router-link>
        <router-link to="/profile" class="nav-item">Profil</router-link>
        
        <!-- Notification Bell & Dropdown -->
        <div class="notification-container">
          <button @click.stop="toggleNotifications" class="notification-bell-btn" aria-label="Notifikasi">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bell-icon">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </button>
          
          <div v-if="showNotifications" class="notification-dropdown">
            <div class="dropdown-header">
              <h3>Notifikasi</h3>
              <button v-if="unreadCount > 0" @click="markAllAsRead" class="mark-all-btn">Tandai semua dibaca</button>
            </div>
            <div class="dropdown-body">
              <div v-if="notifications.length === 0" class="empty-state">
                Tidak ada notifikasi baru
              </div>
              <div v-else class="notification-list">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id" 
                  class="notification-item"
                  :class="{ 'unread': !notification.is_read }"
                  @click="markAsRead(notification.id)"
                >
                  <div class="notif-header">
                    <span class="notif-title">{{ notification.title }}</span>
                    <span v-if="!notification.is_read" class="unread-dot"></span>
                  </div>
                  <p class="notif-message">{{ notification.message }}</p>
                  <span class="notif-time">{{ new Date(notification.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="handleLogout" class="logout-nav-btn">Keluar</button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 80px;
  background: #ffffff;
  border-bottom: 1px solid var(--color-hairline);
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 24px;
  }
}

.navbar-brand .logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-ink);
  transition: opacity 0.15s ease;
  font-family: var(--font-sans);
}

.navbar-brand .logo-link:hover {
  opacity: 0.95;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

@media (max-width: 600px) {
  .navbar-links {
    gap: 16px;
  }
}

.nav-item {
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted);
  transition: all 0.15s ease;
  position: relative;
  padding: 6px 0;
  font-family: var(--font-sans);
}

.nav-item:hover {
  color: var(--color-ink);
}

/* Route active indicator (tiny dot centered below item) */
.nav-item.router-link-exact-active:not(.nav-btn) {
  color: var(--color-ink);
}

.nav-item.router-link-exact-active:not(.nav-btn)::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #ff385c;
  border-radius: 50%;
}

/* Button style for Register link */
.nav-btn {
  background: #ff385c;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 56, 92, 0.15);
  font-family: var(--font-sans);
}

.nav-btn:hover {
  background: #e00b41;
  transform: translateY(-1px);
}

.nav-btn:active {
  transform: translateY(0) scale(0.98);
}

.nav-btn.router-link-exact-active {
  background: #ff385c;
  color: #ffffff;
}

/* Logout Button */
.logout-nav-btn {
  background: transparent;
  color: var(--color-muted);
  border: 1px solid var(--color-hairline);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.logout-nav-btn:hover {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.logout-nav-btn:active {
  transform: scale(0.98);
}

/* Notification Styling */
.notification-container {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-bell-btn {
  background: transparent;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 8px;
  position: relative;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.notification-bell-btn:hover {
  color: var(--color-ink);
  background: var(--color-surface-soft);
}

.bell-icon {
  width: 18px;
  height: 18px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ff385c;
  color: white;
  border-radius: 9999px;
  padding: 2px 5px;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  min-width: 8px;
  text-align: center;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  width: 320px;
  max-height: 420px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-hairline);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.mark-all-btn {
  background: transparent;
  border: none;
  color: #ff385c;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.mark-all-btn:hover {
  background: rgba(255, 56, 92, 0.06);
}

.dropdown-body {
  overflow-y: auto;
  flex: 1;
  max-height: 320px;
}

.dropdown-body::-webkit-scrollbar {
  width: 6px;
}

.dropdown-body::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background: var(--color-hairline);
  border-radius: 3px;
}

.empty-state {
  padding: 36px 18px;
  text-align: center;
  color: var(--color-muted);
  font-size: 13px;
  font-family: var(--font-sans);
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-hairline-soft);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: var(--color-surface-soft);
}

.notification-item.unread {
  background: rgba(255, 56, 92, 0.03);
}

.notification-item.unread:hover {
  background: rgba(255, 56, 92, 0.06);
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.notif-title {
  font-weight: 700;
  font-size: 13.5px;
  color: var(--color-ink);
  line-height: 1.3;
  font-family: var(--font-sans);
}

.unread-dot {
  width: 6px;
  height: 6px;
  background: #ff385c;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.notif-message {
  margin: 0;
  font-size: 12.5px;
  color: var(--color-body);
  line-height: 1.4;
  font-family: var(--font-sans);
}

.notif-time {
  font-size: 10.5px;
  color: var(--color-muted);
  align-self: flex-end;
  margin-top: 1px;
  font-family: var(--font-sans);
}
</style>
