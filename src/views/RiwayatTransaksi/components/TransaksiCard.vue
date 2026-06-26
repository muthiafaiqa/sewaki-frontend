<template>
  <BaseCard class="transaction-card grid grid-cols-12 gap-md overflow-hidden text-left">
    <!-- Image left -->
    <div class="col-span-3 card-image-section flex justify-center items-center bg-surface-soft border-r">
      <img 
        v-if="tx.item?.foto_barang"
        :src="getImageUrl(tx.item.foto_barang)" 
        :alt="tx.item.nama_barang" 
        class="item-img w-full h-full object-cover"
      />
      <div v-else class="image-placeholder text-muted py-lg">📦 No Image</div>
    </div>

    <!-- Info Right -->
    <div class="col-span-9 p-md flex flex-col justify-between">
      <div class="card-header flex justify-between items-center mb-xs">
        <span class="tx-date text-muted body-xs font-semibold">{{ formatDate(tx.createdAt) }}</span>
        <span class="tx-id font-mono text-ink bg-surface-soft px-xxs py-xxs rounded text-xs">ID: #{{ tx.id.slice(0, 8) }}</span>
      </div>

      <h2 class="item-name title-xs text-ink font-bold mb-sm">{{ tx.item?.nama_barang || 'Barang Tidak Diketahui' }}</h2>

      <div class="rent-details body-sm text-muted mb-md flex items-center gap-xs">
        📅 <span>{{ formatDate(tx.tanggal_mulai) }} - {{ formatDate(tx.tanggal_selesai) }} ({{ getDurationDays(tx.tanggal_mulai, tx.tanggal_selesai) }} Hari)</span>
      </div>

      <hr class="card-divider my-sm" />

      <div class="price-and-badges flex justify-between items-end">
        <div class="price-info flex flex-col">
          <span class="price-label body-xs text-muted font-medium mb-xxs">Total Pembayaran</span>
          <span class="price-value title-sm text-primary font-bold">{{ formatPrice(getPriceDetails(tx).grandTotal) }}</span>
          <span class="price-breakdown body-xs text-muted mt-xxs">
            (Sewa: {{ formatPrice(getPriceDetails(tx).sewa) }} 
            + Deposit: {{ formatPrice(getPriceDetails(tx).deposit) }}
            <span v-if="getPriceDetails(tx).admin > 0"> + Admin: {{ formatPrice(getPriceDetails(tx).admin) }}</span>)
          </span>
        </div>

        <div class="badges-container flex flex-col gap-xxs items-end">
          <div class="badge-wrapper flex items-center gap-xs body-xs">
            <span class="text-muted">Pembayaran:</span>
            <BaseBadge :color="getPaymentStatusColor(tx.status_transaksi)">
              {{ getPaymentStatusLabel(tx.status_transaksi) }}
            </BaseBadge>
          </div>
          <div class="badge-wrapper flex items-center gap-xs body-xs">
            <span class="text-muted">Deposit:</span>
            <BaseBadge :color="getDepositStatusColor(tx.status_deposit)">
              {{ getDepositStatusLabel(tx.status_deposit) }}
            </BaseBadge>
          </div>
        </div>
      </div>

      <div v-if="tx.status_transaksi === 'dibayar' || (tx.status_transaksi === 'selesai' && !isReviewed)" class="card-actions flex justify-end gap-sm mt-md">
        <BaseButton 
          v-if="tx.status_transaksi === 'dibayar'" 
          variant="primary" 
          size="sm"
          @click="$emit('return', tx.id)"
        >
          Kembalikan Barang
        </BaseButton>
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
  emits: ['return', 'review'],
  setup() {
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

    return {
      formatPrice,
      getPriceDetails,
      getImageUrl,
      formatDate,
      getDurationDays,
      getPaymentStatusColor,
      getPaymentStatusLabel,
      getDepositStatusColor,
      getDepositStatusLabel,
    };
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .transaction-card {
    grid-template-columns: 1fr;
  }
}
</style>
