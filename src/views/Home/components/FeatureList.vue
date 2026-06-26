<template>
  <section class="feature-section p-xl">
    <div class="container">
      <h2 class="title-md text-ink text-center mb-xl">Mengapa Memilih SewaKi?</h2>
      <div class="grid grid-cols-4 gap-lg">
        <BaseCard variant="feature" v-for="(feature, idx) in features" :key="idx">
          <div class="feature-icon-frame">{{ feature.icon }}</div>
          <h3 class="title-xs text-ink mt-md">{{ feature.title }}</h3>
          <p class="body-sm text-muted mt-xs">{{ feature.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script>
import BaseCard from '../../../components/ui/BaseCard.vue';

export default {
  name: 'FeatureList',
  components: {
    BaseCard,
  },
  setup() {
    const features = [
      {
        icon: '🛡️',
        title: 'Higienis & Steril',
        description: 'Semua barang dibersihkan dan disterilisasi sebelum dikirim demi kenyamanan buah hati Anda.',
      },
      {
        icon: '🔒',
        title: 'Deposit Aman',
        description: 'Dana deposit terjamin dan akan dikembalikan secara otomatis segera setelah masa sewa selesai.',
      },
      {
        icon: '🏷️',
        title: 'Hemat Hingga 80%',
        description: 'Dapatkan akses ke brand premium global tanpa perlu membelinya secara penuh.',
      },
      {
        icon: '🌱',
        title: 'Ramah Lingkungan',
        description: 'Mendukung ekonomi sirkular dengan berbagi penggunaan barang seiring pertumbuhan sang anak.',
      },
    ];

    return {
      features,
    };
  },
};
</script>

<style scoped>
.feature-section {
  background-color: var(--color-canvas);
}

.feature-icon-frame {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--color-surface-soft);
  border-radius: var(--rounded-md);
  font-size: 24px;
}
</style>
