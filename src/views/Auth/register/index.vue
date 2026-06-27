<template>
  <div class="min-h-screen bg-canvas flex flex-col md:flex-row">
    <!-- Left Column: Owner Teaser Collage (Hidden on mobile) -->
    <div class="hidden md:flex flex-col justify-between w-1/2 p-xl bg-surface-soft border-r border-hairline relative overflow-hidden select-none">
      <!-- Logo and Intro -->
      <div class="w-full">
        <div class="flex items-center gap-xs mb-xl">
          <span class="font-sans font-extrabold text-2xl tracking-tight text-ink">Sewa<span class="text-[#ff385c]">Ki</span></span>
        </div>
        <h1 class="text-3xl lg:text-4xl font-semibold tracking-tight text-ink font-sans mb-sm leading-tight max-w-[420px]">
          Mulai Menyewakan, Hasilkan Uang.
        </h1>
        <p class="text-sm text-body font-sans leading-relaxed max-w-[380px] mt-xs">
          Punya kamera nganggur, tenda camping, atau drone? Daftarkan barang Anda di SewaKi dan dapatkan penghasilan pasif.
        </p>
      </div>

      <!-- Collage Cards Container -->
      <div class="relative w-full h-[360px] my-lg flex items-center justify-center">
        <!-- Card 1: Active Product Status -->
        <div class="bg-canvas border border-hairline shadow-md rounded-lg p-md absolute top-2 left-6 w-[290px] z-20 transform -rotate-1 transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:z-30">
          <div class="flex justify-between items-center mb-xs">
            <div>
              <span class="font-sans text-[9px] text-muted uppercase tracking-wider block">Performa Barang</span>
              <h3 class="font-sans font-bold text-xs text-ink truncate max-w-[150px]">Sony Alpha 7 III</h3>
            </div>
            <span class="bg-[#10b981]/15 text-[#10b981] text-[9px] font-bold px-2 py-0.5 rounded-full">
              Aktif
            </span>
          </div>
          <hr class="border-t border-hairline-soft my-sm">
          <div class="grid grid-cols-2 gap-xs">
            <div class="border border-hairline rounded-md p-xxs pl-xs text-left bg-surface-soft">
              <span class="font-sans text-[8px] text-muted block uppercase">Transaksi</span>
              <span class="font-sans text-xs font-bold text-ink">16x Disewa</span>
            </div>
            <div class="border border-hairline rounded-md p-xxs pl-xs text-left bg-surface-soft">
              <span class="font-sans text-[8px] text-muted block uppercase">Pendapatan</span>
              <span class="font-sans text-xs font-bold text-[#10b981]">Rp 2,4 Jt</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Earning Monthly Graph Mockup -->
        <div class="bg-canvas border border-hairline shadow-md rounded-lg p-md absolute top-24 right-6 w-[200px] z-10 transform rotate-3 transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:z-30">
          <h3 class="font-sans font-bold text-xs text-ink text-center mb-xs">Grafik Bulanan</h3>
          <div class="flex items-end gap-sm h-[60px] pt-xs">
            <div class="flex-1 bg-surface-strong rounded-sm h-[30%]" title="Apr"></div>
            <div class="flex-1 bg-surface-strong rounded-sm h-[50%]" title="Mei"></div>
            <div class="flex-1 bg-[#ff385c] rounded-sm h-[90%]" title="Jun"></div>
          </div>
          <div class="flex justify-between text-[8px] text-muted-soft font-sans mt-xxs">
            <span>April</span>
            <span>Mei</span>
            <span>Juni</span>
          </div>
        </div>

        <!-- Card 3: New Rental Request Alert -->
        <div class="bg-canvas border border-hairline shadow-md rounded-lg p-md absolute bottom-2 left-10 w-[270px] z-15 transform -rotate-2 transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:z-30">
          <div class="flex items-start gap-sm">
            <div class="w-8 h-8 rounded-full bg-[#ff385c]/10 text-[#ff385c] font-bold text-xs flex items-center justify-center font-sans shrink-0">
              DM
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center gap-xs mb-xxs">
                <span class="font-sans font-bold text-xs text-ink truncate">@dian_m</span>
                <span class="font-sans text-[9px] text-muted-soft shrink-0">Baru</span>
              </div>
              <p class="font-sans text-xs text-body leading-normal">
                Permintaan sewa disetujui selama <span class="font-semibold text-ink">3 hari</span>
              </p>
              <div class="mt-xs inline-flex items-center bg-[#10b981]/15 text-[#10b981] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Disetujui
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Right Column: Auth Form -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 p-lg md:p-xl bg-canvas min-h-screen">
      <div class="w-full max-w-[380px] flex flex-col justify-center">
        <!-- Mobile Logo -->
        <div class="flex md:hidden items-center gap-xs mb-xl">
          <span class="font-sans font-extrabold text-2xl tracking-tight text-ink">Sewa<span class="text-[#ff385c]">Ki</span></span>
        </div>

        <div class="mb-xl">
          <h2 class="text-2xl font-bold text-ink tracking-tight font-sans">Buat Akun Baru</h2>
          <p class="text-sm text-muted mt-xs font-sans">Lengkapi formulir di bawah untuk mendaftar layanan SewaKi</p>
        </div>

        <!-- Alert Box for Error -->
        <transition 
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="errorMessage" class="alert-error flex items-start gap-sm bg-error/5 border border-error/20 text-error p-sm rounded-md text-[13px] text-left mb-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span class="font-sans font-medium">{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- Alert Box for Success -->
        <transition 
          enter-active-class="transition-opacity duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="successMessage" class="alert-success flex items-start gap-sm bg-success/5 border border-success/20 text-success p-sm rounded-md text-[13px] text-left mb-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mt-0.5 shrink-0">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="font-sans font-medium">{{ successMessage }}</span>
          </div>
        </transition>

        <RegisterForm :loading="isLoading" @submit="handleRegister" />

        <div class="text-left mt-xl pt-md border-t border-hairline">
          <span class="text-sm text-muted font-sans">Sudah memiliki akun? </span>
          <router-link to="/login" class="text-sm font-semibold text-[#ff385c] hover:underline font-sans">Masuk di sini</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RegisterForm from './components/RegisterForm.vue';
import api from '../../../services/api';

export default {
  name: 'RegisterView',
  components: {
    RegisterForm,
  },
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    const handleRegister = async (formData) => {
      errorMessage.value = '';
      successMessage.value = '';
      isLoading.value = true;

      try {
        const response = await api.post('/api/auth/register', {
          nama: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          nomor_hp: formData.nomor_hp
        });

        successMessage.value = response.data?.message || 'Registrasi berhasil! Mengalihkan ke halaman login...';
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } catch (error) {
        console.error('Registration error:', error);
        if (error.response) {
          errorMessage.value = error.response.data?.message || error.response.data?.error || 'Registrasi gagal. Silakan periksa kembali data Anda.';
        } else {
          errorMessage.value = 'Terjadi kesalahan saat menghubungkan server.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      errorMessage,
      successMessage,
      handleRegister,
    };
  },
};
</script>
