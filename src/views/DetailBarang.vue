<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import BaseButton from '../components/ui/BaseButton.vue';

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
  <div class="max-w-[1000px] mx-auto px-5 py-10 box-border font-sans select-none">
    <!-- Back Navigation -->
    <div class="mb-6 text-left">
      <router-link to="/" class="inline-flex items-center gap-2 text-ink/80 hover:text-[#ff385c] no-underline font-medium text-[15px] transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px]">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Katalog
      </router-link>
    </div>

    <!-- State: Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] text-center text-ink gap-4">
      <svg class="animate-spin h-10 w-10 text-[#ff385c]" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-sm text-muted font-sans">Memuat rincian barang...</p>
    </div>

    <!-- State: Error -->
    <div v-else-if="errorMessage || !item" class="flex flex-col items-center justify-center min-h-[400px] text-center text-ink gap-4">
      <div class="w-16 h-16 flex items-center justify-center rounded-full text-[#ef4444] bg-[#ef4444]/10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-ink m-0">Gagal Memuat Rincian</h3>
      <p class="text-sm text-muted-soft">{{ errorMessage || 'Barang tidak ditemukan' }}</p>
      <button @click="fetchItemDetails" class="py-2.5 px-6 bg-[#ff385c] hover:bg-[#e00b41] text-white border-none rounded-md font-semibold cursor-pointer transition-all active:scale-[0.98]">Coba Lagi</button>
    </div>

    <!-- State: Success / Content -->
    <div v-else class="bg-canvas border border-hairline rounded-[20px] p-6 md:p-10 shadow-sm transition-colors duration-300 hover:border-[#ff385c]/30">
      <div class="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-12">
        <!-- Left Column: Image Area -->
        <div class="flex flex-col gap-5">
          <div class="relative w-full pt-[75%] rounded-xl overflow-hidden bg-surface-soft border border-hairline">
            <img 
              v-if="item.foto_barang"
              :src="item.foto_barang" 
              :alt="item.nama_barang || item.name" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
            <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-muted-soft gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-12 h-12 stroke-[1.5]">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span class="text-sm font-medium">Belum Ada Foto</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Info & Action Area -->
        <div class="flex flex-col text-left">
          <div class="inline-flex self-start px-3 py-1 bg-[#ff385c]/10 text-[#ff385c] rounded-full text-xs font-bold uppercase tracking-wider mb-4">{{ item.category || 'Barang Sewa' }}</div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-ink m-0 mb-4 leading-tight tracking-tight">{{ item.nama_barang || item.name }}</h1>
          
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-2xl md:text-3xl font-extrabold text-[#ff385c]">{{ formatPrice(item.harga_sewa_per_hari !== undefined ? item.harga_sewa_per_hari : item.price) }}</span>
            <span class="text-[15px] text-muted font-medium">/ hari</span>
          </div>

          <hr class="border-0 border-t border-hairline my-6" />

          <div class="flex flex-col gap-5">
            <!-- Location Row -->
            <div class="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-[#ff385c] shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div class="flex flex-col">
                <span class="text-xs text-muted-soft font-semibold uppercase tracking-wider">Lokasi Pengambilan</span>
                <span class="text-[15px] text-ink font-semibold mt-0.5">{{ item.lokasi || item.location || 'Lokasi tidak ditentukan' }}</span>
              </div>
            </div>

            <!-- Stock Row -->
            <div class="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-[#ff385c] shrink-0">
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
              </svg>
              <div class="flex flex-col">
                <span class="text-xs text-muted-soft font-semibold uppercase tracking-wider">Stok Tersedia</span>
                <span class="text-[15px] text-ink font-semibold mt-0.5">{{ item.stok !== undefined ? item.stok : (item.stock || 1) }} unit</span>
              </div>
            </div>

            <!-- Deposit Row -->
            <div class="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-[#ff385c] shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="4" x2="12" y2="20"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              <div class="flex flex-col">
                <span class="text-xs text-muted-soft font-semibold uppercase tracking-wider">Uang Jaminan / Deposit</span>
                <span class="text-[15px] text-ink font-semibold mt-0.5">{{ formatPrice(item.deposit) }}</span>
              </div>
            </div>
          </div>

          <hr class="border-0 border-t border-hairline my-6" />

          <!-- Description Section -->
          <div class="mb-6">
            <h2 class="text-lg font-bold text-ink m-0 mb-3">Deskripsi Barang</h2>
            <p class="text-[15px] text-body leading-relaxed m-0">{{ item.deskripsi || item.description || 'Tidak ada deskripsi untuk barang ini.' }}</p>
          </div>

          <!-- Reviews Section -->
          <div class="mt-6">
            <h2 class="text-lg font-bold text-ink m-0 mb-3">Ulasan Penyewa</h2>
            <div v-if="reviews.length === 0" class="text-sm text-muted-soft italic">
              Belum ada ulasan untuk barang ini.
            </div>
            <div v-else class="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-2">
              <div v-for="rev in reviews" :key="rev.id" class="bg-surface-soft border border-hairline rounded-xl p-4 flex flex-col gap-2 text-left">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold text-ink">Penyewa #{{ rev.penyewa_id.slice(0, 8) }}</span>
                  <div class="flex gap-0.5">
                    <span v-for="star in 5" :key="star" class="text-sm" :class="star <= rev.rating ? 'text-amber-500' : 'text-slate-200'">★</span>
                  </div>
                </div>
                <p class="text-sm text-body m-0 leading-normal">{{ rev.komentar || 'Tidak ada komentar.' }}</p>
                <span class="text-[11px] text-muted-soft self-start">{{ formatDate(rev.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Rent Button Trigger & Chat Pemilik -->
          <div class="flex gap-4 mt-8">
            <button @click="handleRentTrigger" class="flex-[2] py-4 bg-[#ff385c] hover:bg-[#e00b41] text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all shadow-md shadow-[#ff385c]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">Pinjam Barang Ini</button>
            <button @click="hubungiPemilik" class="flex-1 py-4 bg-[#25d366] hover:bg-[#20ba5a] text-white border-none rounded-xl text-[15px] font-bold cursor-pointer inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25d366]/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-5 h-5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat Pemilik
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rent Confirmation Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]" @click.self="closeModal">
        <div class="bg-canvas rounded-2xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border border-hairline animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Header -->
          <div class="flex justify-between items-center px-6 py-5 border-b border-hairline">
            <h3 class="text-lg font-extrabold text-ink m-0">Konfirmasi Penyewaan</h3>
            <button @click="closeModal" class="bg-transparent border-none text-muted-soft cursor-pointer flex items-center justify-center p-1 rounded-full transition-colors hover:bg-surface-soft hover:text-ink focus:outline-none" aria-label="Tutup modal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto text-left">
            <h4 class="text-base font-bold text-ink m-0 mb-5">{{ item.nama_barang || item.name }}</h4>

            <!-- Date Fields -->
            <div class="grid grid-cols-2 gap-4 mb-5">
              <div class="flex flex-col gap-2">
                <label for="startDate" class="text-xs font-bold text-muted uppercase tracking-wider">Tanggal Mulai Sewa</label>
                <div class="relative">
                  <input 
                    id="startDate" 
                    type="date" 
                    v-model="startDate" 
                    :min="todayStr"
                    class="w-full p-3 border border-hairline rounded-lg text-sm text-ink bg-canvas box-border outline-none focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/10"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label for="endDate" class="text-xs font-bold text-muted uppercase tracking-wider">Tanggal Selesai Sewa</label>
                <div class="relative">
                  <input 
                    id="endDate" 
                    type="date" 
                    v-model="endDate" 
                    :min="startDate || todayStr"
                    class="w-full p-3 border border-hairline rounded-lg text-sm text-ink bg-canvas box-border outline-none focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/10"
                  />
                </div>
              </div>
            </div>

            <!-- Error State inside Modal -->
            <div v-if="durationDays <= 0" class="flex items-center gap-2 bg-error/5 border border-error/20 rounded-lg p-3 text-error text-xs font-medium mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px] shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Tanggal selesai harus setelah tanggal mulai sewa.</span>
            </div>

            <!-- Bill Breakdown / Receipt -->
            <div v-else class="bg-surface-soft border border-hairline rounded-xl p-5 mb-6">
              <h4 class="text-xs font-bold text-ink m-0 mb-4 uppercase tracking-wider">Struk Rincian Biaya</h4>
              <div class="flex flex-col gap-3">
                <div class="flex justify-between text-sm text-body">
                  <span class="text-muted">Harga Sewa ({{ formatPrice(pricePerDay) }} × {{ durationDays }} hari)</span>
                  <span class="text-ink font-semibold">{{ formatPrice(totalRent) }}</span>
                </div>
                <div class="flex justify-between text-sm text-body">
                  <span class="text-muted">Jaminan Deposit (Refundable)</span>
                  <span class="text-ink font-semibold">{{ formatPrice(depositAmount) }}</span>
                </div>
                <div class="flex justify-between text-sm text-body">
                  <span class="text-muted">Biaya Admin</span>
                  <span class="text-ink font-semibold">{{ formatPrice(adminFee) }}</span>
                </div>
                <div class="border-t border-hairline my-1"></div>
                <div class="flex justify-between text-sm text-body font-extrabold text-ink text-base mt-1">
                  <span>Total Tagihan</span>
                  <span class="text-[#ff385c] font-black text-lg">{{ formatPrice(grandTotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Rekening Pengembalian Deposit Form -->
            <div v-if="durationDays > 0" class="border-t border-hairline pt-5 flex flex-col gap-4">
              <h4 class="text-[15px] font-bold text-ink m-0">Rekening Pengembalian Deposit</h4>
              <p class="text-xs text-muted-soft m-0 -mt-2 leading-normal">Pastikan data benar untuk keperluan pengembalian dana jaminan deposit.</p>
              
              <div class="flex flex-col gap-2">
                <label for="bankDeposit" class="text-xs font-bold text-muted uppercase tracking-wider">Nama Bank Tujuan</label>
                <div class="relative">
                  <select id="bankDeposit" v-model="bankDeposit" class="w-full p-3 border border-hairline rounded-lg text-sm text-ink bg-canvas outline-none cursor-pointer focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/10" required>
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

              <div class="flex flex-col gap-2">
                <label for="rekeningDeposit" class="text-xs font-bold text-muted uppercase tracking-wider">Nomor Rekening / E-Wallet</label>
                <input 
                  id="rekeningDeposit" 
                  type="text" 
                  v-model="rekeningDeposit" 
                  placeholder="Contoh: 7012345678" 
                  class="p-3 border border-hairline rounded-lg text-sm text-ink bg-canvas outline-none focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/10"
                  required 
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="namaRekeningDeposit" class="text-xs font-bold text-muted uppercase tracking-wider">Nama Pemilik Rekening</label>
                <input 
                  id="namaRekeningDeposit" 
                  type="text" 
                  v-model="namaRekeningDeposit" 
                  placeholder="Contoh: Budi Santoso" 
                  class="p-3 border border-hairline rounded-lg text-sm text-ink bg-canvas outline-none focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/10"
                  required 
                />
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-hairline bg-surface-soft rounded-b-2xl">
            <button @click="closeModal" class="py-3 px-5 bg-transparent border border-hairline rounded-lg text-ink font-semibold text-sm cursor-pointer transition-colors hover:bg-surface-soft" :disabled="isSubmitting">Batal</button>
            <button 
              @click="submitTransaction" 
              class="py-3 px-6 bg-[#ff385c] hover:bg-[#e00b41] text-white border-none rounded-lg text-sm font-bold cursor-pointer transition-colors disabled:bg-slate-200 disabled:text-muted disabled:cursor-not-allowed" 
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
