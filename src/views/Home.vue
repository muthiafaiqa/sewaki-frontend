<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { dummyItems } from '../data/dummyData';

const router = useRouter();

const items = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const currentPage = ref(1);
const itemsPerPage = 24;

const formatPrice = (value) => {
  if (!value && value !== 0) return 'Hubungi Pemilik';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const searchQuery = ref('');
let searchTimeout = null;

const fetchItems = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.get('/api/items');
    const data = response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) {
      items.value = data;
    } else {
      console.warn('API returned empty items, using dummy data fallback.');
      items.value = dummyItems;
    }
  } catch (error) {
    console.warn('Fetch items error, falling back to dummy data:', error);
    items.value = dummyItems;
  } finally {
    isLoading.value = false;
  }
};

const filteredItems = computed(() => {
  let result = items.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      (item.nama_barang || item.name || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q)
    );
  }
  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage) || 1;
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
};

const handleSearch = (event) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (event && event.key === 'Enter') {
    currentPage.value = 1;
  } else {
    searchTimeout = setTimeout(() => {
      currentPage.value = 1;
    }, 300);
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const currentUser = ref(null);

onMounted(() => {
  fetchItems();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token) {
    currentUser.value = {
      token,
      role: role ? role.toLowerCase() : 'user'
    };
  }
});

const getImageUrl = (filename) => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
};

const handleDelete = async (itemId) => {
  if (!confirm('Apakah Anda yakin ingin menghapus barang ini?')) return;
  
  try {
    await api.delete(`/api/items/${itemId}`);
    items.value = items.value.filter(item => item.id !== itemId);
    await fetchItems();
  } catch (error) {
    console.error('Delete item error:', error);
    alert(error.response?.data?.message || 'Gagal menghapus barang.');
  }
};

const navigateToDetail = (itemId) => {
  router.push(`/katalog/${itemId}`);
};
</script>

<template>
  <div class="home-container">
    <!-- Hero Header -->
    <header class="hero-section">
      <h1 class="hero-title">Temukan barang sewa terbaik di Makassar</h1>
      <p class="hero-subtitle">Mulai dari kamera, peralatan outdoor, drone, hingga keperluan acara dengan harga terbaik.</p>
    </header>

    <!-- Search Bar Section -->
    <div class="search-section">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          @keydown.enter="handleSearch" 
          placeholder="Cari kamera, tenda, perlengkapan outdoor..." 
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn" title="Hapus pencarian">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="clear-icon">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- State: Loading -->
    <div v-if="isLoading" class="status-wrapper">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <p class="status-text">Memuat daftar barang...</p>
    </div>

    <!-- State: Error -->
    <div v-else-if="errorMessage" class="status-wrapper error-wrapper">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Gagal Memuat Data</h3>
      <p class="status-subtext">{{ errorMessage }}</p>
      <button @click="fetchItems" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- State: Empty Catalog -->
    <div v-else-if="filteredItems.length === 0" class="status-wrapper empty-wrapper">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </div>
      <h3>Tidak Ada Barang Ditemukan</h3>
      <p class="status-subtext">Coba kata kunci pencarian yang lain atau periksa kembali nanti.</p>
    </div>

    <!-- State: Catalog Grid Loaded -->
    <div v-else class="catalog-section">
      <h2 class="section-title">Katalog Barang Sewa</h2>
      <div class="items-grid">
        <div 
          v-for="item in paginatedItems" 
          :key="item.id" 
          class="item-card" 
          @click="navigateToDetail(item.id)"
        >
          <!-- Card Image Wrapper -->
          <div class="card-image-wrapper">
            <img 
              v-if="item.foto_barang"
              :src="getImageUrl(item.foto_barang)" 
              :alt="item.nama_barang || item.name" 
              class="item-image"
              loading="lazy"
            />
            <div v-else class="card-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="box-icon">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            
            <span class="category-tag">{{ item.category || 'Barang Sewa' }}</span>

            <!-- Admin Delete Button Overlay -->
            <button 
              v-if="currentUser?.role === 'admin'" 
              @click.stop="handleDelete(item.id)" 
              class="admin-delete-btn"
              title="Hapus Barang"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trash-icon">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <h3 class="item-title">{{ item.nama_barang || item.name }}</h3>
            
            <div class="item-info">
              <!-- Location Row -->
              <div class="info-row">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span class="info-text">{{ item.lokasi || item.location || 'Makassar' }}</span>
              </div>
              
              <!-- Description Row -->
              <div v-if="item.deskripsi || item.description" class="info-row description-row">
                <p class="description-text">{{ item.deskripsi || item.description }}</p>
              </div>
            </div>
            
            <div class="price-row">
              <span class="price-value">{{ formatPrice(item.harga_sewa_per_hari !== undefined ? item.harga_sewa_per_hari : item.price) }}</span>
              <span class="price-period">/ hari</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Sebelumnya</button>
        <span class="pagination-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Selanjutnya</button>
      </div>
    </div>
  </div>
</template>

<style src="./Home.css" scoped></style>
