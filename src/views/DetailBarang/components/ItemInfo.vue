<template>
  <div class="item-info-container text-left">
    <!-- Specifications / Metadata blocks -->
    <div class="specs-card-grid">
      <!-- Location Block -->
      <div class="spec-card">
        <div class="spec-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spec-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="spec-text">
          <span class="spec-label">Lokasi Pengambilan</span>
          <span class="spec-value">{{ item.lokasi || item.location || 'Makassar' }}</span>
        </div>
      </div>

      <!-- Stock Block -->
      <div class="spec-card">
        <div class="spec-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spec-icon">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
        </div>
        <div class="spec-text">
          <span class="spec-label">Stok Tersedia</span>
          <span class="spec-value">{{ item.stok !== undefined ? item.stok : (item.stock || 1) }} unit</span>
        </div>
      </div>

      <!-- Deposit Block -->
      <div class="spec-card">
        <div class="spec-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spec-icon">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <line x1="12" y1="4" x2="12" y2="20"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
        </div>
        <div class="spec-text">
          <span class="spec-label">Uang Jaminan</span>
          <span class="spec-value">{{ formatPrice(item.deposit) }}</span>
        </div>
      </div>
    </div>

    <hr class="section-divider" />

    <!-- Description Section -->
    <div class="description-section">
      <h3 class="section-title">Deskripsi Barang</h3>
      <p class="description-text">{{ item.deskripsi || item.description || 'Tidak ada deskripsi untuk barang ini.' }}</p>
    </div>

    <hr class="section-divider" />

    <!-- Reviews Section -->
    <div class="reviews-section">
      <h3 class="section-title mb-sm">Ulasan Penyewa</h3>

      <!-- Review Form for eligible users -->
      <div v-if="pendingReview" class="write-review-card mb-md">
        <h4 class="write-review-title">Tulis Ulasan Anda</h4>
        <p class="write-review-subtitle">Anda telah menyelesaikan penyewaan barang ini. Silakan berikan ulasan Anda!</p>
        
        <div class="rating-selector-wrapper">
          <span class="selector-label">Rating:</span>
          <div class="rating-stars-select">
            <span 
              v-for="star in 5" 
              :key="star" 
              class="select-star" 
              :class="{ filled: star <= rating }"
              @click="$emit('update:rating', star)"
            >★</span>
          </div>
        </div>

        <div class="comment-input-wrapper">
          <textarea
            :value="comment"
            @input="$emit('update:comment', $event.target.value)"
            class="review-textarea"
            placeholder="Tuliskan ulasan lengkap Anda di sini..."
            rows="3"
          ></textarea>
        </div>

        <div class="review-submit-wrapper mt-sm">
          <button 
            type="button" 
            class="btn-submit-review" 
            :disabled="isSubmittingReview"
            @click="$emit('submit-review')"
          >
            <span v-if="isSubmittingReview">Mengirim...</span>
            <span v-else>Kirim Ulasan</span>
          </button>
        </div>

        <div v-if="reviewSuccessMessage" class="alert-success-msg mt-sm">{{ reviewSuccessMessage }}</div>
        <div v-if="reviewError" class="alert-error-msg mt-sm">{{ reviewError }}</div>
      </div>
      
      <div v-if="reviews.length === 0" class="empty-reviews">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-reviews-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Belum ada ulasan untuk barang ini.</span>
      </div>
      
      <div v-else class="reviews-list">
        <div v-for="rev in reviews" :key="rev.id" class="review-card">
          <div class="review-header">
            <div class="reviewer-avatar">
              {{ getAvatarInitials(rev.penyewa_id) }}
            </div>
            <div class="reviewer-meta">
              <span class="reviewer-name">Penyewa #{{ rev.penyewa_id.slice(0, 8) }}</span>
              <span class="review-date">{{ formatDate(rev.createdAt) }}</span>
            </div>
            <div class="review-stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rev.rating }">★</span>
            </div>
          </div>
          <p class="review-comment">{{ rev.komentar || 'Tidak ada komentar.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemInfo',
  props: {
    item: {
      type: Object,
      required: true,
    },
    reviews: {
      type: Array,
      default: () => [],
    },
    pendingReview: {
      type: Object,
      default: null,
    },
    isSubmittingReview: {
      type: Boolean,
      default: false,
    },
    reviewError: {
      type: String,
      default: '',
    },
    reviewSuccessMessage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  emits: ['update:rating', 'update:comment', 'submit-review'],
  setup() {
    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Hubungi Pemilik';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    const getAvatarInitials = (id) => {
      if (!id) return 'P';
      return id.slice(0, 2).toUpperCase();
    };

    return {
      formatPrice,
      formatDate,
      getAvatarInitials,
    };
  },
};
</script>

<style scoped>
.item-info-container {
  width: 100%;
}

.section-divider {
  border: 0;
  border-top: 1px solid var(--color-hairline);
  margin: 28px 0;
}

/* Specifications Grid */
.specs-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 600px) {
  .specs-card-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.spec-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-hairline-soft);
  border-radius: 12px;
}

