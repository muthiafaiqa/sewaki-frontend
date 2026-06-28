<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const isAuthenticated = authStore.isLoggedIn;
const isAdmin = authStore.isAdmin;
const isPemilik = authStore.isPemilik;

const notifications = ref([]);
const showNotifications = ref(false);
let fetchInterval = null;

const checkAuth = () => {
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

// Watch authentication status changes
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    fetchNotifications();
    startPolling();
  } else {
    stopPolling();
  }
}, { immediate: true });

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
  authStore.logout();
  stopPolling();
  router.push('/login');
};
</script>

<template>
  <header class="bg-white border-b border-[#e5e7eb] sticky top-0 z-[100] h-[64px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
      <div class="brand">
        <router-link :to="isPemilik ? '/dashboard' : '/'" class="text-[20px] font-bold text-[#111111] tracking-[-0.5px]">
          sewaki<span class="text-[#3b82f6]">.</span>
        </router-link>
      </div>

      <nav class="flex items-center gap-6">
        <!-- Guest Navigation Links -->
        <template v-if="!isAuthenticated">
          <router-link to="/" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Beranda</router-link>
          <router-link to="/login" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Masuk</router-link>
          <router-link to="/register" class="px-4 py-2 bg-[#111111] text-white rounded-md text-sm font-semibold">Daftar</router-link>
        </template>

        <!-- Authenticated Navigation Links -->
        <template v-else>
          <!-- Admin -->
          <router-link v-if="isAdmin" to="/admin/dashboard" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Admin</router-link>
          
          <!-- Owner (Pemilik Barang) -->
          <template v-if="isPemilik">
            <router-link to="/dashboard" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Dashboard</router-link>
            <router-link to="/tambah-barang" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Tambah Barang</router-link>
            <router-link to="/kelola" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Kelola Pesanan</router-link>
          </template>

          <!-- Renter (Penyewa) -->
          <template v-else-if="!isAdmin">
            <router-link to="/" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Beranda</router-link>
            <router-link to="/riwayat" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Pesananku</router-link>
          </template>

          <!-- Shared Links -->
          <router-link to="/profile" class="font-['Inter'] text-sm font-medium text-[#6b7280] transition-colors duration-150 ease-in-out py-1 relative hover:text-[#111111]" active-class="text-[#111111]">Profil</router-link>

          <!-- Notification Bell -->
          <div class="notification-container relative flex items-center">
            <button @click.stop="toggleNotifications" class="bg-transparent border-none text-[#6b7280] cursor-pointer p-1.5 flex items-center justify-center rounded-full hover:text-[#111111] hover:bg-[#f8f9fa]" aria-label="Notifikasi">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[20px] h-[20px]">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-bold px-[5px] py-[1px] rounded-full min-w-[16px] text-center">{{ unreadCount }}</span>
            </button>

            <!-- Dropdown -->
            <div v-if="showNotifications" class="absolute top-full right-0 mt-2 w-[320px] bg-white border border-[#e5e7eb] rounded-lg shadow-md z-[200] overflow-hidden">
              <div class="flex justify-between items-center p-4 border-b border-[#e5e7eb]">
                <h3 class="m-0 text-sm font-semibold text-[#111111]">Notifikasi</h3>
                <button v-if="unreadCount > 0" @click="markAllAsRead" class="bg-transparent border-none text-[#3b82f6] text-xs font-semibold cursor-pointer">Tandai semua dibaca</button>
              </div>
              <div class="max-h-[300px] overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-8 text-center text-[#6b7280] text-xs">
                  Tidak ada notifikasi baru
                </div>
                <div v-else class="flex flex-col">
                  <div 
                    v-for="notification in notifications" 
                    :key="notification.id" 
                    class="p-4 border-b border-[#f3f4f6] last:border-b-0 cursor-pointer text-left"
                    :class="{ 'bg-[#f8f9fa]': !notification.is_read }"
                    @click="markAsRead(notification.id)"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-semibold text-xs text-[#111111]">{{ notification.title }}</span>
                      <span v-if="!notification.is_read" class="w-1.5 h-1.5 bg-[#3b82f6] rounded-full"></span>
                    </div>
                    <p class="mt-1 mb-0 text-xs text-[#374151]">{{ notification.message }}</p>
                    <span class="block mt-1 text-[10px] text-[#898989]">{{ new Date(notification.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button @click="handleLogout" class="bg-transparent text-[#ef4444] border border-[rgba(239,68,68,0.2)] px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[rgba(239,68,68,0.05)]">Keluar</button>
        </template>
      </nav>
    </div>
  </header>
</template>
