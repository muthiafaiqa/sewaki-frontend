<template>
  <div class="kyc-section-container text-left">
    <h3 class="kyc-title">Verifikasi Identitas (KYC)</h3>

    <!-- Verified Status Banner -->
    <div v-if="status === 'verified'" class="kyc-banner verified">
      <div class="banner-flex">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="banner-icon icon-success">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <div class="banner-text">
          <h4 class="banner-title text-success-title">Status: Terverifikasi</h4>
          <p class="banner-subtitle">Akun Anda sudah terverifikasi KYC. Anda bebas melakukan transaksi sewa & tambah barang.</p>
        </div>
      </div>
    </div>

    <!-- Pending Status Banner -->
    <div v-else-if="status === 'pending'" class="kyc-banner pending">
      <div class="banner-flex">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="banner-icon icon-warning">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div class="banner-text">
          <h4 class="banner-title text-warning-title">Status: Menunggu Persetujuan</h4>
          <p class="banner-subtitle">Dokumen KTP Anda sedang ditinjau oleh Admin. Proses ini biasanya memerlukan waktu beberapa jam.</p>
        </div>
      </div>
    </div>

    <!-- Unverified / Form Upload -->
    <div v-else class="kyc-upload-container">
      <p class="kyc-intro-text">Unggah foto KTP Anda untuk memverifikasi identitas Anda agar bisa bertransaksi.</p>

      <div v-if="error" class="kyc-alert error-alert">{{ error }}</div>
      <div v-if="success" class="kyc-alert success-alert">{{ success }}</div>

      <form @submit.prevent="handleSubmit" class="kyc-form-stack">
        <KTPUpload v-model="ktpFile" label="Foto KTP / Identitas Diri" />
        
        <button 
          type="submit" 
          :disabled="!ktpFile || loading" 
          class="btn-kyc-submit"
        >
          <span v-if="loading">Mengunggah...</span>
          <span v-else>Unggah KTP</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import KTPUpload from '../../Auth/register/components/KTPUpload.vue';

export default {
  name: 'KYCSection',
  components: {
    KTPUpload,
  },
  props: {
    status: {
      type: String,
      default: 'unverified',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    success: {
      type: String,
      default: '',
    },
  },
  emits: ['upload'],
  setup(props, { emit }) {
    const ktpFile = ref(null);

    const handleSubmit = () => {
      if (!ktpFile.value) return;
      emit('upload', ktpFile.value);
    };

    return {
      ktpFile,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.kyc-section-container {
  width: 100%;
}

.kyc-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 12px 0;
  font-family: var(--font-sans);
}

.kyc-intro-text {
  font-size: 13.5px;
  color: var(--color-muted);
  margin: 0 0 16px 0;
  line-height: 1.4;
  font-family: var(--font-sans);
}

/* Banner Styling */
.kyc-banner {
  padding: 16px;
  border-radius: 12px;
  box-sizing: border-box;
}

.kyc-banner.verified {
  background-color: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
}

.kyc-banner.pending {
  background-color: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
}

.banner-flex {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.banner-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.icon-success {
  color: #10b981;
}

.icon-warning {
  color: #f59e0b;
}

.banner-text {
  flex: 1;
  text-align: left;
}

.banner-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  font-family: var(--font-sans);
}

.text-success-title {
  color: #047857;
}

.text-warning-title {
  color: #b45309;
}

.banner-subtitle {
  font-size: 12px;
  color: var(--color-muted);
  margin: 3px 0 0 0;
  line-height: 1.4;
  font-family: var(--font-sans);
}

/* Alert Boxes */
.kyc-alert {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-sans);
  font-weight: 600;
  margin-bottom: 12px;
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

/* Form inputs & submit styling */
.kyc-form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-kyc-submit {
  width: 100%;
  padding: 12px;
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
}

.btn-kyc-submit:hover:not(:disabled) {
  background: #e00b41;
  transform: translateY(-1px);
}

.btn-kyc-submit:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn-kyc-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
