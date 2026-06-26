<template>
  <section class="promo-section p-xl">
    <div class="container promo-banner">
      <div class="promo-content">
        <span class="badge-accent">Kemitraan Pemilik</span>
        <h2 class="display-sm text-ink mt-sm">Punya Barang Bayi Tidak Terpakai?</h2>
        <p class="body-md text-muted mt-xs">
          Jangan biarkan stroller, crib, atau car seat menumpuk di gudang. Jadikan barang Anda sebagai aset produktif dengan menyewakannya di SewaKi.
        </p>
        <router-link to="/dashboard" class="btn-primary mt-lg inline-block text-center">Mulai Menyewakan</router-link>
      </div>
      <div class="promo-image">
        <!-- Mockup card -->
        <BaseCard variant="product-mockup" class="mockup-card">
          <div class="mockup-image">🧸</div>
          <h4 class="title-xs text-ink mt-sm">Premium Wooden Baby Crib</h4>
          <p class="body-sm text-success font-semibold mt-xxs">Rp 45.000 / hari</p>
          <div class="flex items-center gap-xs mt-xs text-muted body-xs">
            <span>⭐ 4.9 (24 review)</span>
          </div>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script>
import BaseCard from '../../../components/ui/BaseCard.vue';

export default {
  name: 'ProductPromo',
  components: {
    BaseCard,
  },
};
</script>

<style scoped>
.promo-section {
  background-color: var(--color-canvas);
}

.promo-banner {
  background-color: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-lg);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
  text-align: left;
}

.promo-content {
  flex: 1;
  max-width: 550px;
}

.badge-accent {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-ink);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--rounded-pill);
}

.promo-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.mockup-card {
  width: 260px;
  padding: var(--spacing-md);
  box-shadow: var(--shadow-lg);
  background-color: var(--color-canvas);
  border: 1px solid var(--color-hairline);
}

.mockup-image {
  height: 160px;
  background-color: var(--color-surface-soft);
  border-radius: var(--rounded-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
}

.inline-block {
  display: inline-block;
}

@media (max-width: 767px) {
  .promo-banner {
    flex-direction: column;
    padding: var(--spacing-lg);
  }
  .promo-image {
    margin-top: var(--spacing-lg);
  }
}
</style>
