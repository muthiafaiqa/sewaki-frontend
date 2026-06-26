<template>
  <div class="profile-container">
    <BaseSpinner v-if="isLoading || redirecting" class="status-spinner-center" />

    <!-- Error State -->
    <div v-else-if="errorMessage && !redirecting" class="status-wrapper error-wrapper">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Terjadi Kesalahan</h3>
      <p class="status-subtext">{{ errorMessage }}</p>
      <BaseButton variant="primary" class="retry-btn mt-md" @click="fetchProfile">Coba Lagi</BaseButton>
    </div>

    <!-- Main Content -->
    <div v-else-if="user" class="profile-content-layout">
      <!-- Title Header Section -->
      <header class="profile-page-header">
        <h1 class="page-title">Pengaturan Akun</h1>
        <p class="page-subtitle">Kelola detail profil, verifikasi KYC, dan rekening default Anda</p>
      </header>

      <div class="settings-box">
        <ProfileHeader 
          :name="user.name" 
          :role="user.role" 
          :roleLabel="roleLabel" 
        />

        <hr class="section-divider" />

        <ProfileForm 
          :email="user.email" 
          :userId="user.id" 
        />

        <hr class="section-divider" />

        <!-- Lokasi & Alamat Section -->
        <div class="location-section text-left">
          <h3 class="section-title-sm">Lokasi & Alamat</h3>
          <p class="section-desc-sm">Atur koordinat GPS dan alamat lengkap Anda untuk mempermudah pengiriman barang.</p>
          
          <div class="form-inputs-stack mt-md">
            <BaseInput
              id="profileAddress"
              label="Alamat Lengkap"
              v-model="alamatInput"
              placeholder="Contoh: Jl. Jend. Sudirman No. 21, Jakarta Pusat"
              heightClass="h-[52px]"
            />

            <div class="coords-row">
              <div class="coord-col">
                <BaseInput
                  id="profileLat"
                  label="Latitude"
                  :modelValue="user.latitude || ''"
                  disabled
                  placeholder="Belum diset"
                  heightClass="h-[52px]"
                />
              </div>
              <div class="coord-col">
                <BaseInput
                  id="profileLon"
                  label="Longitude"
                  :modelValue="user.longitude || ''"
                  disabled
                  placeholder="Belum diset"
                  heightClass="h-[52px]"
                />
              </div>
            </div>

            <div class="location-actions-stack">
              <button 
                type="button" 
                class="btn-gps" 
                :disabled="locationLoading" 
                @click="fetchGpsLocation"
              >
                <span v-if="locationLoading">Mendapatkan Lokasi...</span>
                <span v-else>📍 Gunakan Lokasi GPS Saat Ini</span>
              </button>

              <button 
                type="button" 
                class="btn-save-loc" 
                :disabled="locationLoading" 
                @click="saveLocation"
              >
                Simpan Alamat & Lokasi
              </button>
            </div>

            <!-- Status Alert Messages -->
            <div v-if="locationSuccessMessage" class="alert-success-msg">
              {{ locationSuccessMessage }}
            </div>
            <div v-if="locationErrorMessage" class="alert-error-msg">
              {{ locationErrorMessage }}
            </div>
          </div>
        </div>

        <hr class="section-divider" />

        <BankAccountForm />

        <hr class="section-divider" />

        <KYCSection 
          :status="kycStatus" 
          :loading="uploadProgress" 
          :error="kycErrorMessage" 
          :success="kycSuccessMessage" 
          @upload="handleUploadKtp"
        />

        <hr class="section-divider" />

        <button class="logout-btn" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="logout-icon">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Keluar dari Akun
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import BaseInput from '../../components/ui/BaseInput.vue';
import ProfileHeader from './components/ProfileHeader.vue';
import ProfileForm from './components/ProfileForm.vue';
import BankAccountForm from './components/BankAccountForm.vue';
import KYCSection from './components/KYCSection.vue';
import useProfile from './composables/useProfile';

