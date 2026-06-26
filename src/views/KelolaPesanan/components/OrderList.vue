<template>
  <div class="orders-table-wrapper">
    <div class="table-responsive">
      <table class="rentals-table">
        <thead>
          <tr>
            <th>Detail Barang</th>
            <th>Penyewa</th>
            <th>Masa Sewa & Durasi</th>
            <th>Rincian Biaya</th>
            <th>Status</th>
            <th class="actions-header">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in rentals" :key="tx.id" class="table-row">
            <!-- Detail Barang -->
            <td>
              <div class="item-cell">
                <div class="item-img-container">
                  <img 
                    v-if="tx.item?.foto_barang"
                    :src="getImageUrl(tx.item.foto_barang)" 
                    :alt="tx.item.nama_barang" 
                    class="item-thumb-img"
                  />
                  <div v-else class="item-thumb-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="box-icon">
                      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                      <path d="M9 22V12h6v10"></path>
                    </svg>
                  </div>
                </div>
                <div class="item-meta-info">
                  <span class="item-title-text">{{ tx.item?.nama_barang || 'N/A' }}</span>
                  <span class="tx-id-badge">TX #{{ tx.id.slice(0, 8) }}</span>
                </div>
              </div>
            </td>

            <!-- Penyewa -->
            <td>
              <div class="renter-cell-info">
                <span class="renter-label">User ID</span>
                <span class="renter-id-code">#{{ tx.penyewa_id.slice(0, 8) }}</span>
              </div>
            </td>

            <!-- Masa Sewa & Durasi -->
            <td>
              <div class="rent-date-cell">
                <span class="date-range-text">{{ formatDate(tx.tanggal_mulai) }} - {{ formatDate(tx.tanggal_selesai) }}</span>
                <span class="duration-days-badge">{{ getDurationDays(tx.tanggal_mulai, tx.tanggal_selesai) }} Hari</span>
              </div>
            </td>

            <!-- Rincian Biaya -->
            <td>
              <div class="billing-details-cell">
                <div class="bill-row">
                  <span class="bill-lbl">Sewa:</span>
                  <span class="bill-val">{{ formatPrice(getPriceDetails(tx).sewa) }}</span>
                </div>
                <div class="bill-row highlight">
                  <span class="bill-lbl">Deposit:</span>
                  <span class="bill-val-deposit">{{ formatPrice(getPriceDetails(tx).deposit) }}</span>
                </div>
              </div>
            </td>

            <!-- Status Badges -->
            <td>
              <div class="status-pills-stack">
                <div class="status-badge-row">
                  <span class="status-lbl">Bayar:</span>
                  <span class="status-pill" :class="getStatusClass(tx.status_transaksi)">
                    {{ getStatusLabel(tx.status_transaksi) }}
                  </span>
                </div>
                <div class="status-badge-row">
                  <span class="status-lbl">Deposit:</span>
                  <span class="status-pill" :class="getStatusClass(tx.status_deposit)">
                    {{ getStatusLabel(tx.status_deposit) }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Actions buttons group -->
            <td class="actions-cell">
              <div class="actions-buttons-container">
                <button 
                  v-if="tx.status_transaksi?.toLowerCase() === 'menunggu_inspeksi'" 
                  class="btn-complete-rent"
                  @click="$emit('disburse', tx)"
                >
                  Selesaikan & Refund
                </button>
                <span v-else-if="tx.status_transaksi?.toLowerCase() === 'selesai'" class="state-label completed">
                  Selesai / Dicairkan
                </span>
                <span v-else-if="tx.status_transaksi?.toLowerCase() === 'dibayar'" class="state-label active-rent">
                  Sedang Disewa
                </span>
                <span v-else class="state-label pending">
                  Menunggu Bayar
                </span>

                <button 
                  class="btn-contact-renter"
                  @click="$emit('chat', tx)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="chat-icon">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Chat Penyewa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  props: {
    rentals: {
      type: Array,
      required: true,
    },
  },
  emits: ['disburse', 'chat'],
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
        month: 'short',
        year: 'numeric'
      });
    };

    const getDurationDays = (start, end) => {
      const diffTime = new Date(end) - new Date(start);
      if (diffTime <= 0) return 0;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusClass = (status) => {
      if (!status) return 'gray';
      const val = status.toLowerCase();
      if (val === 'dibayar' || val === 'selesai' || val === 'dikembalikan') return 'badge-success';
      if (val === 'menunggu_pembayaran' || val === 'ditahan') return 'badge-warning';
      return 'badge-danger';
    };

    const getStatusLabel = (status) => {
      if (!status) return '-';
      const val = status.toLowerCase();
      if (val === 'dibayar') return 'Dibayar';
      if (val === 'selesai') return 'Selesai';
      if (val === 'menunggu_pembayaran') return 'Menunggu Pembayaran';
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
      getStatusClass,
      getStatusLabel,
    };
  },
};
</script>

