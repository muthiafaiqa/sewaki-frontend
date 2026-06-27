<template>
  <div class="w-full py-[20px] px-[24px] bg-surface-soft border border-hairline rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-[28px] box-border">
    <div class="flex items-center gap-[16px] text-left">
      <!-- Icon Wrapper -->
      <div class="w-[44px] h-[44px] rounded-[10px] bg-[rgba(16,185,129,0.08)] text-[#10b981] flex items-center justify-center shrink-0 border border-[rgba(16,185,129,0.15)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[20px] h-[20px]">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      
      <!-- Info Details -->
      <div class="flex flex-col">
        <span class="text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted font-sans">Total Pendapatan Platform</span>
        <span class="text-[22px] font-extrabold text-ink mt-[2px] font-sans tracking-[-0.01em]">{{ formatPrice(totalPendapatan) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminStatsGrid',
  props: {
    totalPendapatan: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    return {
      formatPrice,
    };
  },
};
</script>
