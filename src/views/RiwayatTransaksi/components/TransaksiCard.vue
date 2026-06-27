<template>
  <BaseCard class="grid grid-cols-1 md:grid-cols-12 gap-md overflow-hidden text-left">
    <!-- Image left -->
    <div class="col-span-1 md:col-span-3 flex justify-center items-center bg-surface-soft border-b md:border-b-0 md:border-r">
      <img 
        v-if="tx.item?.foto_barang"
        :src="getImageUrl(tx.item.foto_barang)" 
        :alt="tx.item.nama_barang" 
        class="w-full h-full object-cover"
      />
      <div v-else class="text-muted py-lg text-center">📦 No Image</div>
    </div>

    <!-- Info Right -->
    <div class="col-span-1 md:col-span-9 p-md flex flex-col justify-between">
      <div class="flex justify-between items-center mb-xs">
        <span class="text-muted body-xs font-semibold">{{ formatDate(tx.createdAt) }}</span>
        <span class="font-mono text-ink bg-surface-soft px-xxs py-xxs rounded text-xs">ID: #{{ tx.id.slice(0, 8) }}</span>
      </div>

      <h2 class="title-xs text-ink font-bold mb-sm">{{ tx.item?.nama_barang || 'Barang Tidak Diketahui' }}</h2>

      <div class="body-sm text-muted mb-md flex items-center gap-xs">
        📅 <span>{{ formatDate(tx.tanggal_mulai) }} - {{ formatDate(tx.tanggal_selesai) }} ({{ getDurationDays(tx.tanggal_mulai, tx.tanggal_selesai) }} Hari)</span>
      </div>

      <hr class="border-0 border-t border-hairline my-sm" />

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-sm sm:gap-0">
        <div class="flex flex-col text-left">
          <span class="body-xs text-muted font-medium mb-xxs">Total Pembayaran</span>
          <span class="title-sm text-primary font-bold">{{ formatPrice(getPriceDetails(tx).grandTotal) }}</span>
          <span class="body-xs text-muted mt-xxs">
            (Sewa: {{ formatPrice(getPriceDetails(tx).sewa) }} 
            + Deposit: {{ formatPrice(getPriceDetails(tx).deposit) }}
            <span v-if="getPriceDetails(tx).admin > 0"> + Admin: {{ formatPrice(getPriceDetails(tx).admin) }}</span>)
          </span>
        </div>

        <div class="flex flex-col gap-xxs items-start sm:items-end w-full sm:w-auto">
          <div class="flex items-center gap-xs body-xs">
            <span class="text-muted">Pembayaran:</span>
            <BaseBadge :color="getPaymentStatusColor(tx.status_transaksi)">
              {{ getPaymentStatusLabel(tx.status_transaksi) }}
            </BaseBadge>
          </div>
          <div class="flex items-center gap-xs body-xs">
            <span class="text-muted">Deposit:</span>
            <BaseBadge :color="getDepositStatusColor(tx.status_deposit)">
              {{ getDepositStatusLabel(tx.status_deposit) }}
            </BaseBadge>
          </div>
          <div v-if="tx.status_transaksi === 'menunggu_pembayaran'" class="text-xs text-error font-semibold mt-xs flex items-center gap-xxs">
            <span>⏱️ Waktu Bayar:</span>
            <span class="font-bold">{{ remainingTimeStr }}</span>
          </div>
        </div>
      </div>

      <div v-if="tx.status_transaksi === 'menunggu_pembayaran' || tx.status_transaksi === 'expired' || tx.status_transaksi === 'dibayar' || (tx.status_transaksi === 'selesai' && !isReviewed) || tx.status_transaksi === 'menunggu_inspeksi'" class="flex justify-end gap-sm mt-md">
        <BaseButton 
          v-if="tx.status_transaksi === 'menunggu_pembayaran' || tx.status_transaksi === 'expired'" 
          variant="primary" 
          size="sm"
          :disabled="tx.status_transaksi === 'expired'"
          @click="payNow(tx.invoice_url)"
        >
          <span v-if="tx.status_transaksi === 'expired'">Bayar Sekarang (Kedaluwarsa)</span>
          <span v-else>Bayar Sekarang</span>
        </BaseButton>
        <BaseButton 
          v-if="tx.status_transaksi === 'dibayar'" 
          variant="primary" 
          size="sm"
          @click="$emit('return', tx.id)"
        >
          Kembalikan Barang
        </BaseButton>
        <button 
          v-if="tx.status_transaksi === 'menunggu_inspeksi'"
          class="px-3 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-md text-xs font-bold font-sans transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          @click="$emit('dispute', tx)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Ajukan Komplain</span>
        </button>
        <BaseButton 
          v-if="tx.status_transaksi === 'selesai' && !isReviewed" 
          variant="secondary" 
          size="sm"
          @click="$emit('review', tx)"
        >
          Beri Ulasan
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import BaseCard from '../../../components/ui/BaseCard.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseBadge from '../../../components/ui/BaseBadge.vue';