export default {
  name: 'ProfileView',
  components: {
    BaseSpinner,
    BaseButton,
    BaseInput,
    ProfileHeader,
    ProfileForm,
    BankAccountForm,
    KYCSection,
  },
  setup() {
    const router = useRouter();
    const alamatInput = ref('');

    const {
      user,
      isLoading,
      errorMessage,
      redirecting,
      kycStatus,
      uploadProgress,
      kycErrorMessage,
      kycSuccessMessage,
      locationLoading,
      locationSuccessMessage,
      locationErrorMessage,
      roleLabel,
      handleUploadKtp,
      handleLogout,
      fetchProfile,
      updateUserLocation,
    } = useProfile(router);

    // Watch user changes to initialize alamatInput
    watch(() => user.value, (newUser) => {
      if (newUser && newUser.alamat_lengkap) {
        alamatInput.value = newUser.alamat_lengkap;
      }
    }, { immediate: true });

    const fetchGpsLocation = () => {
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung oleh browser Anda.');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          await updateUserLocation(lat, lon, alamatInput.value);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errMsg = 'Gagal mengambil lokasi GPS Anda.';
          if (error.code === error.PERMISSION_DENIED) {
            errMsg = 'Izin lokasi ditolak oleh pengguna/browser.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errMsg = 'Informasi lokasi tidak tersedia.';
          } else if (error.code === error.TIMEOUT) {
            errMsg = 'Waktu permintaan lokasi habis.';
          }
          alert(errMsg);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    const saveLocation = async () => {
      const lat = user.value?.latitude || 0;
      const lon = user.value?.longitude || 0;
      await updateUserLocation(lat, lon, alamatInput.value);
    };

    return {
      user,
      isLoading,
      errorMessage,
      redirecting,
      kycStatus,
      uploadProgress,
      kycErrorMessage,
      kycSuccessMessage,
      locationLoading,
      locationSuccessMessage,
      locationErrorMessage,
      roleLabel,
      alamatInput,
      handleUploadKtp,
      handleLogout,
      fetchProfile,
      fetchGpsLocation,
      saveLocation,
    };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px 80px 24px;
  box-sizing: border-box;
}

/* Page Header */
.profile-page-header {
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

/* Box Card settings container */
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

/* Logout Button */
.logout-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.06);
  border-color: #ef4444;
}

.logout-btn:active {
  transform: scale(0.99);
}

.logout-icon {
  width: 15px;
  height: 15px;
}

/* Status wrapper styling */
.status-spinner-center {
  margin: 80px auto;
}

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

.status-subtext {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-muted-soft);
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.4;
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

/* Location Section Styling */
.location-section {
  width: 100%;
}

.section-title-sm {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  font-family: var(--font-sans);
}

.section-desc-sm {
  font-size: 12.5px;
  color: var(--color-muted);
  margin: 4px 0 16px 0;
  line-height: 1.4;
  font-family: var(--font-sans);
}

.form-inputs-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coords-row {
  display: flex;
  gap: 16px;
}

.coord-col {
  flex: 1;
}

.location-actions-stack {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .coords-row {
    flex-direction: column;
    gap: 16px;
  }
  .location-actions-stack {
    flex-direction: column;
  }
}

.btn-gps {
  flex: 1;
  padding: 12px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-gps:hover {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
  color: var(--color-ink);
}

.btn-gps:active {
  transform: scale(0.99);
}

.btn-gps:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-save-loc {
  flex: 1;
  padding: 12px;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-on-primary);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-save-loc:hover {
  background: var(--color-primary-active);
  border-color: var(--color-primary-active);
}

.btn-save-loc:active {
  transform: scale(0.99);
}

.btn-save-loc:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-success-msg {
  padding: 12px;
  background-color: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #16a34a;
  font-size: 13px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-sans);
  text-align: left;
}

.alert-error-msg {
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  font-size: 13px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-sans);
  text-align: left;
}
</style>
