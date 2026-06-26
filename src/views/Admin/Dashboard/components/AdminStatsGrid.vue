<template>
  <div class="revenue-card-container">
    <div class="revenue-flex-layout">
      <!-- Icon Wrapper -->
      <div class="revenue-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="revenue-svg-icon">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      
      <!-- Info Details -->
      <div class="revenue-meta-details">
        <span class="revenue-label">Total Pendapatan Platform</span>
        <span class="revenue-value">{{ formatPrice(totalPendapatan) }}</span>
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

<style scoped>
.revenue-card-container {
  width: 100%;
  padding: 20px 24px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 28px;
  box-sizing: border-box;
}

.revenue-flex-layout {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.revenue-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: rgba(16, 185, 129, 0.08);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(16, 185, 129, 0.15);
}

.revenue-svg-icon {
  width: 20px;
  height: 20px;
}

.revenue-meta-details {
  display: flex;
  flex-direction: column;
}

.revenue-label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.revenue-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-ink);
  margin-top: 2px;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
}
</style>