<style scoped>
.orders-table-wrapper {
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.rentals-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.rentals-table th {
  padding: 16px 24px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  border-bottom: 1px solid var(--color-hairline);
  background-color: var(--color-surface-soft);
  font-family: var(--font-sans);
}

.rentals-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-hairline-soft);
  vertical-align: middle;
  box-sizing: border-box;
}

.rentals-table tr:last-child td {
  border-bottom: none;
}

.table-row {
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: var(--color-surface-soft);
}

/* Detail Barang Cell styling */
.item-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-img-container {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  border: 1px solid var(--color-hairline);
  overflow: hidden;
  background-color: var(--color-surface-soft);
  flex-shrink: 0;
}

.item-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-soft);
}

.box-icon {
  width: 22px;
  height: 22px;
}

.item-meta-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
}

.item-title-text {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.tx-id-badge {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-muted);
  background: var(--color-surface-strong);
  padding: 1px 6px;
  border-radius: 4px;
  width: max-content;
}

/* Renter Cell styling */
.renter-cell-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.renter-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.renter-id-code {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-mono);
}

/* Date cell styling */
.rent-date-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.date-range-text {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.duration-days-badge {
  font-size: 11px;
  font-weight: 700;
  color: #ff385c;
  background: rgba(255, 56, 92, 0.05);
  border: 1px solid rgba(255, 56, 92, 0.1);
  padding: 1px 8px;
  border-radius: 9999px;
  width: max-content;
  font-family: var(--font-sans);
}

/* Billing Details styling */
.billing-details-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.bill-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-family: var(--font-sans);
}

.bill-lbl {
  color: var(--color-muted);
  font-weight: 500;
}

.bill-val {
  color: var(--color-ink);
  font-weight: 600;
}

.bill-row.highlight .bill-val-deposit {
  color: #ff385c;
  font-weight: 700;
}

/* Status Stack styling */
.status-pills-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 130px;
}

.status-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-family: var(--font-sans);
}

.status-lbl {
  color: var(--color-muted);
  font-weight: 500;
}

.status-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-family: var(--font-sans);
}

.badge-success {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid rgba(4, 120, 87, 0.1);
}

.badge-warning {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid rgba(180, 83, 9, 0.1);
}

.badge-danger {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid rgba(185, 28, 28, 0.1);
}

/* Actions styling */
.actions-header {
  text-align: right;
}

.actions-cell {
  text-align: right;
}

.actions-buttons-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.btn-complete-rent {
  padding: 8px 14px;
  background: #ff385c;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  box-shadow: 0 2px 6px rgba(255, 56, 92, 0.15);
  white-space: nowrap;
}

.btn-complete-rent:hover {
  background: #e00b41;
  transform: translateY(-1px);
}

.btn-complete-rent:active {
  transform: translateY(0) scale(0.98);
}

.btn-contact-renter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  color: var(--color-ink);
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  white-space: nowrap;
}

.btn-contact-renter:hover {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
}

.btn-contact-renter:active {
  transform: scale(0.98);
}

.chat-icon {
  width: 13px;
  height: 13px;
}

.state-label {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  padding: 6px 12px;
  display: inline-block;
}

.state-label.completed {
  color: var(--color-muted-soft);
}

.state-label.active-rent {
  color: #047857;
}

.state-label.pending {
  color: #b45309;
}
</style>