export default {
  name: 'TransaksiCard',
  components: {
    BaseCard,
    BaseButton,
    BaseBadge,
  },
  props: {
    tx: {
      type: Object,
      required: true,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['return', 'review', 'expired', 'dispute'],
  setup(props, { emit }) {
    const remainingTimeStr = ref('00:00:00');
    let timerInterval = null;

    const updateCountdown = () => {
      const createdTime = new Date(props.tx.createdAt).getTime();
      const expireTime = createdTime + 24 * 60 * 60 * 1000;
      const now = Date.now();
      const diff = expireTime - now;

      if (diff <= 0) {
        remainingTimeStr.value = '00:00:00';
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        emit('expired', props.tx.id);
      } else {
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
        remainingTimeStr.value = `${hours}:${minutes}:${seconds}`;
      }
    };

    onMounted(() => {
      if (props.tx.status_transaksi === 'menunggu_pembayaran') {
        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
      }
    });

    onUnmounted(() => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    });

    watch(() => props.tx.status_transaksi, (newStatus) => {
      if (newStatus !== 'menunggu_pembayaran' && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      } else if (newStatus === 'menunggu_pembayaran' && !timerInterval) {
        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
      }
    });

    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const getPriceDetails = (tx) => {
      const isNewSchema = tx.biaya_admin !== undefined && tx.biaya_admin !== null;
      if (isNewSchema) {
        const admin = tx.biaya_admin || 0;
        const deposit = tx.jaminan_deposit || 0;
        const grandTotal = tx.total_harga;
        const sewa = grandTotal - deposit - admin;
        return { sewa, deposit, admin, grandTotal };
      } else {
        const sewa = tx.total_harga || 0;
        const deposit = tx.jaminan_deposit || 0;
        const admin = 0;
        const grandTotal = sewa + deposit;
        return { sewa, deposit, admin, grandTotal };
      }
    };

    const getImageUrl = (filename) => {
      if (!filename) return '';
      if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
      }
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    const getDurationDays = (start, end) => {
      const diffTime = new Date(end) - new Date(start);
      if (diffTime <= 0) return 0;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getPaymentStatusColor = (status) => {
      if (!status) return 'gray';
      const val = status.toLowerCase();
      if (val === 'dibayar' || val === 'selesai') return 'green';
      if (val === 'menunggu_pembayaran') return 'orange';
      if (val === 'sedang_disewa') return 'blue';
      if (val === 'menunggu_inspeksi') return 'purple';
      if (val === 'disputed' || val === 'sengketa') return 'red';
      if (val === 'expired' || val === 'kedaluwarsa') return 'gray';
      return 'red';
    };

    const getPaymentStatusLabel = (status) => {
      if (!status) return 'Tidak Diketahui';
      const val = status.toLowerCase();
      if (val === 'dibayar') return 'Dibayar';
      if (val === 'selesai') return 'Selesai';
      if (val === 'menunggu_pembayaran') return 'Menunggu Pembayaran';
      if (val === 'sedang_disewa') return 'Sedang Disewa';
      if (val === 'menunggu_inspeksi') return 'Menunggu Verifikasi Pemilik';
      if (val === 'disputed' || val === 'sengketa') return 'Dalam Sengketa (Admin)';
      if (val === 'expired') return 'Kedaluwarsa';
      return status;
    };

    const getDepositStatusColor = (status) => {
      if (!status) return 'gray';
      const val = status.toLowerCase();
      if (val === 'dikembalikan') return 'green';
      if (val === 'ditahan') return 'orange';
      return 'gray';
    };

    const getDepositStatusLabel = (status) => {
      if (!status) return 'Tidak Ada';
      const val = status.toLowerCase();
      if (val === 'ditahan') return 'Ditahan';
      if (val === 'dikembalikan') return 'Dikembalikan';
      return status;
    };

    const payNow = (url) => {
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Tautan pembayaran tidak tersedia atau sedang diproses. Harap segarkan halaman.');
      }
    };

    return {
      remainingTimeStr,
      formatPrice,
      getPriceDetails,
      getImageUrl,
      formatDate,
      getDurationDays,
      getPaymentStatusColor,
      getPaymentStatusLabel,
      getDepositStatusColor,
      getDepositStatusLabel,
      payNow,
    };
  },
};
</script>
