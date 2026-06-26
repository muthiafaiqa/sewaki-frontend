<template>
  <PageWrapper class="container py-lg">
    <div class="header-section text-left mb-xl">
      <h1 class="display-sm text-ink font-bold">Riwayat Transaksi</h1>
      <p class="body-md text-muted mt-xxs">Kelola dan pantau semua transaksi penyewaan barang Anda di SewaKi</p>
    </div>

    <!-- Loading State -->
    <BaseSpinner v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="errorMessage" class="error-wrapper text-center py-xl">
      <h3 class="title-sm text-error">Gagal Memuat Riwayat</h3>
      <p class="body-md text-muted mt-sm mb-md">{{ errorMessage }}</p>
      <BaseButton variant="primary" @click="fetchTransactions">Coba Lagi</BaseButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="transactions.length === 0" class="empty-wrapper text-center py-xl">
      <div class="empty-icon mb-sm">🗂️</div>
      <h3 class="title-sm text-ink font-bold">Belum Ada Transaksi</h3>
      <p class="body-md text-muted mt-xxs mb-md">Anda belum pernah melakukan transaksi penyewaan barang apapun.</p>
      <BaseButton variant="primary" @click="$router.push('/')">Mulai Sewa Sekarang</BaseButton>
    </div>

    <!-- Content State -->
    <div v-else class="transactions-list flex flex-col gap-lg">
      <TransaksiCard
        v-for="tx in transactions"
        :key="tx.id"
        :tx="tx"
        :isReviewed="isReviewed(tx.id)"
        @return="openReturnModal"
        @review="openReviewModal"
      />
    </div>

    <!-- Return Proof Modal -->
    <BaseModal :show="showReturnModal" @close="closeReturnModal">
      <template #header>
        <h3 class="title-sm text-ink">Bukti Pengembalian Barang</h3>
      </template>

      <div class="p-sm text-left flex flex-col gap-sm">
        <p class="body-sm text-muted">
          Silakan unggah foto bukti bahwa barang telah dikembalikan (misalnya foto resi pengiriman atau foto serah terima barang).
        </p>

        <div v-if="uploadError" class="alert-error p-sm mb-xs">{{ uploadError }}</div>

        <KTPUpload v-model="localFile" label="Pilih Foto Bukti" />
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="closeReturnModal" :disabled="uploadLoading">
          Batal
        </BaseButton>
        <BaseButton 
          variant="primary" 
          :disabled="uploadLoading || !localFile" 
          :loading="uploadLoading"
          @click="handleUploadProof"
        >
          Kirim Bukti & Kembalikan
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Write Review Modal -->
    <BaseModal :show="showReviewModal" @close="closeReviewModal">
      <template #header>
        <h3 class="title-sm text-ink">Beri Ulasan Barang</h3>
      </template>

      <div class="p-sm text-left flex flex-col gap-sm">
        <h4 class="font-semibold text-ink body-md">{{ reviewTx?.item?.nama_barang || 'Barang' }}</h4>

        <div v-if="reviewError" class="alert-error p-sm mb-xs">{{ reviewError }}</div>

        <div class="form-group flex flex-col gap-xxs">
          <label class="input-label">Pilih Rating</label>
          <div class="stars-container flex gap-xs">
            <span 
              v-for="star in 5" 
              :key="star" 
              class="star-item cursor-pointer text-xl"
              :class="{ 'text-yellow': star <= reviewRating, 'text-muted': star > reviewRating }"
              @click="reviewRating = star"
            >
              ★
            </span>
          </div>
        </div>

        <div class="form-group flex flex-col gap-xxs">
          <label for="review_comment" class="input-label">Komentar / Ulasan</label>
          <textarea 
            id="review_comment" 
            v-model="reviewComment" 
            placeholder="Ceritakan pengalaman Anda menyewa barang ini..." 
            rows="4"
            class="textarea-custom"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="closeReviewModal" :disabled="isSubmittingReview">
          Batal
        </BaseButton>
        <BaseButton 
          variant="primary" 
          :disabled="isSubmittingReview" 
          :loading="isSubmittingReview"
          @click="submitReview"
        >
          Kirim Ulasan
        </BaseButton>
      </template>
    </BaseModal>
  </PageWrapper>
</template>

<script>
import { ref, watch } from 'vue';
import PageWrapper from '../../components/layout/PageWrapper.vue';
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import BaseModal from '../../components/ui/BaseModal.vue';
import KTPUpload from '../Auth/register/components/KTPUpload.vue';
import TransaksiCard from './components/TransaksiCard.vue';
import useRiwayat from './composables/useRiwayat';

export default {
  name: 'RiwayatTransaksiView',
  components: {
    PageWrapper,
    BaseSpinner,
    BaseButton,
    BaseModal,
    KTPUpload,
    TransaksiCard,
  },
  setup() {
    const localFile = ref(null);

    const {
      transactions,
      isLoading,
      errorMessage,
      showReturnModal,
      uploadLoading,
      uploadError,
      showReviewModal,
      reviewRating,
      reviewComment,
      reviewTx,
      isSubmittingReview,
      reviewError,
      isReviewed,
      openReviewModal,
      closeReviewModal,
      submitReview,
      openReturnModal,
      closeReturnModal,
      handleFileChange,
      handleUploadProof,
    } = useRiwayat();

    watch(localFile, (val) => {
      handleFileChange(val);
    });

    return {
      transactions,
      isLoading,
      errorMessage,
      showReturnModal,
      uploadLoading,
      uploadError,
      showReviewModal,
      reviewRating,
      reviewComment,
      reviewTx,
      isSubmittingReview,
      reviewError,
      localFile,
      isReviewed,
      openReviewModal,
      closeReviewModal,
      submitReview,
      openReturnModal,
      closeReturnModal,
      handleUploadProof,
    };
  },
};
</script>

<style scoped>
.empty-wrapper {
  background-color: var(--color-surface-soft);
  border: 1px dashed var(--color-hairline);
  border-radius: var(--rounded-lg);
}

.empty-icon {
  font-size: 40px;
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--color-error);
  border-radius: var(--rounded-md);
  font-size: 13px;
}

.text-yellow {
  color: var(--color-warning);
}

.text-muted {
  color: var(--color-hairline);
}

.textarea-custom {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
}

.textarea-custom:focus {
  border-color: var(--color-primary);
}

.input-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  display: block;
}
</style>