.spec-icon-wrapper {
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.spec-icon {
  width: 20px;
  height: 20px;
}

.spec-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.spec-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-sans);
}

.spec-value {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-ink);
  margin-top: 1px;
  font-family: var(--font-sans);
}

/* Description Section */
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 12px 0;
  font-family: var(--font-sans);
}

.description-text {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--color-body);
  margin: 0;
  font-family: var(--font-sans);
}

/* Reviews Styling */
.empty-reviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--color-muted-soft);
  font-size: 13px;
  font-family: var(--font-sans);
  font-weight: 500;
}

.empty-reviews-icon {
  width: 28px;
  height: 28px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  padding: 16px;
  border: 1px solid var(--color-hairline-soft);
  border-radius: 12px;
  background: #ffffff;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-surface-strong);
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-sans);
  flex-shrink: 0;
}

.reviewer-meta {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1;
}

.reviewer-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.review-date {
  font-size: 11px;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.review-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  color: var(--color-hairline);
}

.star.filled {
  color: #fb923c;
}

.review-comment {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--color-body);
  margin: 0;
  padding-left: 48px; /* Align with content beside avatar */
  text-align: left;
  font-family: var(--font-sans);
}

/* Write Review Form Styling */
.write-review-card {
  padding: 20px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: left;
}

.write-review-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  font-family: var(--font-sans);
}

.write-review-subtitle {
  font-size: 12px;
  color: var(--color-muted);
  margin: 4px 0 16px 0;
  font-family: var(--font-sans);
  line-height: 1.4;
}

.rating-selector-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.selector-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.rating-stars-select {
  display: flex;
  gap: 4px;
}

.select-star {
  font-size: 20px;
  color: var(--color-hairline);
  cursor: pointer;
  transition: all 0.15s ease;
}

.select-star.filled {
  color: #fb923c;
}

.select-star:hover {
  transform: scale(1.1);
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  font-size: 13.5px;
  font-family: var(--font-sans);
  outline: none;
  resize: vertical;
  box-sizing: border-box;
  background-color: var(--color-canvas);
  color: var(--color-ink);
  transition: border-color 0.15s ease;
}

.review-textarea:focus {
  border-color: var(--color-ink);
}

.btn-submit-review {
  padding: 10px 20px;
  background: var(--color-ink);
  color: var(--color-canvas);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-family: var(--font-sans);
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit-review:hover {
  opacity: 0.9;
}

.btn-submit-review:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert-success-msg {
  padding: 10px 12px;
  background-color: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #16a34a;
  font-size: 12.5px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-sans);
}

.alert-error-msg {
  padding: 10px 12px;
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  font-size: 12.5px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-sans);
}

@media (max-width: 480px) {
  .review-comment {
    padding-left: 0;
  }
}
</style>
