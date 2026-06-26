<template>
  <div class="detail-container">
    <!-- Back to catalog -->
    <div class="back-nav-wrapper">
      <router-link to="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="arrow-icon">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Katalog
      </router-link>
    </div>

    <!-- Spinner State -->
    <div v-if="isLoading" class="status-wrapper">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <p class="status-text">Memuat rincian barang...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage || !item" class="status-wrapper error-wrapper">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Gagal Memuat Rincian</h3>
      <p class="status-subtext">{{ errorMessage || 'Barang tidak ditemukan.' }}</p>
      <BaseButton variant="primary" class="retry-btn mt-md" @click="fetchItemDetails">
        Coba Lagi
      </BaseButton>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="detail-content-layout">
      <!-- Title Section -->
      <header class="detail-header">
        <span class="category-tag-header">{{ item.category || 'Barang Sewa' }}</span>
        <h1 class="item-main-title">{{ item.nama_barang || item.name }}</h1>
        <div class="item-quick-meta">
          <span class="meta-rating">★ {{ averageRating }}</span>
          <span class="meta-divider">•</span>
          <span class="meta-location">{{ item.lokasi || item.location || 'Makassar' }}</span>
        </div>
      </header>

      <div class="detail-grid">
        <!-- Left Column: Media & Specifications -->
        <div class="left-column">
          <ItemGallery :foto="item.foto_barang" :alt="item.nama_barang || item.name" />
          
          <!-- Host Card placed Airbnb-style below gallery -->
          <div class="owner-section-wrapper">
            <OwnerCard :owner="item.Pemilik || item.pemilik || item.User || item.user" @chat="hubungiPemilik" />
          </div>

          <!-- Item Details (specifications & reviews) -->
          <ItemInfo 
            :item="item" 
            :reviews="reviews" 
            :pendingReview="pendingReviewTransaction"
            :isSubmittingReview="isSubmittingReview"
            :reviewError="reviewError"
            :reviewSuccessMessage="reviewSuccessMessage"
            v-model:rating="reviewRating"
            v-model:comment="reviewComment"
            @submit-review="submitReview"
          />
        </div>

        <!-- Right Column: Sticky Booking Widget Sidebar -->
        <div class="right-column">
          <div class="booking-sticky-card">
            <div class="booking-price-header">
              <span class="booking-price">{{ formatPrice(pricePerDay) }}</span>
              <span class="booking-period">/ hari</span>
            </div>
            
            <div class="booking-summary-specs">
              <div class="summary-row">
                <span class="summary-label">Stok Tersedia</span>
                <span class="summary-val">{{ item.stok !== undefined ? item.stok : (item.stock || 1) }} unit</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Jaminan Deposit</span>
                <span class="summary-val">{{ formatPrice(depositAmount) }}</span>
              </div>
            </div>

            <button class="booking-primary-btn" @click="showModal = true">
              Pinjam Barang Ini Sekarang
            </button>
            
            <p class="booking-card-subtext">Refund deposit jaminan diproses otomatis setelah masa sewa berakhir.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Confirmation Modal -->
    <BookingForm
      :show="showModal"
      :itemName="item?.nama_barang || item?.name"
      :todayStr="todayStr"
      :startDate="startDate"
      :endDate="endDate"
      :durationDays="durationDays"
      :pricePerDay="pricePerDay"
      :totalRent="totalRent"
      :depositAmount="depositAmount"
      :adminFee="adminFee"
      :grandTotal="grandTotal"
      :submitting="isSubmitting"
      @close="showModal = false"
      @update-dates="handleUpdateDates"
      @submit="handleBookingSubmit"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../../components/ui/BaseButton.vue';
import ItemGallery from './components/ItemGallery.vue';
import ItemInfo from './components/ItemInfo.vue';
import BookingForm from './components/BookingForm.vue';
import OwnerCard from './components/OwnerCard.vue';
import useDetailBarang from './composables/useDetailBarang';

