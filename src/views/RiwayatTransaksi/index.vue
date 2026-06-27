<template>
  <PageWrapper class="container py-lg">
    <div class="header-section text-left mb-xl">
      <h1 class="display-sm text-ink font-bold">Riwayat Transaksi</h1>
      <p class="body-md text-muted mt-xxs">Kelola dan pantau semua transaksi penyewaan barang Anda di SewaKi</p>
    </div>

    <!-- Loading State -->
    <BaseSpinner v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="errorMessage" class="text-center py-xl">
      <h3 class="title-sm text-error">Gagal Memuat Riwayat</h3>
      <p class="body-md text-muted mt-sm mb-md">{{ errorMessage }}</p>
      <BaseButton variant="primary" @click="fetchTransactions">Coba Lagi</BaseButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="transactions.length === 0" class="text-center py-xl bg-surface-soft border border-dashed border-hairline rounded-lg">
      <div class="text-[40px] mb-sm">🗂️</div>
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
        @expired="handleTransactionExpired"
        @dispute="openDisputeModal"
      />
    </div>

    <!-- Dispute Complaint Modal -->
    <DisputeModal
      :show="showDisputeModal"
      :transaction="selectedDisputeTx"
      :isLoading="isSubmittingDispute"
      @close="closeDisputeModal"
      @submit="handleDisputeSubmit"
    />

    <!-- Return Proof Modal -->
    <BaseModal :show="showReturnModal" @close="closeReturnModal">
      <template #header>
        <h3 class="title-sm text-ink">Bukti Pengembalian Barang</h3>
      </template>

      <div class="p-sm text-left flex flex-col gap-sm">
        <p class="body-sm text-muted">
          Silakan unggah foto bukti bahwa barang telah dikembalikan (misalnya foto resi pengiriman atau foto serah terima barang).
        </p>

        <div v-if="uploadError" class="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-error rounded-md text-[13px] p-sm mb-xs">{{ uploadError }}</div>

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

        <div v-if="reviewError" class="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-error rounded-md text-[13px] p-sm mb-xs">{{ reviewError }}</div>

        <div class="form-group flex flex-col gap-xxs">
          <label class="font-sans text-[14px] font-medium text-ink block">Pilih Rating</label>
          <div class="stars-container flex gap-xs">
            <span 
              v-for="star in 5" 
              :key="star" 
              class="star-item cursor-pointer text-xl"
              :class="{ 'text-warning': star <= reviewRating, 'text-hairline': star > reviewRating }"
              @click="reviewRating = star"
            >
              ★
            </span>
          </div>
        </div>

        <div class="form-group flex flex-col gap-xxs">
          <label for="review_comment" class="font-sans text-[14px] font-medium text-ink block">Komentar / Ulasan</label>
          <textarea 
            id="review_comment" 
            v-model="reviewComment" 
            placeholder="Ceritakan pengalaman Anda menyewa barang ini..." 
            rows="4"
            class="w-full p-sm border border-hairline rounded-md bg-canvas text-ink font-sans text-[14px] outline-none box-border resize-y focus:border-primary"
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
import DisputeModal from '../../components/ui/DisputeModal.vue';
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
    DisputeModal,
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
      showDisputeModal,
      selectedDisputeTx,
      isSubmittingDispute,
      openDisputeModal,
      closeDisputeModal,
      handleDisputeSubmit,
      isReviewed,
      openReviewModal,
      closeReviewModal,
      submitReview,
      openReturnModal,
      closeReturnModal,
      handleFileChange,
      handleUploadProof,
      handleTransactionExpired,
      fetchTransactions,
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
      showDisputeModal,
      selectedDisputeTx,
      isSubmittingDispute,
      openDisputeModal,
      closeDisputeModal,
      handleDisputeSubmit,
      localFile,
      isReviewed,
      openReviewModal,
      closeReviewModal,
      submitReview,
      openReturnModal,
      closeReturnModal,
      handleUploadProof,
      handleTransactionExpired,
      fetchTransactions,
    };
  },
};
</script>
