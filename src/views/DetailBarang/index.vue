<template>
  <div class="max-w-[1120px] mx-auto px-[24px] pt-[32px] pb-[80px] box-border">
    <!-- Back to catalog -->
    <div class="mb-[24px] text-left">
      <router-link to="/" class="inline-flex items-center gap-[8px] text-[14px] font-semibold text-muted no-underline transition-colors duration-150 ease-in-out font-sans hover:text-ink">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-[14px] h-[14px]">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Katalog
      </router-link>
    </div>

    <!-- Spinner State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[360px] text-center text-muted gap-[16px]">
      <BaseSpinner />
      <p class="font-sans text-[14px]">Memuat rincian barang...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage || !item" class="flex flex-col items-center justify-center min-h-[360px] text-center text-muted gap-[16px]">
      <div class="w-[56px] h-[56px] flex items-center justify-center rounded-full text-[#ef4444] bg-[rgba(239,68,68,0.08)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="font-sans text-[18px] color-ink font-bold m-0">Gagal Memuat Rincian</h3>
      <p class="font-sans text-[14px] text-muted-soft max-w-[320px] mx-auto leading-[1.4]">{{ errorMessage || 'Barang tidak ditemukan.' }}</p>
      <BaseButton variant="primary" class="py-[10px] px-[20px] bg-ink text-canvas border-none rounded-[6px] font-semibold font-sans text-[13.5px] cursor-pointer transition-opacity duration-200 hover:opacity-90 mt-md" @click="fetchItemDetails">
        Coba Lagi
      </BaseButton>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="flex flex-col">
      <!-- Title Section -->
      <header class="text-left mb-[28px]">
        <span class="text-[10px] font-bold uppercase tracking-[0.05em] text-[#ff385c] font-sans">{{ item.category || 'Barang Sewa' }}</span>
        <h1 class="text-[28px] font-extrabold text-ink mt-[4px] mr-0 mb-[6px] ml-0 tracking-[-0.02em] font-sans leading-[1.25]">{{ item.nama_barang || item.name }}</h1>
        <div class="flex items-center gap-[6px] text-[13.5px] font-medium text-muted font-sans">
          <span class="text-ink font-semibold">★ {{ averageRating }}</span>
          <span class="text-hairline">•</span>
          <span>{{ item.lokasi || item.location || 'Makassar' }}</span>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-[32px] md:gap-[48px]">
        <!-- Left Column: Media & Specifications -->
        <div class="flex flex-col gap-[28px]">
          <ItemGallery :foto="item.foto_barang" :alt="item.nama_barang || item.name" />
          
          <!-- Host Card placed Airbnb-style below gallery -->
          <div class="mb-[-8px]">
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
        <div class="relative order-first md:order-last">
          <div class="static md:sticky md:top-[96px] bg-white border border-hairline rounded-[16px] p-[24px] shadow-none md:shadow-[0_6px_16px_rgba(0,0,0,0.06)] text-left box-border">
            <div class="flex items-baseline gap-[4px] mb-[20px]">
              <span class="text-[22px] font-bold text-ink font-sans">{{ formatPrice(pricePerDay) }}</span>
              <span class="text-[13.5px] text-muted font-sans">/ hari</span>
            </div>
            
            <div class="border border-hairline rounded-[8px] mb-[20px] overflow-hidden">
              <div class="flex justify-between py-[12px] px-[16px] text-[13px] font-sans border-b border-hairline last:border-b-0">
                <span class="text-muted font-medium">Stok Tersedia</span>
                <span class="text-ink font-bold">{{ item.stok !== undefined ? item.stok : (item.stock || 1) }} unit</span>
              </div>
              <div class="flex justify-between py-[12px] px-[16px] text-[13px] font-sans border-b border-hairline last:border-b-0">
                <span class="text-muted font-medium">Jaminan Deposit</span>
                <span class="text-ink font-bold">{{ formatPrice(depositAmount) }}</span>
              </div>
            </div>

            <button class="w-full p-[14px] bg-[#ff385c] text-white border-none rounded-[8px] text-[14.5px] font-bold font-sans cursor-pointer transition-all duration-150 ease-in-out text-center shadow-[0_2px_8px_rgba(255,56,92,0.15)] hover:bg-[#e00b41] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]" @click="showModal = true">
              Pinjam Barang Ini Sekarang
            </button>
            
            <p class="text-[11.5px] text-muted-soft text-center mt-[12px] mr-0 mb-0 ml-0 leading-[1.4] font-sans">Refund deposit jaminan diproses otomatis setelah masa sewa berakhir.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Confirmation Modal -->
    <BookingForm
      :show="showModal"
      :userProfile="currentUser"
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
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
import ItemGallery from './components/ItemGallery.vue';
import ItemInfo from './components/ItemInfo.vue';
import BookingForm from './components/BookingForm.vue';
import OwnerCard from './components/OwnerCard.vue';
import useDetailBarang from './composables/useDetailBarang';

export default {
  name: 'DetailBarangView',
  components: {
    BaseButton,
    BaseSpinner,
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
