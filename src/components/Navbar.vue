<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

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
  <nav class="flex justify-between items-center px-6 md:px-[80px] py-4 bg-white border-b border-[#e5e7eb] sticky top-0 z-[100] box-border">
    <div>
      <router-link :to="isPemilik ? '/dashboard' : '/'" class="flex items-center no-underline text-[22px] font-extrabold tracking-[-0.04em] text-[#111111] transition-opacity duration-150 ease-in-out hover:opacity-95">
        <span>Sewa<span class="text-[#ff385c]">Ki</span></span>
      </router-link>
    </div>
    
    <div class="flex items-center gap-4 sm:gap-[28px]">
      <!-- Guest Navigation Links -->
      <template v-if="!isAuthenticated">
        <router-link 
          to="/" 
          class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
          exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
        >
          Beranda
        </router-link>
        <router-link 
          to="/login" 
          class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
          exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
        >
          Masuk
        </router-link>
        <router-link 
          to="/register" 
          class="no-underline text-sm font-semibold bg-[#ff385c] text-white px-4 py-2 rounded-lg shadow-[0_2px_8px_rgba(255,56,92,0.15)] transition-all duration-150 ease-in-out hover:bg-[#e00b41] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
          exact-active-class="bg-[#ff385c] text-white"
        >
          Daftar
        </router-link>
      </template>
      
      <!-- Authenticated Navigation Links -->
      <template v-else>
        <!-- Admin Navigation Links -->
        <router-link 
          v-if="isAdmin" 
          to="/admin/dashboard" 
          class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
          exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
        >
          Admin Panel
        </router-link>

        <!-- Owner Navigation Links (Pemilik Barang) -->
        <template v-if="isPemilik">
          <router-link 
            to="/dashboard" 
            class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
            exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/tambah-barang" 
            class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
            exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
          >
            Tambah Barang
          </router-link>
          <router-link 
            to="/kelola" 
            class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
            exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
          >
            Kelola Pesanan
          </router-link>
        </template>

        <!-- Renter Navigation Links (Penyewa) -->
        <template v-else-if="!isAdmin">
          <router-link 
            to="/" 
            class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
            exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
          >
            Beranda
          </router-link>
          <router-link 
            to="/riwayat" 
            class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
            exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
          >
            Pesananku
          </router-link>
        </template>

        <!-- Shared Authenticated Items -->
        <router-link 
          to="/profile" 
          class="no-underline text-sm font-semibold text-[#6b7280] transition-all duration-150 ease-in-out relative py-[6px] hover:text-[#111111]"
          exact-active-class="text-[#111111] after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#ff385c] after:rounded-full"
        >
          Profil
        </router-link>
        
        <!-- Notification Bell & Dropdown -->
        <div class="notification-container relative flex items-center">
          <button @click.stop="toggleNotifications" class="bg-transparent border-none text-[#6b7280] cursor-pointer p-2 relative rounded-full flex items-center justify-center transition-all duration-150 ease-in-out hover:text-[#111111] hover:bg-[#f8f9fa]" aria-label="Notifikasi">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="unreadCount > 0" class="absolute top-[4px] right-[4px] bg-[#ff385c] text-white rounded-full px-[5px] py-[2px] text-[9px] font-bold leading-none min-w-[8px] text-center">{{ unreadCount }}</span>
          </button>
          
          <div v-if="showNotifications" class="absolute top-full right-0 mt-3 w-[320px] max-h-[420px] bg-white border border-[#e5e7eb] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col z-[1000] overflow-hidden">
            <div class="px-[18px] py-[14px] border-b border-[#e5e7eb] flex justify-between items-center">
              <h3 class="m-0 text-sm font-bold text-[#111111]">Notifikasi</h3>
              <button v-if="unreadCount > 0" @click="markAllAsRead" class="bg-transparent border-none text-[#ff385c] text-[11.5px] font-semibold cursor-pointer px-2 py-1 rounded transition-all duration-150 ease-in-out hover:bg-[rgba(255,56,92,0.06)]">Tandai semua dibaca</button>
            </div>
            <div class="overflow-y-auto flex-1 max-h-[320px]">
              <div v-if="notifications.length === 0" class="px-[18px] py-[36px] text-center text-[#6b7280] text-[13px]">
                Tidak ada notifikasi baru
              </div>
              <div v-else class="flex flex-col">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id" 
                  class="px-[18px] py-[14px] border-b border-[#f3f4f6] last:border-b-0 cursor-pointer transition-all duration-150 ease-in-out flex flex-col gap-1 text-left"
                  :class="notification.is_read ? 'hover:bg-[#f8f9fa]' : 'bg-[rgba(255,56,92,0.03)] hover:bg-[rgba(255,56,92,0.06)]'"
                  @click="markAsRead(notification.id)"
                >
                  <div class="flex justify-between items-start gap-2">
                    <span class="font-bold text-[13.5px] text-[#111111] leading-[1.3]">{{ notification.title }}</span>
                    <span v-if="!notification.is_read" class="w-1.5 h-1.5 bg-[#ff385c] rounded-full shrink-0 mt-[5px]"></span>
                  </div>
                  <p class="m-0 text-[12.5px] text-[#374151] leading-[1.4]">{{ notification.message }}</p>
                  <span class="text-[10.5px] text-[#6b7280] self-end mt-[1px]">{{ new Date(notification.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="handleLogout" class="bg-transparent text-[#6b7280] border border-[#e5e7eb] px-4 py-2 rounded-lg text-[13.5px] font-semibold cursor-pointer transition-all duration-150 ease-in-out hover:bg-[rgba(239,68,68,0.05)] hover:border-[rgba(239,68,68,0.2)] hover:text-[#ef4444] active:scale-[0.98]">Keluar</button>
      </template>
    </div>
  </nav>
</template>
