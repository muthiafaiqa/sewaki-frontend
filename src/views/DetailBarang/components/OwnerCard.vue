<template>
  <div class="w-full p-[20px] bg-surface-soft border border-hairline rounded-[16px] box-border">
    <div class="flex items-center gap-[16px] flex-wrap">
      <!-- Avatar Section -->
      <div class="shrink-0">
        <div class="w-[44px] h-[44px] rounded-full bg-surface-strong text-ink flex items-center justify-center text-[15px] font-bold font-sans border-[1.5px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          {{ avatarInitial }}
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="flex-1 text-left min-w-[140px]">
        <h4 class="text-[15px] font-bold text-ink m-0 font-sans tracking-[-0.01em]">Dihosting oleh {{ ownerName }}</h4>
        <p class="text-[12.5px] text-muted mt-[2px] mr-0 mb-0 ml-0 font-sans">Pemilik Terverifikasi</p>
      </div>
 
      <!-- Action Section -->
      <button class="inline-flex items-center gap-[8px] py-[10px] px-[18px] bg-white border border-hairline rounded-[8px] text-[13px] font-semibold text-ink cursor-pointer transition-all duration-150 ease-in-out font-sans hover:bg-ink hover:text-white hover:border-ink active:scale-[0.98] w-full sm:w-auto sm:justify-start justify-center" @click="$emit('chat')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-[15px] h-[15px]">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        Hubungi Pemilik
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
 
export default {
  name: 'OwnerCard',
  props: {
    owner: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['chat'],
  setup(props) {
    const ownerName = computed(() => {
      return props.owner?.nama || props.owner?.name || 'Pemilik Barang';
    });
 
    const avatarInitial = computed(() => {
      return ownerName.value.charAt(0).toUpperCase();
    });
 
    return {
      ownerName,
      avatarInitial,
    };
  },
};
</script>
