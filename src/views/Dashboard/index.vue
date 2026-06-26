<template>
  <PageWrapper class="container py-lg">
    <div class="header-section text-left mb-xl">
      <h1 class="display-sm text-ink font-bold">Dashboard Pemilik</h1>
      <p class="body-md text-muted mt-xxs">Pantau performa bisnis rental Anda secara langsung.</p>
    </div>

    <!-- Loading State -->
    <BaseSpinner v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="errorMessage" class="error-wrapper text-center py-xl">
      <h3 class="title-sm text-error">Gagal Memuat Dashboard</h3>
      <p class="body-md text-muted mt-sm mb-md">{{ errorMessage }}</p>
      <BaseButton variant="primary" @click="fetchDashboardData">Coba Lagi</BaseButton>
    </div>

    <!-- Content State -->
    <div v-else-if="dashboardData" class="dashboard-content flex flex-col gap-lg">
      <StatsGrid :stats="dashboardData" @withdraw="openWithdrawModal" />

      <RevenueChart 
        v-if="dashboardData.pendapatanBulanan && dashboardData.pendapatanBulanan.length > 0" 
        :data="dashboardData.pendapatanBulanan" 
      />

      <NotificationFeed :transactions="dashboardData.recentTransactions || []" />
    </div>

    <!-- Withdraw Dana Modal -->
    <WithdrawModal
      :show="showWithdrawModal"
      :maxAmount="dashboardData?.saldoBisaDicairkan || 0"
      :loading="withdrawLoading"
      :error="withdrawError"
      :success="withdrawSuccess"
      :initialForm="withdrawForm"
      @close="showWithdrawModal = false"
      @submit="handleWithdraw"
    />
  </PageWrapper>
</template>

<script>
import PageWrapper from '../../components/layout/PageWrapper.vue';
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import StatsGrid from './components/StatsGrid.vue';
import RevenueChart from './components/RevenueChart.vue';
import NotificationFeed from './components/NotificationFeed.vue';
import WithdrawModal from './components/WithdrawModal.vue';
import useDashboardStats from './composables/useDashboardStats';

export default {
  name: 'DashboardView',
  components: {
    PageWrapper,
    BaseSpinner,
    BaseButton,
    StatsGrid,
    RevenueChart,
    NotificationFeed,
    WithdrawModal,
  },
  setup() {
    const {
      isLoading,
      errorMessage,
      dashboardData,
      showWithdrawModal,
      withdrawLoading,
      withdrawError,
      withdrawSuccess,
      withdrawForm,
      fetchDashboardData,
      openWithdrawModal,
      handleWithdraw,
    } = useDashboardStats();

    return {
      isLoading,
      errorMessage,
      dashboardData,
      showWithdrawModal,
      withdrawLoading,
      withdrawError,
      withdrawSuccess,
      withdrawForm,
      fetchDashboardData,
      openWithdrawModal,
      handleWithdraw,
    };
  },
};
</script>

<style scoped>
.error-wrapper {
  background-color: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-lg);
}
</style>
