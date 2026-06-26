<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';

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
    fetchInterval = setInterval(fetchNotifications, 15000);
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
  <header class="top-nav-container">
    <div class="container top-nav-inner">
      <div class="brand">
        <router-link to="/" class="logo">
          sewaki<span class="logo-dot">.</span>
        </router-link>
      </div>

      <nav class="nav-links">
        <router-link to="/" class="nav-item">Beranda</router-link>

        <template v-if="!isAuthenticated">
          <router-link to="/login" class="nav-item">Masuk</router-link>
          <router-link to="/register" class="btn-nav">Daftar</router-link>
        </template>

        <template v-else>
          <router-link v-if="isAdmin" to="/admin/dashboard" class="nav-item">Admin</router-link>
          <router-link v-if="isPemilik" to="/dashboard" class="nav-item">Dashboard</router-link>
          <router-link v-if="isPemilik" to="/tambah-barang" class="nav-item">Tambah</router-link>
          <router-link to="/riwayat" class="nav-item">Pesananku</router-link>
          <router-link v-if="isPemilik" to="/kelola" class="nav-item">Kelola</router-link>
          <router-link to="/profile" class="nav-item">Profil</router-link>

          <!-- Notification Bell -->
          <div class="notification-container">
            <button @click.stop="toggleNotifications" class="bell-btn" aria-label="Notifikasi">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bell-icon">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span v-if="unreadCount > 0" class="badge-count">{{ unreadCount }}</span>
            </button>

            <!-- Dropdown -->
            <div v-if="showNotifications" class="dropdown-panel">
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

          <button @click="handleLogout" class="btn-logout">Keluar</button>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.top-nav-container {
  background-color: var(--color-canvas);
  border-bottom: 1px solid var(--color-hairline);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
}

.top-nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.5px;
}

.logo-dot {
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-item {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-muted);
  transition: color 0.15s ease;
  position: relative;
  padding: 4px 0;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-ink);
}

.btn-nav {
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--rounded-md);
  font-size: 14px;
  font-weight: 600;
}

.btn-logout {
  background: transparent;
  color: var(--color-error);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 6px 12px;
  border-radius: var(--rounded-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-logout:hover {
  background-color: rgba(239, 68, 68, 0.05);
}

.notification-container {
  position: relative;
}

.bell-btn {
  background: transparent;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--rounded-full);
}

.bell-btn:hover {
  color: var(--color-ink);
  background-color: var(--color-surface-soft);
}

.bell-icon {
  width: 20px;
  height: 20px;
}

.badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-error);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: var(--rounded-pill);
  min-width: 16px;
  text-align: center;
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  width: 320px;
  background-color: var(--color-canvas);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-md);
  z-index: 200;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-hairline);
}

.dropdown-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.mark-all-btn {
  background: transparent;
  border: none;
  color: var(--color-brand-accent);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.dropdown-body {
  max-height: 300px;
  overflow-y: auto;
}

.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-muted);
  font-size: 13px;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-hairline-soft);
  cursor: pointer;
  text-align: left;
}

.notification-item.unread {
  background-color: var(--color-surface-soft);
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--color-ink);
}

.unread-dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-brand-accent);
  border-radius: var(--rounded-full);
}

.notif-message {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-body);
}

.notif-time {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  color: var(--color-muted-soft);
}
</style>
