<template>
  <section class="hero-section text-center p-xl">
    <div class="container hero-content">
      <h1 class="display-lg text-ink font-heading">Temukan & Sewa Perlengkapan Bayi & Anak Terbaik</h1>
      <p class="body-lg text-muted mt-sm max-w-md mx-auto">
        Mulai dari stroller premium, mainan edukatif, perlengkapan menyusui, hingga kasur bayi. Lebih hemat, bersih, dan higienis.
      </p>
      <div class="flex justify-center gap-md mt-lg">
        <router-link to="/katalog" class="btn-primary flex items-center justify-center">Telusuri Katalog</router-link>
        <router-link to="/dashboard" class="btn-secondary flex items-center justify-center">Jadi Pemilik Barang</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
};
</script>

<style scoped>
.hero-section {
  padding: 80px 0;
  background: radial-gradient(circle at 50% 120%, rgba(20, 20, 20, 0.03), transparent);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.max-w-md {
  max-width: 580px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
