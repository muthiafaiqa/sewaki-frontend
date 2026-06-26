<template>
  <div class="users-table-wrapper">
    <div class="table-responsive">
      <table class="kyc-table">
        <thead>
          <tr>
            <th>Nama Pengguna</th>
            <th>Alamat Email</th>
            <th>Status KYC</th>
            <th>Dokumen KTP</th>
            <th class="actions-header">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row">
            <!-- Nama Pengguna -->
            <td>
              <div class="user-cell">
                <div class="user-avatar-circle">
                  {{ user.nama ? user.nama.charAt(0).toUpperCase() : 'U' }}
                </div>
                <span class="user-name-text">{{ user.nama || 'N/A' }}</span>
              </div>
            </td>

            <!-- Email -->
            <td class="email-cell">
              {{ user.email || '-' }}
            </td>

            <!-- Status KYC -->
            <td>
              <span class="status-pill" :class="getStatusClass(user.status_kyc)">
                {{ getStatusLabel(user.status_kyc) }}
              </span>
            </td>

            <!-- Dokumen KTP -->
            <td>
              <button 
                v-if="user.foto_ktp" 
                class="btn-view-ktp"
                @click="$emit('view-ktp', user)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="view-ktp-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Lihat KTP
              </button>
              <span v-else class="empty-ktp-lbl">-</span>
            </td>

            <!-- Tindakan -->
            <td class="actions-cell">
              <div v-if="isPending(user.status_kyc)" class="actions-buttons-container">
                <button 
                  class="btn-approve"
                  :disabled="actionLoading[user.id]"
                  @click="$emit('approve', user.id)"
                >
                  Setujui
                </button>
                <button 
                  class="btn-reject"
                  :disabled="actionLoading[user.id]"
                  @click="$emit('reject', user.id)"
                >
                  Tolak
                </button>
              </div>
              <span v-else class="empty-actions-lbl">Telah Diproses</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserTable',
  props: {
    users: {
      type: Array,
      required: true,
    },
    actionLoading: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['view-ktp', 'approve', 'reject'],
  setup() {
    const getStatusClass = (status) => {
      if (!status) return 'gray';
      const val = status.toLowerCase();
      if (val === 'verified') return 'badge-success';
      if (val === 'pending') return 'badge-warning';
      if (val === 'rejected') return 'badge-danger';
      return 'gray';
    };

    const getStatusLabel = (status) => {
      if (!status) return 'Belum Diunggah';
      const val = status.toLowerCase();
      if (val === 'pending') return 'Pending';
      if (val === 'verified') return 'Terverifikasi';
      if (val === 'rejected') return 'Ditolak';
      return 'Belum Diunggah';
    };

    const isPending = (status) => {
      if (!status) return true;
      const val = status.toLowerCase();
      return val === 'pending' || val === 'unverified';
    };

    return {
      getStatusClass,
      getStatusLabel,
      isPending,
    };
  },
};
</script>

<style scoped>
.users-table-wrapper {
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

.kyc-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.kyc-table th {
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

.kyc-table td {
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-hairline-soft);
  vertical-align: middle;
  box-sizing: border-box;
}

.kyc-table tr:last-child td {
  border-bottom: none;
}

.table-row {
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: var(--color-surface-soft);
}

/* User Cell styling */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-surface-strong);
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  font-family: var(--font-sans);
  flex-shrink: 0;
  border: 1px solid var(--color-hairline);
}

.user-name-text {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.email-cell {
  font-size: 14px;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

/* Status badge pills */
.status-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-family: var(--font-sans);
  display: inline-block;
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

.gray {
  background-color: var(--color-surface-soft);
  color: var(--color-muted);
  border: 1px solid var(--color-hairline);
}

/* KTP View Button */
.btn-view-ktp {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  color: var(--color-ink);
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.btn-view-ktp:hover {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
}

.view-ktp-icon {
  width: 14px;
  height: 14px;
}

.empty-ktp-lbl, .empty-actions-lbl {
  font-size: 13px;
  color: var(--color-muted-soft);
  font-family: var(--font-sans);
}

/* Actions cell and buttons styling */
.actions-header {
  text-align: right;
}

.actions-cell {
  text-align: right;
}

.actions-buttons-container {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-approve {
  padding: 6px 12px;
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
}

.btn-approve:hover:not(:disabled) {
  background: #e00b41;
  transform: translateY(-1px);
}

.btn-approve:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn-approve:disabled, .btn-reject:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-reject {
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #ef4444;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.btn-reject:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.05);
  border-color: #ef4444;
}

.btn-reject:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
