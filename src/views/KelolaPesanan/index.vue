<template>
  <div class="kelola-container">
    <div class="header-section">
      <div class="title-meta-group">
        <h1 class="page-title">Kelola Pesanan Masuk</h1>
        <p class="page-subtitle">Pantau penyewa barang Anda dan cairkan dana deposit jaminan setelah masa sewa berakhir</p>
      </div>
      <button class="refresh-btn" :disabled="isLoading" @click="fetchData">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="refresh-icon">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        Segarkan
      </button>
    </div>

    <!-- Alert Box for Success -->
    <div v-if="successMessage" class="alert-success-card">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="status-wrapper">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <p class="status-text">Memuat pesanan masuk...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="status-wrapper error-wrapper">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Gagal Memuat Pesanan</h3>
      <p class="status-subtext">{{ errorMessage }}</p>
      <button class="retry-btn mt-md" @click="fetchData">Coba Lagi</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="rentals.length === 0" class="empty-card-container">
      <div class="empty-state-box">
        <div class="empty-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-svg">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
        </div>
        <h3 class="empty-title">Belum Ada Pesanan Masuk</h3>
        <p class="empty-subtitle">Barang-barang sewaan milik Anda belum ada yang dipesan oleh penyewa saat ini.</p>
      </div>
    </div>

    <!-- Content State -->
    <div v-else class="kelola-content-layout">
      <OrderList 
        :rentals="rentals" 
        @disburse="openDisburseDialog" 
        @chat="hubungiWhatsApp" 
      />
    </div>

    <!-- Inspection Modal -->
    <InspectionModal
      :show="showDisburseModal"
      :transaction="selectedTx"
      @close="closeDisburseDialog"
      @completed="onInspectionCompleted"
    />
  </div>
</template>

<script>
import OrderList from './components/OrderList.vue';
import InspectionModal from './components/InspectionModal.vue';
import useKelolaPesanan from './composables/useKelolaPesanan';

export default {
  name: 'KelolaPesananView',
  components: {
    OrderList,
    InspectionModal,
  },
  setup() {
    const {
      rentals,
      isLoading,
      errorMessage,
      successMessage,
      showDisburseModal,
      selectedTx,
      fetchData,
      openDisburseDialog,
      closeDisburseDialog,
      onInspectionCompleted,
      hubungiWhatsApp,
    } = useKelolaPesanan();

    return {
      rentals,
      isLoading,
      errorMessage,
      successMessage,
      showDisburseModal,
      selectedTx,
      fetchData,
      openDisburseDialog,
      closeDisburseDialog,
      onInspectionCompleted,
      hubungiWhatsApp,
    };
  },
};
</script>

<style scoped>
.kelola-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 80px 80px 80px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .kelola-container {
    padding: 24px 24px 60px 24px;
  }
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
  text-align: left;
}

@media (max-width: 600px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }
}

.title-meta-group {
  flex: 1;
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

/* Refresh Button styling */
.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-ink);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  flex-shrink: 0;
}

.refresh-btn:hover {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
}

.refresh-btn:active {
  transform: scale(0.98);
}

.refresh-icon {
  width: 14px;
  height: 14px;
}

/* Success alert card */
.alert-success-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 10px;
  color: var(--color-success);
  font-size: 13.5px;
  font-weight: 600;
  font-family: var(--font-sans);
  margin-bottom: 24px;
  text-align: left;
}

.alert-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Spinner State styling */
.status-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  text-align: center;
  color: var(--color-muted);
  gap: 16px;
}

.status-text {
  font-family: var(--font-sans);
  font-size: 14px;
}

.status-subtext {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-muted-soft);
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.4;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 36px;
  height: 36px;
}

.spinner .path {
  stroke: var(--color-ink);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.error-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.status-wrapper h3 {
  font-family: var(--font-sans);
  font-size: 18px;
  color: var(--color-ink);
  margin: 0;
  font-weight: 700;
}

.retry-btn {
  padding: 10px 20px;
  background: var(--color-ink);
  color: var(--color-canvas);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-sans);
  font-size: 13.5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
}

/* Empty State Card styling */
.empty-card-container {
  width: 100%;
}

.empty-state-box {
  background: var(--color-surface-soft);
  border: 1px dashed var(--color-hairline);
  border-radius: 16px;
  padding: 56px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon-wrapper {
  color: var(--color-muted-soft);
  margin-bottom: 16px;
}

.empty-svg {
  width: 48px;
  height: 48px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  font-family: var(--font-sans);
}

.empty-subtitle {
  font-size: 14px;
  color: var(--color-muted);
  max-width: 380px;
  margin: 8px 0 0 0;
  line-height: 1.5;
  font-family: var(--font-sans);
}

.kelola-content-layout {
  width: 100%;
}
</style>
