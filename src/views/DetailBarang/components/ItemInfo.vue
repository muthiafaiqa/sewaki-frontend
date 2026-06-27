<template>
  <div class="w-full text-left">
    <!-- Specifications / Metadata blocks -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-[12px] sm:gap-[16px]">
      <!-- Location Block -->
      <div class="flex items-center gap-[12px] p-[16px] bg-surface-soft border border-hairline-soft rounded-[12px]">
        <div class="text-muted flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-muted uppercase tracking-[0.05em] font-sans">Lokasi Pengambilan</span>
          <span class="text-[13.5px] font-bold text-ink mt-[1px] font-sans">{{ item.lokasi || item.location || 'Makassar' }}</span>
        </div>
      </div>

      <!-- Stock Block -->
      <div class="flex items-center gap-[12px] p-[16px] bg-surface-soft border border-hairline-soft rounded-[12px]">
        <div class="text-muted flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-muted uppercase tracking-[0.05em] font-sans">Stok Tersedia</span>
          <span class="text-[13.5px] font-bold text-ink mt-[1px] font-sans">{{ item.stok !== undefined ? item.stok : (item.stock || 1) }} unit</span>
        </div>
      </div>

      <!-- Deposit Block -->
      <div class="flex items-center gap-[12px] p-[16px] bg-surface-soft border border-hairline-soft rounded-[12px]">
        <div class="text-muted flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <line x1="12" y1="4" x2="12" y2="20"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-muted uppercase tracking-[0.05em] font-sans">Uang Jaminan</span>
          <span class="text-[13.5px] font-bold text-ink mt-[1px] font-sans">{{ formatPrice(item.deposit) }}</span>
        </div>
      </div>
    </div>

    <hr class="border-0 border-t border-hairline my-[28px]" />

    <!-- Description Section -->
    <div class="text-left">
      <h3 class="text-[18px] font-bold text-ink mb-[12px] font-sans">Deskripsi Barang</h3>
      <p class="text-[14.5px] leading-[1.6] text-body m-0 font-sans">{{ item.deskripsi || item.description || 'Tidak ada deskripsi untuk barang ini.' }}</p>
    </div>

    <hr class="border-0 border-t border-hairline my-[28px]" />

    <!-- Reviews Section -->
    <div class="text-left">
      <h3 class="text-[18px] font-bold text-ink mb-[12px] font-sans mb-sm">Ulasan Penyewa</h3>

      <!-- Review Form for eligible users -->
      <div v-if="pendingReview" class="p-[20px] bg-surface-soft border border-hairline rounded-[12px] mb-[24px] text-left mb-md">
        <h4 class="text-[15px] font-bold text-ink m-0 font-sans">Tulis Ulasan Anda</h4>
        <p class="text-[12px] text-muted mt-[4px] mr-0 mb-[16px] ml-0 font-sans leading-[1.4]">Anda telah menyelesaikan penyewaan barang ini. Silakan berikan ulasan Anda!</p>
        
        <div class="flex items-center gap-[8px] mb-[12px]">
          <span class="text-[13px] font-semibold text-ink font-sans">Rating:</span>
          <div class="flex gap-[4px]">
            <span 
              v-for="star in 5" 
              :key="star" 
              class="text-[20px] cursor-pointer transition-transform duration-150 ease-in-out hover:scale-[1.1]" 
              :class="{ 'text-[#fb923c]': star <= rating, 'text-hairline': star > rating }"
              @click="$emit('update:rating', star)"
            >★</span>
          </div>
        </div>

        <div class="w-full">
          <textarea
            :value="comment"
            @input="$emit('update:comment', $event.target.value)"
            class="w-full p-[12px] border border-hairline rounded-[8px] text-[13.5px] font-sans outline-none resize-y box-border bg-canvas text-ink transition-colors duration-150 ease-in-out focus:border-ink"
            placeholder="Tuliskan ulasan lengkap Anda di sini..."
            rows="3"
          ></textarea>
        </div>

        <div class="flex justify-start mt-sm">
          <button 
            type="button" 
            class="py-[10px] px-[20px] bg-ink text-canvas border-none rounded-[8px] font-semibold font-sans text-[13px] cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" 
            :disabled="isSubmittingReview"
            @click="$emit('submit-review')"
          >
            <span v-if="isSubmittingReview">Mengirim...</span>
            <span v-else>Kirim Ulasan</span>
          </button>
        </div>

        <div v-if="reviewSuccessMessage" class="p-[10px_12px] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] text-[#16a34a] text-[12.5px] rounded-[6px] font-semibold font-sans mt-sm">{{ reviewSuccessMessage }}</div>
        <div v-if="reviewError" class="p-[10px_12px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-[#dc2626] text-[12.5px] rounded-[6px] font-semibold font-sans mt-sm">{{ reviewError }}</div>
      </div>
      
      <div v-if="reviews.length === 0" class="flex flex-col items-center gap-[8px] py-[32px] px-[16px] text-muted-soft text-[13px] font-sans font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[28px] h-[28px]">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Belum ada ulasan untuk barang ini.</span>
      </div>
      
      <div v-else class="flex flex-col gap-[16px]">
        <div v-for="rev in reviews" :key="rev.id" class="p-[16px] border border-hairline-soft rounded-[12px] bg-white">
          <div class="flex items-center gap-[12px] mb-[10px]">
            <div class="w-[36px] h-[36px] rounded-full bg-surface-strong text-ink flex items-center justify-center text-[12px] font-bold font-sans shrink-0">
              {{ getAvatarInitials(rev.penyewa_id) }}
            </div>
            <div class="flex flex-col text-left flex-1">
              <span class="text-[13.5px] font-bold text-ink font-sans">Penyewa #{{ rev.penyewa_id.slice(0, 8) }}</span>
              <span class="text-[11px] text-muted font-sans">{{ formatDate(rev.createdAt) }}</span>
            </div>
            <div class="flex gap-[2px]">
              <span v-for="star in 5" :key="star" class="text-[12px]" :class="{ 'text-[#fb923c]': star <= rev.rating, 'text-hairline': star > rev.rating }">★</span>
            </div>
          </div>
          <p class="text-[13.5px] leading-[1.5] text-body m-0 pl-0 sm:pl-[48px] text-left font-sans">{{ rev.komentar || 'Tidak ada komentar.' }}</p>
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
