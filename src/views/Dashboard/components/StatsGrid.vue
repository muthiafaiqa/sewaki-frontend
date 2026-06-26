<template>
  <div class="stats-grid-container grid grid-cols-3 gap-lg mb-xl">
    <BaseCard v-for="(stat, idx) in statList" :key="idx" class="stat-card">
      <div class="flex items-center gap-md">
        <div class="stat-icon-frame" :class="stat.variant">{{ stat.icon }}</div>
        <div class="stat-text text-left">
          <span class="body-xs text-muted font-semibold uppercase tracking-wider">{{ stat.label }}</span>
          <h3 class="title-sm text-ink font-bold mt-xxs">{{ stat.value }}</h3>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="stat-card balance-card">
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-md">
          <div class="stat-icon-frame green">💰</div>
          <div class="stat-text text-left">
            <span class="body-xs text-muted font-semibold uppercase tracking-wider">Saldo Bisa Dicairkan</span>
            <h3 class="title-sm text-ink font-bold mt-xxs">{{ formatPrice(withdrawableBalance) }}</h3>
          </div>
        </div>
        <BaseButton 
          variant="primary" 
          :disabled="withdrawableBalance <= 0" 
          @click="$emit('withdraw')"
        >
          Tarik Dana
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script>
import { computed } from 'vue';
import BaseCard from '../../../components/ui/BaseCard.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';

export default {
  name: 'StatsGrid',
  components: {
    BaseCard,
    BaseButton,
  },
  props: {
    stats: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['withdraw'],
  setup(props) {
    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const withdrawableBalance = computed(() => {
      return props.stats?.saldoBisaDicairkan || 0;
    });

    const statList = computed(() => {
      return [
        {
          label: 'Total Pendapatan',
          value: formatPrice(props.stats?.totalPendapatan),
          icon: '📈',
          variant: 'purple',
        },
        {
          label: 'Barang Sedang Disewa',
          value: `${props.stats?.barangSedangKeluar || 0} unit`,
          icon: '📦',
          variant: 'blue',
        },
        {
          label: 'Total Transaksi',
          value: `${props.stats?.totalTransaksi || 0} kali`,
          icon: '🔄',
          variant: 'orange',
        },
        {
          label: 'Rating Rata-rata',
          value: props.stats?.rataRating > 0 ? `${props.stats?.rataRating} / 5.0` : 'Belum Ada',
          icon: '⭐',
          variant: 'yellow',
        },
        {
          label: 'Saldo Ditahan',
          value: formatPrice(props.stats?.saldoDitahan),
          icon: '🔒',
          variant: 'red',
        },
      ];
    });

    return {
      withdrawableBalance,
      statList,
      formatPrice,
    };
  },
};
</script>

<style scoped>
.stat-icon-frame {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--rounded-md);
  font-size: 20px;
}

.stat-icon-frame.purple { background-color: rgba(139, 92, 246, 0.08); }
.stat-icon-frame.blue { background-color: rgba(59, 130, 246, 0.08); }
.stat-icon-frame.orange { background-color: rgba(249, 115, 22, 0.08); }
.stat-icon-frame.yellow { background-color: rgba(234, 179, 8, 0.08); }
.stat-icon-frame.red { background-color: rgba(239, 68, 68, 0.08); }
.stat-icon-frame.green { background-color: rgba(16, 185, 129, 0.08); }

.balance-card {
  grid-column: span 3;
}

@media (max-width: 767px) {
  .stats-grid-container {
    grid-template-columns: 1fr;
  }
  .balance-card {
    grid-column: span 1;
  }
}
</style>
