<template>
  <div class="admin-kyc-container">
    <div class="admin-kyc-content-layout">
      <!-- Title Header Section -->
      <header class="admin-kyc-header">
        <h1 class="page-title">Panel Admin: Verifikasi KYC</h1>
        <p class="page-subtitle">Setujui pengunggahan KTP pengguna untuk memberikan hak sewa & tambah barang</p>
      </header>

      <div class="settings-box">
        <!-- Alert Boxes -->
        <div v-if="errorMessage" class="kyc-alert error-alert">{{ errorMessage }}</div>
        <div v-if="successMessage" class="kyc-alert success-alert">{{ successMessage }}</div>

        <!-- Section: Manual Verification -->
        <section class="manual-verify-section">
          <h3 class="section-title">Verifikasi Manual via User ID</h3>
          <div class="search-form-group">
            <input 
              type="text" 
              v-model="userIdInput" 
              placeholder="Masukkan User ID (contoh: 12)" 
              class="user-id-input"
              :disabled="isLoading"
            />
            <button 
              class="btn-manual-submit" 
              :disabled="isLoading || !userIdInput" 
              @click="handleManualVerify"
            >
              Setujui KTP User
            </button>
          </div>
        </section>

        <hr class="section-divider" />

        <!-- Section: Pending Queue List -->
        <section class="queue-section">
          <h3 class="section-title">Antrean Pengajuan KTP (Simulasi)</h3>

          <div v-if="pendingUsers.length === 0" class="empty-queue-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p class="empty-queue-text">Semua pengajuan KTP telah diproses!</p>
          </div>

          <div v-else class="queue-list-stack">
            <div v-for="user in pendingUsers" :key="user.id" class="queue-item-card">
              <div class="user-meta-details">
                <span class="user-display-name">{{ user.name }}</span>
                <div class="user-sub-details">
                  <span class="user-id-badge">ID: {{ user.id }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
                <div class="ktp-file-details">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="file-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span class="file-name-text">{{ user.ktpFileName }}</span>
                </div>
              </div>
              
              <button 
                class="btn-approve-queue" 
                :disabled="isLoading" 
                @click="verifyUser(user.id)"
              >
                Setujui
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import useAdminKYC from './composables/useAdminKYC';

export default {
  name: 'AdminKYCView',
  setup() {
    const {
      userIdInput,
      isLoading,
      successMessage,
      errorMessage,
      pendingUsers,
      verifyUser,
      handleManualVerify,
    } = useAdminKYC();

    return {
      userIdInput,
      isLoading,
      successMessage,
      errorMessage,
      pendingUsers,
      verifyUser,
      handleManualVerify,
    };
  },
};
</script>

<style scoped>
.admin-kyc-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px 80px 24px;
  box-sizing: border-box;
}

/* Header styling */
.admin-kyc-header {
  text-align: left;
  margin-bottom: 28px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0;
  font-family: var(--font-sans);
}

.page-subtitle {
  font-size: 14.5px;
  color: var(--color-muted);
  margin: 6px 0 0 0;
  line-height: 1.5;
  font-family: var(--font-sans);
}

/* Settings Box */
.settings-box {
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

@media (max-width: 480px) {
  .settings-box {
    padding: 20px;
  }
}

.section-divider {
  border: 0;
  border-top: 1px solid var(--color-hairline);
  margin: 28px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 16px 0;
  font-family: var(--font-sans);
  text-align: left;
}

/* Alert Boxes */
.kyc-alert {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  font-weight: 600;
  margin-bottom: 16px;
  text-align: left;
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: var(--color-error);
}

.success-alert {
  background-color: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

/* Manual Verify Search Box styling */
.search-form-group {
  display: flex;
  gap: 12px;
}

@media (max-width: 480px) {
  .search-form-group {
    flex-direction: column;
    align-items: stretch;
  }
}

.user-id-input {
  flex: 1;
  height: 52px;
  padding: 0 16px;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 14.5px;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.user-id-input:focus {
  border-color: var(--color-ink);
  border-width: 2px;
}

.btn-manual-submit {
  height: 52px;
  padding: 0 20px;
  background: #ff385c;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  box-shadow: 0 2px 8px rgba(255, 56, 92, 0.15);
  white-space: nowrap;
}

.btn-manual-submit:hover:not(:disabled) {
  background: #e00b41;
  transform: translateY(-1px);
}

.btn-manual-submit:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn-manual-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Queue Section styling */
.empty-queue-box {
  background: var(--color-surface-soft);
  border: 1px dashed var(--color-hairline);
  border-radius: 12px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-muted-soft);
}

.empty-svg {
  width: 32px;
  height: 32px;
  color: #10b981;
  margin-bottom: 12px;
}

.empty-queue-text {
  font-size: 13.5px;
  color: var(--color-muted);
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
}

.queue-list-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.01);
}

@media (max-width: 480px) {
  .queue-item-card {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
}

.user-meta-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.user-display-name {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.user-sub-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-id-badge {
  font-size: 10.5px;
  font-family: var(--font-mono);
  background: var(--color-surface-strong);
  color: var(--color-ink);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.user-email {
  font-size: 12.5px;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.ktp-file-details {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.file-icon {
  width: 13px;
  height: 13px;
  color: var(--color-muted-soft);
}

.file-name-text {
  font-size: 12px;
  color: var(--color-muted-soft);
  font-family: var(--font-sans);
}

.btn-approve-queue {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  white-space: nowrap;
}

.btn-approve-queue:hover:not(:disabled) {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
}

.btn-approve-queue:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
