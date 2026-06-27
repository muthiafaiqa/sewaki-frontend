<template>
  <div class="bg-white border border-hairline rounded-[16px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
    <!-- Header Section with Search Bar -->
    <div class="p-[20px] pb-[16px] border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
      <div>
        <h3 class="text-[16px] font-bold text-ink m-0 font-sans text-left">Daftar Pengguna</h3>
        <p class="text-[12.5px] text-muted m-0 mt-[2px] font-sans text-left">Menampilkan {{ filteredUsers.length }} dari {{ users.length }} pengguna</p>
      </div>
      <!-- Search Input Bar -->
      <div class="relative w-full sm:w-[320px]">
        <div class="absolute inset-y-0 left-0 pl-[12px] flex items-center pointer-events-none text-muted-soft">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[15px] h-[15px]">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari nama atau email pengguna..." 
          class="w-full h-[38px] pl-[36px] pr-[12px] bg-surface-soft border border-hairline rounded-[8px] text-ink font-sans text-[13px] font-medium outline-none transition-all duration-150 ease-in-out placeholder:text-muted-soft focus:border-ink focus:bg-white focus:shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
        />
      </div>
    </div>

    <div class="w-full overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr>
            <th class="py-[16px] px-[24px] text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted border-b border-hairline bg-surface-soft font-sans">Nama Pengguna</th>
            <th class="py-[16px] px-[24px] text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted border-b border-hairline bg-surface-soft font-sans">Alamat Email</th>
            <th class="py-[16px] px-[24px] text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted border-b border-hairline bg-surface-soft font-sans">Status KYC</th>
            <th class="py-[16px] px-[24px] text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted border-b border-hairline bg-surface-soft font-sans">Dokumen KTP</th>
            <th class="py-[16px] px-[24px] text-[11.5px] font-bold uppercase tracking-[0.05em] text-muted border-b border-hairline bg-surface-soft font-sans text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <!-- Empty Search State -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="py-[40px] px-[24px] text-center text-muted font-sans text-[13.5px]">
              <div class="flex flex-col items-center justify-center gap-[8px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[28px] h-[28px] text-muted-soft">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Tidak ada pengguna yang cocok dengan pencarian "<strong class="text-ink">{{ searchQuery }}</strong>"</span>
              </div>
            </td>
          </tr>

          <tr v-for="user in filteredUsers" :key="user.id" class="transition-colors duration-150 ease-in-out hover:bg-surface-soft border-b border-hairline-soft last:border-b-0">
            <!-- Nama Pengguna -->
            <td class="py-[18px] px-[24px] align-middle box-border">
              <div class="flex items-center gap-[12px]">
                <div class="w-[36px] h-[36px] rounded-full bg-surface-strong text-ink flex items-center justify-center font-bold text-[14px] font-sans shrink-0 border border-hairline">
                  {{ (user.nama || user.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <span class="text-[14.5px] font-bold text-ink font-sans">{{ user.nama || user.name || 'N/A' }}</span>
              </div>
            </td>

            <!-- Email -->
            <td class="py-[18px] px-[24px] align-middle box-border text-[14px] text-muted font-sans">
              {{ user.email || '-' }}
            </td>

            <!-- Status KYC -->
            <td class="py-[18px] px-[24px] align-middle box-border">
              <span class="text-[10px] font-bold py-[3px] px-[8px] rounded-full uppercase tracking-[0.02em] font-sans inline-block" :class="getStatusClass(user.status_kyc)">
                {{ getStatusLabel(user.status_kyc) }}
              </span>
            </td>

            <!-- Dokumen KTP -->
            <td class="py-[18px] px-[24px] align-middle box-border">
              <button 
                v-if="user.foto_ktp" 
                class="inline-flex items-center gap-[6px] px-[12px] py-[6px] bg-white border border-hairline text-ink rounded-[6px] text-[12.5px] font-semibold cursor-pointer transition-all duration-150 ease-in-out hover:bg-surface-soft hover:border-muted-soft font-sans"
                @click="$emit('view-ktp', user)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[14px] h-[14px]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Lihat KTP
              </button>
              <span v-else class="text-[13px] text-muted-soft font-sans">-</span>
            </td>

            <!-- Tindakan -->
            <td class="py-[18px] px-[24px] align-middle box-border text-right">
              <div v-if="isPending(user.status_kyc)" class="flex justify-end gap-[8px]">
                <button 
                  class="px-[12px] py-[6px] bg-[#ff385c] text-white border-none rounded-[6px] text-[12.5px] font-bold cursor-pointer transition-all duration-150 ease-in-out font-sans shadow-[0_2px_6px_rgba(255,56,92,0.15)] hover:bg-[#e00b41] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  :disabled="actionLoading[user.id]"
                  @click="$emit('approve', user.id)"
                >
                  Setujui
                </button>
                <button 
                  class="px-[12px] py-[6px] bg-white border border-[rgba(239,68,68,0.35)] text-[#ef4444] rounded-[6px] text-[12.5px] font-bold cursor-pointer transition-all duration-150 ease-in-out font-sans hover:bg-[rgba(239,68,68,0.05)] hover:border-[#ef4444] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  :disabled="actionLoading[user.id]"
                  @click="$emit('reject', user.id)"
                >
                  Tolak
                </button>
              </div>
              <span v-else class="text-[13px] text-muted-soft font-sans">Telah Diproses</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'UserTable',
  props: {
    users: {
      type: Array,
      required: true,
    },
    actionLoading: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['view-ktp', 'approve', 'reject'],
  setup(props) {
    const searchQuery = ref('');

    const filteredUsers = computed(() => {
      if (!searchQuery.value.trim()) return props.users;
      const q = searchQuery.value.toLowerCase().trim();
      return props.users.filter(user => {
        const nama = (user.nama || user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        return nama.includes(q) || email.includes(q);
      });
    });

    const getStatusClass = (status) => {
      if (!status) return 'bg-surface-soft text-muted border border-hairline';
      const val = status.toLowerCase();
      if (val === 'verified') return 'bg-[#ecfdf5] text-[#047857] border border-[rgba(4,120,87,0.1)]';
      if (val === 'pending') return 'bg-[#fffbeb] text-[#b45309] border border-[rgba(180,83,9,0.1)]';
      if (val === 'rejected') return 'bg-[#fef2f2] text-[#b91c1c] border border-[rgba(185,28,28,0.1)]';
      return 'bg-surface-soft text-muted border border-hairline';
    };

    const getStatusLabel = (status) => {
      if (!status) return 'Belum Diunggah';
      const val = status.toLowerCase();
      if (val === 'pending') return 'Pending';
      if (val === 'verified') return 'Terverifikasi';
      if (val === 'rejected') return 'Ditolak';
      return 'Belum Diunggah';
    };

    const isPending = (status) => {
      if (!status) return true;
      const val = status.toLowerCase();
      return val === 'pending' || val === 'unverified';
    };

    return {
      searchQuery,
      filteredUsers,
      getStatusClass,
      getStatusLabel,
      isPending,
    };
  },
};
</script>
