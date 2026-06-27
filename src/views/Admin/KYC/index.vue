<template>
  <div class="max-w-[640px] mx-auto px-[24px] pt-[32px] pb-[80px] box-border">
    <div class="w-full">
      <!-- Title Header Section -->
      <header class="text-left mb-[28px]">
        <h1 class="text-[28px] font-extrabold text-ink tracking-[-0.02em] m-0 font-sans">Panel Admin: Verifikasi KYC</h1>
        <p class="text-[14px] text-muted mt-[6px] mr-0 mb-0 ml-0 leading-[1.5] font-sans">Setujui pengunggahan KTP pengguna untuk memberikan hak sewa & tambah barang</p>
      </header>

      <div class="bg-white border border-hairline rounded-[16px] p-[20px] sm:p-[32px] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <!-- Alert Boxes -->
        <div v-if="errorMessage" class="py-[10px] px-[14px] rounded-[8px] text-[13px] font-sans font-semibold mb-[16px] text-left bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] text-error">{{ errorMessage }}</div>
        <div v-if="successMessage" class="py-[10px] px-[14px] rounded-[8px] text-[13px] font-sans font-semibold mb-[16px] text-left bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] text-success">{{ successMessage }}</div>

        <!-- Section: Manual Verification -->
        <section class="text-left">
          <h3 class="text-[16px] font-bold text-ink mt-0 mr-0 mb-[16px] ml-0 font-sans text-left">Verifikasi Manual via User ID</h3>
          <div class="flex flex-col sm:flex-row gap-[12px] sm:items-stretch">
            <input 
              type="text" 
              v-model="userIdInput" 
              placeholder="Masukkan User ID (contoh: 12)" 
              class="flex-1 h-[52px] px-[16px] border border-hairline rounded-[8px] bg-canvas text-ink font-sans text-[14.5px] font-medium outline-none box-border transition-all duration-150 ease-in-out focus:border-ink focus:border-2"
              :disabled="isLoading"
            />
            <button 
              class="h-[52px] px-[20px] bg-[#ff385c] border-none rounded-[8px] text-[14px] font-bold text-white cursor-pointer transition-all duration-150 ease-in-out font-sans shadow-[0_2px_8px_rgba(255,56,92,0.15)] whitespace-nowrap hover:bg-[#e00b41] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" 
              :disabled="isLoading || !userIdInput" 
              @click="handleManualVerify"
            >
              Setujui KTP User
            </button>
          </div>
        </section>

        <hr class="border-0 border-t border-hairline my-[28px]" />

        <!-- Section: Pending Queue List -->
        <section class="text-left">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] mb-[16px]">
            <h3 class="text-[16px] font-bold text-ink m-0 font-sans text-left">Antrean Pengajuan KTP (Simulasi)</h3>
            
            <!-- Search Bar -->
            <div v-if="pendingUsers.length > 0" class="relative w-full sm:w-[260px]">
              <div class="absolute inset-y-0 left-0 pl-[12px] flex items-center pointer-events-none text-muted-soft">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[14px] h-[14px]">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Cari nama atau email..." 
                class="w-full h-[36px] pl-[34px] pr-[12px] bg-canvas border border-hairline rounded-[8px] text-ink font-sans text-[12.5px] font-medium outline-none transition-all duration-150 ease-in-out placeholder:text-muted-soft focus:border-ink"
              />
            </div>
          </div>

          <div v-if="pendingUsers.length === 0" class="bg-surface-soft border border-dashed border-hairline rounded-[12px] py-[40px] px-[24px] flex flex-col items-center justify-center text-center text-muted-soft">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[32px] h-[32px] text-[#10b981] mb-[12px]">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p class="text-[13.5px] text-muted m-0 font-sans font-semibold">Semua pengajuan KTP telah diproses!</p>
          </div>

          <div v-else-if="filteredPendingUsers.length === 0" class="bg-surface-soft border border-dashed border-hairline rounded-[12px] py-[32px] px-[24px] text-center text-muted font-sans text-[13px]">
            Tidak ada pengajuan KTP yang cocok dengan pencarian "<strong>{{ searchQuery }}</strong>"
          </div>

          <div v-else class="flex flex-col gap-[12px]">
            <div v-for="user in filteredPendingUsers" :key="user.id" class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-[14px] sm:gap-[16px] py-[16px] px-[20px] bg-white border border-hairline rounded-[12px] shadow-[0_2px_6px_rgba(0,0,0,0.01)]">
              <div class="flex flex-col gap-[4px] text-left">
                <span class="text-[14.5px] font-bold text-ink font-sans">{{ user.name || user.nama }}</span>
                <div class="flex items-center gap-[8px]">
                  <span class="text-[10.5px] font-mono bg-surface-strong text-ink py-[1px] px-[6px] rounded-[4px] font-semibold">ID: {{ user.id }}</span>
                  <span class="text-[12.5px] text-muted font-sans">{{ user.email }}</span>
                </div>
                <div class="flex items-center gap-[6px] mt-[2px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[13px] h-[13px] text-muted-soft">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span class="text-[12px] text-muted-soft font-sans">{{ user.ktpFileName }}</span>
                </div>
              </div>
              
              <button 
                class="px-[16px] py-[8px] bg-white border border-hairline rounded-[6px] text-[13px] font-semibold text-ink cursor-pointer transition-all duration-150 ease-in-out font-sans whitespace-nowrap hover:bg-surface-soft hover:border-muted-soft active:scale-[0.98]" 
                :disabled="isLoading" 
                @click="verifyUser(user.id)"
              >
                Setujui
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import useAdminKYC from './composables/useAdminKYC';

export default {
  name: 'AdminKYCView',
  setup() {
    const {
      userIdInput,
      isLoading,
      successMessage,
      errorMessage,
      pendingUsers,
      verifyUser,
      handleManualVerify,
    } = useAdminKYC();

    const searchQuery = ref('');

    const filteredPendingUsers = computed(() => {
      if (!searchQuery.value.trim()) return pendingUsers.value;
      const q = searchQuery.value.toLowerCase().trim();
      return pendingUsers.value.filter(user => {
        const name = (user.name || user.nama || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    });

    return {
      userIdInput,
      isLoading,
      successMessage,
      errorMessage,
      pendingUsers,
      searchQuery,
      filteredPendingUsers,
      verifyUser,
      handleManualVerify,
    };
  },
};
</script>
