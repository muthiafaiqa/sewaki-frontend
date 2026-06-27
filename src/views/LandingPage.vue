<template>
  <div class="min-h-screen bg-canvas flex flex-col font-sans select-none pt-16">
    <!-- Custom Landing Page Navbar -->
    <nav class="fixed top-0 left-0 right-0 border-b border-hairline bg-canvas/80 backdrop-blur-md z-50 transition-all duration-200">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-ink font-sans font-extrabold text-2xl tracking-tight">Sewa<span class="text-[#ff385c]">Ki</span></span>
        </router-link>

        <!-- Navigation Links (Desktop) -->
        <div class="hidden md:flex items-center gap-8">
          <button 
            @click="scrollToSection('tentang')" 
            class="text-sm font-semibold text-ink/80 hover:text-[#ff385c] transition-colors bg-transparent border-none cursor-pointer focus:outline-none"
          >
            Tentang SewaKi
          </button>
          <button 
            @click="scrollToSection('cara-kerja')" 
            class="text-sm font-semibold text-ink/80 hover:text-[#ff385c] transition-colors bg-transparent border-none cursor-pointer focus:outline-none"
          >
            Cara Kerja
          </button>
        </div>

        <!-- Auth Actions (Desktop) -->
        <div class="hidden md:flex items-center gap-3">
          <router-link to="/login">
            <BaseButton variant="secondary" size="sm" class="h-10 px-5 rounded-md text-sm font-semibold font-sans">
              Login
            </BaseButton>
          </router-link>
          <router-link to="/register">
            <BaseButton variant="primary" size="sm" class="h-10 px-5 !bg-[#ff385c] !border-[#ff385c] hover:!bg-[#e00b41] hover:!border-[#e00b41] text-white rounded-md font-semibold font-sans transition-all">
              Daftar
            </BaseButton>
          </router-link>
        </div>

        <!-- Hamburger Button (Mobile) -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-ink hover:bg-surface-soft active:bg-surface-soft transition-colors focus:outline-none"
        >
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMenuOpen" class="md:hidden border-b border-hairline bg-canvas/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 shadow-lg">
          <button 
            @click="scrollToSection('tentang'); isMenuOpen = false" 
            class="text-left text-sm font-semibold text-ink/80 hover:text-[#ff385c] py-2 bg-transparent border-none cursor-pointer focus:outline-none"
          >
            Tentang SewaKi
          </button>
          <button 
            @click="scrollToSection('cara-kerja'); isMenuOpen = false" 
            class="text-left text-sm font-semibold text-ink/80 hover:text-[#ff385c] py-2 bg-transparent border-none cursor-pointer focus:outline-none"
          >
            Cara Kerja
          </button>
          <hr class="border-hairline my-1" />
          <div class="flex flex-col gap-3">
            <router-link to="/login" class="w-full">
              <BaseButton variant="secondary" class="w-full h-10 rounded-md text-sm font-semibold font-sans">
                Login
              </BaseButton>
            </router-link>
            <router-link to="/register" class="w-full">
              <BaseButton variant="primary" class="w-full h-10 !bg-[#ff385c] !border-[#ff385c] hover:!bg-[#e00b41] hover:!border-[#e00b41] text-white rounded-md font-semibold font-sans transition-all">
                Daftar
              </BaseButton>
            </router-link>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Main Content Wrapper -->
    <main class="flex-grow">
      
      <!-- Hero Section (Clean Split-Screen) -->
      <section class="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Hero Text Column -->
        <div class="text-left flex flex-col gap-5 max-w-xl">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold text-ink font-sans leading-tight tracking-tight">
            Ubah Barang Nganggur <span class="text-[#ff385c]">Jadi Cuan.</span>
          </h1>
          <p class="text-sm md:text-base text-body font-sans leading-relaxed max-w-[480px]">
            Platform sewa barang terpercaya untuk pemilik yang ingin penghasilan tambahan dan penyewa yang mencari kemudahan. Mulai menyewakan barang pribadi Anda atau temukan peralatan terbaik di sekitar Makassar.
          </p>
          <div class="mt-4">
            <router-link to="/register">
              <BaseButton variant="primary" class="h-12 px-8 !bg-[#ff385c] !border-[#ff385c] hover:!bg-[#e00b41] hover:!border-[#e00b41] text-white rounded-md font-semibold font-sans transition-all active:scale-[0.98]">
                Mulai Sekarang
              </BaseButton>
            </router-link>
          </div>
        </div>

        <!-- Hero Visual Collage Column -->
        <div class="relative w-full h-[400px] md:h-[440px] flex items-center justify-center bg-surface-soft border border-hairline rounded-2xl overflow-hidden p-6 select-none">
          <!-- Background decorative mesh or glow -->
          <div class="absolute inset-0 bg-gradient-to-tr from-surface-soft to-canvas opacity-50"></div>

          <!-- Collage Card 1: Active Rental Alert (Matches Login.vue style) -->
          <div class="bg-canvas border border-hairline shadow-md rounded-lg p-md absolute top-6 left-6 w-[280px] md:w-[300px] z-20 transform -rotate-1 transition-all duration-300 hover:scale-[1.03] hover:rotate-0">
            <div class="flex items-start gap-sm">
              <div class="w-8 h-8 rounded-full bg-[#ff385c]/10 text-[#ff385c] font-bold text-xs flex items-center justify-center font-sans shrink-0">
                BS
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center gap-xs mb-xxs">
                  <span class="font-sans font-bold text-xs text-ink truncate">@budi_s</span>
                  <span class="font-sans text-[9px] text-muted-soft shrink-0">Baru saja</span>
                </div>
                <p class="font-sans text-xs text-body leading-normal">
                  Menyewa <span class="font-semibold text-ink">Sony Alpha 7 III</span> selama <span class="font-semibold text-ink">3 hari</span>
                </p>
                <div class="mt-xs inline-flex items-center bg-[#10b981]/15 text-[#10b981] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Disewa
                </div>
              </div>
            </div>
          </div>

          <!-- Collage Card 2: Calendar Widget (Matches Login.vue style) -->
          <div class="bg-canvas border border-hairline shadow-md rounded-lg p-md absolute top-28 right-6 w-[200px] md:w-[210px] z-10 transform rotate-3 transition-all duration-300 hover:scale-[1.03] hover:rotate-0">
            <h3 class="font-sans font-bold text-xs text-ink text-center mb-xs">Juni 2026</h3>
            <div class="grid grid-cols-7 gap-y-xxs text-center">
              <span class="font-sans text-[8px] text-muted font-bold">S</span>
              <span class="font-sans text-[8px] text-muted font-bold">S</span>
              <span class="font-sans text-[8px] text-muted font-bold">R</span>
              <span class="font-sans text-[8px] text-muted font-bold">K</span>
              <span class="font-sans text-[8px] text-muted font-bold">J</span>
              <span class="font-sans text-[8px] text-muted font-bold">S</span>
              <span class="font-sans text-[8px] text-muted font-bold">M</span>

              <span class="font-sans text-[10px] text-muted-soft py-0.5">22</span>
              <span class="font-sans text-[10px] text-muted-soft py-0.5">23</span>
              <span class="font-sans text-[10px] text-muted-soft py-0.5">24</span>
              <span class="font-sans text-[10px] text-muted-soft py-0.5">25</span>
              <span class="font-sans text-[10px] text-muted-soft py-0.5">26</span>
              <span class="font-sans text-[10px] text-on-primary bg-[#ff385c] rounded-full font-bold py-0.5">27</span>
              <span class="font-sans text-[10px] text-on-primary bg-[#ff385c] rounded-full font-bold py-0.5">28</span>
            </div>
            <div class="mt-sm flex items-center justify-between border-t border-hairline pt-xs">
              <span class="font-sans text-[9px] text-muted">Status:</span>
              <span class="font-sans text-[9px] font-bold text-[#ff385c]">Booked</span>
            </div>
          </div>

          <!-- Collage Card 3: Earning Widget (Matches Login.vue style) -->
          <div class="bg-canvas border border-hairline shadow-md rounded-lg p-md absolute bottom-6 left-10 w-[230px] md:w-[240px] z-15 transform -rotate-2 transition-all duration-300 hover:scale-[1.03] hover:rotate-0">
            <div class="flex justify-between items-start mb-sm">
              <div>
                <span class="font-sans text-[9px] text-muted uppercase tracking-wider block">Total Pendapatan</span>
                <span class="font-sans font-extrabold text-base text-ink">Rp 2.450.000</span>
              </div>
              <span class="bg-[#10b981]/15 text-[#10b981] text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center">
                +18.4%
              </span>
            </div>
            <div class="flex items-end gap-sm h-[50px] pt-xs">
              <div class="flex-1 bg-surface-strong rounded-sm h-[35%]" title="Apr"></div>
              <div class="flex-1 bg-surface-strong rounded-sm h-[55%]" title="Mei"></div>
              <div class="flex-1 bg-[#ff385c] rounded-sm h-[90%]" title="Jun"></div>
            </div>
            <div class="flex justify-between text-[9px] text-muted-soft font-sans mt-xxs">
              <span>Apr</span>
              <span>Mei</span>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Value Proposition Section -->
      <section id="tentang" class="border-y border-hairline bg-surface-soft/40 py-16 md:py-20 scroll-mt-20">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <h2 class="text-2xl md:text-3xl font-semibold text-ink font-sans tracking-tight mb-3">
            Satu Platform, Berbagai Kemudahan
          </h2>
          <p class="text-sm text-muted font-sans max-w-md mx-auto mb-12">
            Nikmati transaksi sewa-menyewa yang terjamin aman, transparan, dan saling menguntungkan.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <!-- For Owners -->
            <div class="bg-canvas border border-hairline p-8 rounded-xl shadow-sm text-left flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div class="w-12 h-12 rounded-lg bg-[#ff385c]/10 flex items-center justify-center text-[#ff385c]">
                <!-- Storefront Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615 3.001 3.001 0 0 0 3.75-.615 3.001 3.001 0 0 0 3.75.615m-15 0H18m-9-3h.008v.008H9V18Z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-ink font-sans">Untuk Pemilik</h3>
              <p class="text-sm text-body leading-relaxed font-sans">
                Monetisasi barang nganggur di rumah Anda dengan aman. Tentukan harga sewa harian Anda sendiri dan raih penghasilan tambahan pasif.
              </p>
            </div>

            <!-- For Renters -->
            <div class="bg-canvas border border-hairline p-8 rounded-xl shadow-sm text-left flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div class="w-12 h-12 rounded-lg bg-[#ff385c]/10 flex items-center justify-center text-[#ff385c]">
                <!-- Shopping Bag Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-ink font-sans">Untuk Penyewa</h3>
              <p class="text-sm text-body leading-relaxed font-sans">
                Akses ribuan pilihan barang berkualitas, mulai dari elektronik hingga alat outdoor dengan harga sewa harian yang sangat terjangkau.
              </p>
            </div>

            <!-- Safety / Security -->
            <div class="bg-canvas border border-hairline p-8 rounded-xl shadow-sm text-left flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div class="w-12 h-12 rounded-lg bg-[#ff385c]/10 flex items-center justify-center text-[#ff385c]">
                <!-- Shield Check Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-ink font-sans">Keamanan Terjamin</h3>
              <p class="text-sm text-body leading-relaxed font-sans">
                Sistem mediasi sengketa manual terintegrasi oleh Admin, deposit jaminan aman, dan data pengguna terverifikasi melalui KYC KTP.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="cara-kerja" class="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center scroll-mt-20">
        <h2 class="text-2xl md:text-3xl font-semibold text-ink font-sans tracking-tight mb-3">
          Cara Kerja SewaKi
        </h2>
        <p class="text-sm text-muted font-sans max-w-md mx-auto mb-16">
          Sewa barang hanya butuh waktu kurang dari 5 menit. Praktis dan tidak berbelit-belit.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Step 1 -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-[#ff385c]/10 text-[#ff385c] font-bold text-lg flex items-center justify-center shadow-sm">
              1
            </div>
            <h3 class="text-md font-bold text-ink font-sans mt-2">Cari Barang</h3>
            <p class="text-xs text-body max-w-xs leading-relaxed font-sans">
              Cari barang sewaan terdekat dari lokasi Anda di Makassar dengan filter kategori dan jarak yang fleksibel.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-[#ff385c]/10 text-[#ff385c] font-bold text-lg flex items-center justify-center shadow-sm">
              2
            </div>
            <h3 class="text-md font-bold text-ink font-sans mt-2">Ajukan Sewa</h3>
            <p class="text-xs text-body max-w-xs leading-relaxed font-sans">
              Pilih durasi sewa, bayar tagihan sewa serta jaminan deposit secara mudah via invoice pembayaran instan.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-[#ff385c]/10 text-[#ff385c] font-bold text-lg flex items-center justify-center shadow-sm">
              3
            </div>
            <h3 class="text-md font-bold text-ink font-sans mt-2">Nikmati Barang</h3>
            <p class="text-xs text-body max-w-xs leading-relaxed font-sans">
              Ambil barang atau terima dari kurir, gunakan untuk kebutuhan Anda, lalu kembalikan saat masa sewa selesai.
            </p>
          </div>
        </div>
      </section>

      <!-- Bottom Call To Action -->
      <section class="max-w-7xl mx-auto px-6 mb-16 md:mb-24">
        <div class="w-full bg-[#ff385c] rounded-2xl p-12 md:p-16 text-center text-white flex flex-col items-center gap-6 shadow-xl shadow-primary/10 select-none">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight font-sans leading-tight">
            Siap untuk Mulai Berbagi?
          </h2>
          <p class="text-sm text-white/90 max-w-md font-sans leading-relaxed">
            Bergabunglah dengan ratusan pemilik barang dan penyewa aktif lainnya di SewaKi sekarang juga.
          </p>
          <div class="mt-2 flex gap-4 flex-wrap justify-center">
            <router-link to="/register">
              <BaseButton variant="secondary" class="h-12 px-8 rounded-md text-sm font-semibold font-sans hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Daftar Sekarang
              </BaseButton>
            </router-link>
            <router-link to="/katalog">
              <button class="h-12 px-8 rounded-md text-sm font-semibold font-sans border border-white/30 text-white bg-transparent hover:bg-white/10 active:scale-[0.98] transition-all">
                Jelajahi Barang
              </button>
            </router-link>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="border-t border-hairline bg-surface-soft py-10 mt-auto text-center text-xs text-muted font-sans font-semibold">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; 2026 SewaKi Makassar. Hak Cipta Dilindungi.</p>
        <div class="flex gap-6">
          <router-link to="/login" class="hover:text-[#ff385c] transition-colors">Akun Saya</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseButton from '../components/ui/BaseButton.vue';

const isMenuOpen = ref(false);

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