export default {
  name: 'DetailBarangView',
  components: {
    BaseButton,
    ItemGallery,
    ItemInfo,
    BookingForm,
    OwnerCard,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const itemId = route.params.id;

    const {
      item,
      isLoading,
      errorMessage,
      reviews,
      showModal,
      isSubmitting,
      todayStr,
      startDate,
      endDate,
      bankDeposit,
      rekeningDeposit,
      namaRekeningDeposit,
      pricePerDay,
      depositAmount,
      durationDays,
      totalRent,
      adminFee,
      grandTotal,
      currentUser,
      pendingReviewTransaction,
      reviewRating,
      reviewComment,
      isSubmittingReview,
      reviewError,
      reviewSuccessMessage,
      submitReview,
      submitTransaction,
      hubungiPemilik,
      fetchItemDetails,
    } = useDetailBarang(itemId, router);

    const handleUpdateDates = (payload) => {
      startDate.value = payload.startDate;
      endDate.value = payload.endDate;
    };

    const handleBookingSubmit = (bankPayload) => {
      bankDeposit.value = bankPayload.bank;
      rekeningDeposit.value = bankPayload.rekening;
      namaRekeningDeposit.value = bankPayload.namaRekening;
      submitTransaction();
    };

    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Hubungi Pemilik';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const averageRating = computed(() => {
      if (!reviews.value || reviews.value.length === 0) return 'Baru';
      const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
      return (sum / reviews.value.length).toFixed(1);
    });

    return {
      item,
      isLoading,
      errorMessage,
      reviews,
      showModal,
      isSubmitting,
      todayStr,
      startDate,
      endDate,
      durationDays,
      pricePerDay,
      totalRent,
      depositAmount,
      adminFee,
      grandTotal,
      currentUser,
      pendingReviewTransaction,
      reviewRating,
      reviewComment,
      isSubmittingReview,
      reviewError,
      reviewSuccessMessage,
      submitReview,
      hubungiPemilik,
      fetchItemDetails,
      handleUpdateDates,
      handleBookingSubmit,
      formatPrice,
      averageRating,
    };
  },
};
</script>

<style scoped>
.detail-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 24px 80px 24px;
  box-sizing: border-box;
}

/* Back Link styling */
.back-nav-wrapper {
  margin-bottom: 24px;
  text-align: left;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.15s ease;
  font-family: var(--font-sans);
}

.back-link:hover {
  color: var(--color-ink);
}

.arrow-icon {
  width: 14px;
  height: 14px;
}

/* Header Section */
.detail-header {
  text-align: left;
  margin-bottom: 28px;
}

.category-tag-header {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ff385c;
  font-family: var(--font-sans);
}

.item-main-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-ink);
  margin: 4px 0 6px 0;
  letter-spacing: -0.02em;
  font-family: var(--font-sans);
  line-height: 1.25;
}

.item-quick-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.meta-rating {
  color: var(--color-ink);
  font-weight: 600;
}

.meta-divider {
  color: var(--color-hairline);
}

/* Split Grid */
.detail-content-layout {
  display: flex;
  flex-direction: column;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 48px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.right-column {
  position: relative;
}

/* Owner Section layout spacing */
.owner-section-wrapper {
  margin-bottom: -8px;
}

/* Sticky Booking Card */
.booking-sticky-card {
  position: sticky;
  top: 96px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  text-align: left;
  box-sizing: border-box;
}

.booking-price-header {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 20px;
}

.booking-price {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.booking-period {
  font-size: 13.5px;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.booking-summary-specs {
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 13px;
  font-family: var(--font-sans);
  border-bottom: 1px solid var(--color-hairline);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-label {
  color: var(--color-muted);
  font-weight: 500;
}

.summary-val {
  color: var(--color-ink);
  font-weight: 600;
}

.booking-primary-btn {
  width: 100%;
  padding: 14px;
  background: #ff385c;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14.5px;
  font-weight: 700;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 56, 92, 0.15);
}

.booking-primary-btn:hover {
  background: #e00b41;
  transform: translateY(-1px);
}

.booking-primary-btn:active {
  transform: translateY(0) scale(0.98);
}

.booking-card-subtext {
  font-size: 11.5px;
  color: var(--color-muted-soft);
  text-align: center;
  margin: 12px 0 0 0;
  line-height: 1.4;
  font-family: var(--font-sans);
}

/* Spinner State styling */
.status-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 360px;
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

/* Responsiveness */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .right-column {
    order: -1; /* Display booking card at top on mobile */
  }
  .booking-sticky-card {
    position: static;
    box-shadow: none;
    border: 1px solid var(--color-hairline);
  }
}
</style>
