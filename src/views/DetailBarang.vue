<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

const item = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

// Modal & Form State
const showModal = ref(false);
const isSubmitting = ref(false);

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const startDate = ref(todayStr);
const endDate = ref(tomorrowStr);

const itemId = route.params.id;

// Bank details for deposit refund
const bankDeposit = ref('BCA');
const rekeningDeposit = ref('');
const namaRekeningDeposit = ref('');

const formatPrice = (value) => {
  if (!value && value !== 0) return 'Hubungi Pemilik';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const getImageUrl = (filename) => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
};

const fetchItemDetails = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.get(`/api/items/${itemId}`);
    item.value = response.data?.data || response.data;
  } catch (error) {
    console.error('Fetch item details error:', error);
    errorMessage.value = error.response?.data?.message || 'Gagal memuat rincian barang sewa.';
  } finally {
    isLoading.value = false;
  }
};

const reviews = ref([]);

const fetchReviews = async () => {
  try {
    const response = await api.get(`/api/reviews/${itemId}`);
    reviews.value = response.data?.data || [];
  } catch (error) {
    console.error('Fetch reviews error:', error);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(() => {
  fetchItemDetails();
  fetchReviews();
});

// Computed Properties for Receipt
const pricePerDay = computed(() => {
  if (!item.value) return 0;
  return item.value.harga_sewa_per_hari !== undefined ? item.value.harga_sewa_per_hari : (item.value.price || 0);
});

const depositAmount = computed(() => {
  if (!item.value) return 0;
  return item.value.deposit !== undefined ? item.value.deposit : 0;
});

const durationDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0;
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const diffTime = end - start;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const totalRent = computed(() => {
  return pricePerDay.value * durationDays.value;
});

const adminFee = ref(10000); // Biaya Admin

const grandTotal = computed(() => {
  if (durationDays.value <= 0) return 0;
  return totalRent.value + depositAmount.value + adminFee.value;
});

// Trigger Modal open on Sewa Sekarang
const handleRentTrigger = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitTransaction = async () => {
  if (durationDays.value <= 0) return;

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  const kycStatus = localStorage.getItem('kyc_status') || 'unverified';
  if (kycStatus.toLowerCase() !== 'verified') {
    alert('Anda harus mengunggah KTP dan menunggu persetujuan Admin sebelum dapat melanjutkan');
    router.push('/profile');
    return;
  }

  if (!bankDeposit.value || !rekeningDeposit.value || !namaRekeningDeposit.value) {
    alert('Mohon lengkapi data rekening bank untuk keperluan pengembalian jaminan deposit.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      item_id: item.value.id,
      tanggal_mulai: new Date(startDate.value).toISOString(),
      tanggal_selesai: new Date(endDate.value).toISOString(),
      total_harga: totalRent.value,
      jaminan_deposit: depositAmount.value,
      biaya_admin: adminFee.value,
      bank_deposit: bankDeposit.value,
      rekening_deposit: rekeningDeposit.value,
      nama_rekening_deposit: namaRekeningDeposit.value
    };

    const response = await api.post('/api/transactions', payload);
    const invoiceUrl = response.data?.invoice_url;
    if (invoiceUrl) {
      window.location.href = invoiceUrl;
    } else {
      alert('Gagal mendapatkan URL pembayaran dari server.');
    }
  } catch (error) {
    console.error('Submit transaction error:', error);
    alert(error.response?.data?.message || 'Gagal memproses transaksi sewa.');
  } finally {
    isSubmitting.value = false;
  }
};

const hubungiPemilik = () => {
  if (!item.value) return;
  const pemilik = item.value.Pemilik || item.value.pemilik || item.value.User || item.value.user;
  const targetNomor = pemilik?.nomor_hp || pemilik?.phone || item.value.nomor_hp || item.value.phone;
  if (!targetNomor) {
    alert('Nomor WhatsApp pemilik tidak ditemukan.');
    return;
  }
  let formattedNumber = String(targetNomor).trim();
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '62' + formattedNumber.slice(1);
  }
  const namaBarang = item.value.nama_barang || item.value.name || 'Barang';
  const teks = `Halo, saya melihat barang ${namaBarang} di Sewaki. Apakah barang ini masih tersedia?`;
  window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(teks)}`, '_blank');
};
</script>

<template>
  <div class="detail-container">
    <!-- Back Navigation -->
    <div class="back-nav">
      <router-link to="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Katalog
      </router-link>
    </div>

    <!-- State: Loading -->
    <div v-if="isLoading" class="status-wrapper">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <p>Memuat rincian barang...</p>
    </div>

    <!-- State: Error -->
    <div v-else-if="errorMessage || !item" class="status-wrapper error-wrapper">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Gagal Memuat Rincian</h3>
      <p>{{ errorMessage || 'Barang tidak ditemukan' }}</p>
      <button @click="fetchItemDetails" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- State: Success / Content -->
    <div v-else class="detail-card">
      <div class="detail-grid">
        <!-- Left Column: Image Area -->
        <div class="image-column">
          <div class="detail-image-wrapper">
            <img 
              v-if="item.foto_barang"
              :src="getImageUrl(item.foto_barang)" 
              :alt="item.nama_barang || item.name" 
              class="detail-image"
            />
            <div v-else class="detail-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="box-icon-large">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span>Belum Ada Foto</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Info & Action Area -->
        <div class="info-column">
          <div class="category-badge">{{ item.category || 'Barang Sewa' }}</div>
          <h1 class="item-title">{{ item.nama_barang || item.name }}</h1>
          
          <div class="price-section">
            <span class="price-value">{{ formatPrice(item.harga_sewa_per_hari !== undefined ? item.harga_sewa_per_hari : item.price) }}</span>
            <span class="price-period">/ hari</span>
          </div>

          <hr class="divider" />

          <div class="meta-section">
            <!-- Location Row -->
            <div class="meta-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="meta-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div class="meta-content">
                <span class="meta-label">Lokasi Pengambilan</span>
                <span class="meta-text">{{ item.lokasi || item.location || 'Lokasi tidak ditentukan' }}</span>
              </div>
            </div>

            <!-- Stock Row -->
            <div class="meta-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="meta-icon">
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
              </svg>
              <div class="meta-content">
                <span class="meta-label">Stok Tersedia</span>
                <span class="meta-text">{{ item.stok !== undefined ? item.stok : (item.stock || 1) }} unit</span>
              </div>
            </div>

            <!-- Deposit Row -->
            <div class="meta-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="meta-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              <div class="meta-content">
                <span class="meta-label">Uang Jaminan / Deposit</span>
                <span class="meta-text">{{ formatPrice(item.deposit) }}</span>
              </div>
            </div>
          </div>

          <hr class="divider" />

          <!-- Description Section -->
          <div class="description-section">
            <h2>Deskripsi Barang</h2>
            <p>{{ item.deskripsi || item.description || 'Tidak ada deskripsi untuk barang ini.' }}</p>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-section">
            <h2>Ulasan Penyewa</h2>
            <div v-if="reviews.length === 0" class="no-reviews">
              Belum ada ulasan untuk barang ini.
            </div>
            <div v-else class="reviews-list">
              <div v-for="rev in reviews" :key="rev.id" class="review-card-item">
                <div class="review-header">
                  <span class="reviewer-name">Penyewa #{{ rev.penyewa_id.slice(0, 8) }}</span>
                  <div class="review-rating">
                    <span v-for="star in 5" :key="star" class="star-display" :class="{ filled: star <= rev.rating }">★</span>
                  </div>
                </div>
                <p class="review-comment">{{ rev.komentar || 'Tidak ada komentar.' }}</p>
                <span class="review-date">{{ formatDate(rev.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Rent Button Trigger & Chat Pemilik -->
          <div class="action-buttons-group">
            <button @click="handleRentTrigger" class="rent-btn-large">Pinjam Barang Ini</button>
            <button @click="hubungiPemilik" class="chat-owner-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="wa-icon-large">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat Pemilik
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rent Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3>Konfirmasi Penyewaan</h3>
            <button @click="closeModal" class="close-modal-btn" aria-label="Tutup modal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="close-icon">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <h4 class="modal-item-name">{{ item.nama_barang || item.name }}</h4>

            <!-- Date Fields -->
            <div class="date-fields">
              <div class="date-group">
                <label for="startDate">Tanggal Mulai Sewa</label>
                <div class="input-wrapper">
                  <input 
                    id="startDate" 
                    type="date" 
                    v-model="startDate" 
                    :min="todayStr"
                  />
                </div>
              </div>
              <div class="date-group">
                <label for="endDate">Tanggal Selesai Sewa</label>
                <div class="input-wrapper">
                  <input 
                    id="endDate" 
                    type="date" 
                    v-model="endDate" 
                    :min="startDate || todayStr"
                  />
                </div>
              </div>
            </div>

            <!-- Error State inside Modal -->
            <div v-if="durationDays <= 0" class="date-warning">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="warning-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Tanggal selesai harus setelah tanggal mulai sewa.</span>
            </div>

            <!-- Bill Breakdown / Receipt -->
            <div v-else class="receipt-card">
              <h4>Struk Rincian Biaya</h4>
              <div class="receipt-list">
                <div class="receipt-row">
                  <span class="receipt-label">Harga Sewa ({{ formatPrice(pricePerDay) }} × {{ durationDays }} hari)</span>
                  <span class="receipt-val">{{ formatPrice(totalRent) }}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Jaminan Deposit (Refundable)</span>
                  <span class="receipt-val">{{ formatPrice(depositAmount) }}</span>
                </div>
                <div class="receipt-row">
                  <span class="receipt-label">Biaya Admin</span>
                  <span class="receipt-val">{{ formatPrice(adminFee) }}</span>
                </div>
                <div class="receipt-divider"></div>
                <div class="receipt-row grand-total-row">
                  <span class="grand-total-label">Total Tagihan</span>
                  <span class="grand-total-val">{{ formatPrice(grandTotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Rekening Pengembalian Deposit Form -->
            <div v-if="durationDays > 0" class="bank-form-section">
              <h4 class="form-title">Rekening Pengembalian Deposit</h4>
              <p class="form-subtitle">Pastikan data benar untuk keperluan pengembalian dana jaminan deposit.</p>
              
              <div class="form-group">
                <label for="bankDeposit">Nama Bank Tujuan</label>
                <div class="select-wrapper">
                  <select id="bankDeposit" v-model="bankDeposit" required>
                    <option value="BCA">BCA</option>
                    <option value="BNI">BNI</option>
                    <option value="MANDIRI">MANDIRI</option>
                    <option value="BRI">BRI</option>
                    <option value="DANA">DANA</option>
                    <option value="OVO">OVO</option>
                    <option value="GOPAY">GOPAY</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="rekeningDeposit">Nomor Rekening / E-Wallet</label>
                <input 
                  id="rekeningDeposit" 
                  type="text" 
                  v-model="rekeningDeposit" 
                  placeholder="Contoh: 7012345678" 
                  required 
                />
              </div>

              <div class="form-group">
                <label for="namaRekeningDeposit">Nama Pemilik Rekening</label>
                <input 
                  id="namaRekeningDeposit" 
                  type="text" 
                  v-model="namaRekeningDeposit" 
                  placeholder="Contoh: Budi Santoso" 
                  required 
                />
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel" :disabled="isSubmitting">Batal</button>
            <button 
              @click="submitTransaction" 
              class="btn-pay" 
              :disabled="durationDays <= 0 || isSubmitting"
            >
              <span v-if="isSubmitting">Memproses...</span>
              <span v-else>Lanjut ke Pembayaran</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style src='./DetailBarang.css' scoped></style>
