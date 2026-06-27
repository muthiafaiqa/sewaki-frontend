<template>
  <div class="w-full">
    <div class="w-full aspect-[16/10] bg-surface-soft rounded-[16px] border border-hairline overflow-hidden flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.03)] group">
      <img 
        v-if="foto" 
        :src="getImageUrl(foto)" 
        :alt="alt" 
        class="w-full h-full object-cover transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.02]"
      />
      <div v-else class="flex flex-col items-center gap-[12px] text-muted font-sans text-[13.5px] font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[36px] h-[36px] stroke-muted-soft">
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
