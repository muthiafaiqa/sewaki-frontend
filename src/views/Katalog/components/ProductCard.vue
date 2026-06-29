<template>
  <BaseCard variant="base" class="product-card" @click="$emit('click', item.id)">
    <div class="product-image-wrapper">
      <img 
        v-if="item.foto_barang"
        :src="item.foto_barang" 
        :alt="item.nama_barang || item.name" 
        class="product-image"
      />
      <div v-else class="product-image-placeholder">📦</div>
      <BaseBadge color="orange" class="category-badge">
        {{ item.category || 'Barang Sewa' }}
      </BaseBadge>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ item.nama_barang || item.name }}</h3>
      <p class="product-location">📍 {{ item.lokasi || item.location || 'Lokasi tidak ditentukan' }}</p>
      
      <div class="price-row">
        <span class="price-amt">{{ formatPrice(item.harga_sewa_per_hari !== undefined ? item.harga_sewa_per_hari : item.price) }}</span>
        <span class="price-unit">/ hari</span>
      </div>

      <p class="product-desc">{{ item.deskripsi || item.description }}</p>
    </div>

    <div class="product-actions mt-sm flex flex-col gap-2">
      <BaseButton variant="primary" class="w-full" @click.stop="$emit('rent', item)">
        Pinjam Barang
      </BaseButton>
      <button 
        v-if="isAdmin" 
        class="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150"
        @click.stop="$emit('delete', item.id)"
      >
        Hapus Produk (Admin)
      </button>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../../../components/ui/BaseCard.vue';
import BaseBadge from '../../../components/ui/BaseBadge.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import { useAuthStore } from '../../../stores/authStore';

export default {
  name: 'ProductCard',
  components: {
    BaseCard,
    BaseBadge,
    BaseButton,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  emits: ['click', 'rent', 'delete'],
  setup() {
    const authStore = useAuthStore();
    const isAdmin = authStore.isAdmin;

    const formatPrice = (value) => {
      if (!value && value !== 0) return 'Hubungi Pemilik';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    return {
      formatPrice,
      isAdmin,
    };
  },
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.product-image-wrapper {
  position: relative;
  height: 180px;
  background-color: var(--color-surface-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-placeholder {
  font-size: 48px;
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.product-info {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0;
  line-height: 1.4;
  height: 44px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-location {
  font-size: 12px;
  color: var(--color-muted);
  margin: 4px 0 8px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: var(--spacing-xs);
}

.price-amt {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
}

.price-unit {
  font-size: 12px;
  color: var(--color-muted);
}

.product-desc {
  font-size: 13px;
  color: var(--color-body);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 36px;
}

.product-actions {
  padding: 0 var(--spacing-md) var(--spacing-md);
}
</style>
