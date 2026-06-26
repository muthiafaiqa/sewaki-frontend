<template>
  <div class="gallery-container">
    <div class="image-box">
      <img 
        v-if="foto" 
        :src="getImageUrl(foto)" 
        :alt="alt" 
        class="gallery-image"
      />
      <div v-else class="gallery-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="placeholder-icon">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span>Belum Ada Foto</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemGallery',
  props: {
    foto: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: 'Gambar Barang',
    },
  },
  setup() {
    const getImageUrl = (filename) => {
      if (!filename) return '';
      if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
      }
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
    };

    return {
      getImageUrl,
    };
  },
};
</script>

<style scoped>
.gallery-container {
  width: 100%;
}

.image-box {
  width: 100%;
  aspect-ratio: 16 / 10;
  background-color: var(--color-surface-soft);
  border-radius: 16px;
  border: 1px solid var(--color-hairline);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.image-box:hover .gallery-image {
  transform: scale(1.02);
}

.gallery-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-muted);
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 500;
}

.placeholder-icon {
  width: 36px;
  height: 36px;
  stroke: var(--color-muted-soft);
}
</style>
