<template>
  <div class="max-w-[1120px] mx-auto px-[24px] pt-[24px] pb-[60px] md:px-[80px] md:pt-[32px] md:pb-[80px] box-border">
    <!-- Tab Navigation Header -->
    <div class="flex gap-6 border-b border-[#e5e7eb] mb-8">
      <router-link 
        to="/admin/dashboard" 
        class="pb-3 text-sm font-semibold border-b-2 border-[#ff385c] text-[#ff385c] transition-all font-sans"
      >
        Verifikasi KYC
      </router-link>
      <router-link 
        to="/admin/disputes" 
        class="pb-3 text-sm font-semibold border-b-2 border-transparent text-[#6b7280] hover:text-[#111111] transition-all font-sans"
      >
        Manajemen Sengketa (Disputes)
      </router-link>
    </div>

    <!-- Revenue Stats Section -->
    <AdminStatsGrid :totalPendapatan="totalPendapatan" />

    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-[24px] mb-[32px] text-left">
      <div class="flex-1">
        <h1 class="text-[28px] font-extrabold text-ink tracking-[-0.02em] m-0 font-sans">Dashboard Verifikasi KYC</h1>
        <p class="text-[14px] text-muted mt-[6px] mr-0 mb-0 ml-0 leading-[1.5] font-sans">Kelola dan setujui verifikasi identitas (KTP) pengguna SewaKi</p>
      </div>
      <button class="inline-flex items-center gap-[8px] px-[18px] py-[10px] bg-white border border-hairline rounded-[8px] text-[13.5px] font-semibold text-ink cursor-pointer transition-all duration-150 ease-in-out shrink-0 hover:bg-surface-soft hover:border-muted-soft active:scale-[0.98]" :disabled="isLoading" @click="fetchPendingUsers">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-[14px] h-[14px]">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        Segarkan Data
      </button>
    </div>

    <!-- Alert Box for Success -->
    <div v-if="successMessage" class="flex items-center gap-[10px] px-[18px] py-[14px] bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] rounded-[10px] text-success text-[13.5px] font-semibold font-sans mb-[24px] text-left">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[16px] h-[16px] shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- Alert Box for Error -->
    <div v-if="errorMessage" class="flex items-center gap-[10px] px-[18px] py-[14px] bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded-[10px] text-error text-[13.5px] font-semibold font-sans mb-[24px] text-left">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[16px] h-[16px] shrink-0">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && users.length === 0" class="flex flex-col items-center justify-center min-h-[320px] text-center text-muted gap-[16px]">
      <BaseSpinner />
      <p class="font-sans text-[14px]">Memuat data pengguna...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="w-full">
      <div class="bg-surface-soft border border-dashed border-hairline rounded-[16px] py-[56px] px-[24px] flex flex-col items-center justify-center text-center">
        <div class="text-muted-soft mb-[16px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[48px] h-[48px]">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3 class="text-[18px] font-bold text-ink m-0 font-sans">Belum Ada Pengguna</h3>
        <p class="text-[14px] text-muted max-w-[380px] mt-[8px] mr-0 mb-0 ml-0 leading-[1.5] font-sans">Sistem tidak mendeteksi adanya data pengguna terdaftar saat ini.</p>
      </div>
    </div>

    <!-- Content State -->
    <div v-else class="w-full">
      <UserTable 
        :users="users" 
        :actionLoading="actionLoading" 
        @view-ktp="openKtpModal" 
        @approve="handleApprove" 
        @reject="handleReject" 
      />
    </div>

    <!-- Lightbox Modal -->
    <KYCLightbox
      :show="showModal"
      :ktpUrl="activeKtpUrl"
      :activeUserName="activeUserName"
      @close="closeModal"
    />
  </div>
</template>

<script>
import AdminStatsGrid from './components/AdminStatsGrid.vue';
import UserTable from './components/UserTable.vue';
import KYCLightbox from './components/KYCLightbox.vue';
import BaseSpinner from '../../../components/ui/BaseSpinner.vue';
import useAdminDashboard from './composables/useAdminDashboard';

export default {
  name: 'AdminDashboardView',
  components: {
    AdminStatsGrid,
    UserTable,
    KYCLightbox,
    BaseSpinner,
  },
  setup() {
    const {
      users,
      isLoading,
      actionLoading,
      errorMessage,
      successMessage,
      totalPendapatan,
      showModal,
      selectedUser,
      activeKtpUrl,
      activeUserName,
      fetchPendingUsers,
      handleApprove,
      handleReject,
      openKtpModal,
      closeModal,
    } = useAdminDashboard();

    return {
      users,
      isLoading,
      actionLoading,
      errorMessage,
      successMessage,
      totalPendapatan,
      showModal,
      selectedUser,
      activeKtpUrl,
      activeUserName,
      fetchPendingUsers,
      handleApprove,
      handleReject,
      openKtpModal,
      closeModal,
    };
  },
};
</script>
