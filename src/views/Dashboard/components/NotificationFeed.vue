<template>
  <BaseCard class="table-card text-left p-md">
    <h3 class="title-xs text-ink mb-md">5 Transaksi Terbaru</h3>
    <div class="table-responsive">
      <table class="recent-table w-full">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Barang</th>
            <th>Masa Sewa</th>
            <th>Total Harga</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="transactions.length === 0">
            <td colspan="5" class="empty-table text-center text-muted py-lg">
              Belum ada transaksi yang tercatat.
            </td>
          </tr>
          <tr v-else v-for="tx in transactions" :key="tx.id">
            <td>{{ formatDate(tx.createdAt) }}</td>
            <td class="font-semibold text-ink">
              {{ tx.item?.nama_barang || 'Barang Sewa' }}
            </td>
            <td>{{ formatDate(tx.tanggal_mulai) }} - {{ formatDate(tx.tanggal_selesai) }}</td>
            <td class="font-semibold text-ink">{{ formatPrice(tx.total_harga) }}</td>
            <td>
              <BaseBadge :color="getStatusColor(tx.status_transaksi)">
                {{ getStatusLabel(tx.status_transaksi) }}
              </BaseBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../../../components/ui/BaseCard.vue';
import BaseBadge from '../../../components/ui/BaseBadge.vue';

export default {
  name: 'NotificationFeed',
  components: {
    BaseCard,
    BaseBadge,
  },
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    const getStatusColor = (status) => {
      if (!status) return 'gray';
      const val = status.toLowerCase();
      if (val === 'dibayar' || val === 'selesai') return 'green';
      if (val === 'menunggu_pembayaran') return 'orange';
      if (val === 'sedang_disewa') return 'blue';
      if (val === 'menunggu_inspeksi') return 'purple';
      return 'red';
    };

    const getStatusLabel = (status) => {
      if (!status) return 'Tidak Diketahui';
      const val = status.toLowerCase();
      if (val === 'dibayar') return 'Dibayar';
      if (val === 'selesai') return 'Selesai';
      if (val === 'menunggu_pembayaran') return 'Menunggu Pembayaran';
      if (val === 'sedang_disewa') return 'Sedang Disewa';
      if (val === 'menunggu_inspeksi') return 'Menunggu Verifikasi';
      return status;
    };

    return {
      formatPrice,
      formatDate,
      getStatusColor,
      getStatusLabel,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.recent-table {
  border-collapse: collapse;
}

.recent-table th {
  padding: 12px var(--spacing-sm);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
  border-bottom: 1px solid var(--color-hairline);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recent-table td {
  padding: var(--spacing-sm);
  font-size: 14px;
  border-bottom: 1px solid var(--color-hairline-soft);
  white-space: nowrap;
}

.recent-table tr:last-child td {
  border-bottom: none;
}
</style>
