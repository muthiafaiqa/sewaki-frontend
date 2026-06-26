<template>
  <div class="ktp-upload-container">
    <label class="upload-label">{{ label }}</label>
    <div 
      class="upload-box" 
      :class="{ 'dragging': isDragging, 'has-file': previewUrl }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileSelect"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden-input" 
        accept="image/*" 
        @change="handleFileChange" 
      />
      
      <div v-if="!previewUrl" class="upload-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span class="upload-text">Klik atau seret foto KTP ke sini</span>
        <span class="upload-subtext">Maksimal ukuran file 2MB (JPG, PNG)</span>
      </div>
      
      <div v-else class="upload-preview">
        <img :src="previewUrl" alt="KTP Preview" class="preview-img" />
        <div class="preview-overlay">
          <span>Ganti Foto KTP</span>
        </div>
      </div>
    </div>
    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'KTPUpload',
  props: {
    label: {
      type: String,
      default: 'Foto KTP / Identitas',
    },
    error: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [File, String],
      default: null,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const isDragging = ref(false);
    const previewUrl = ref('');

    watch(() => props.modelValue, (newVal) => {
      if (!newVal) {
        previewUrl.value = '';
      } else if (typeof newVal === 'string') {
        previewUrl.value = newVal;
      }
    }, { immediate: true });

    const triggerFileSelect = () => {
      fileInput.value.click();
    };

    const processFile = (file) => {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file tidak boleh melebihi 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }

      previewUrl.value = URL.createObjectURL(file);
      emit('update:modelValue', file);
      emit('change', file);
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      processFile(file);
    };

    const handleDrop = (e) => {
      isDragging.value = false;
      const file = e.dataTransfer.files[0];
      processFile(file);
    };

    return {
      fileInput,
      isDragging,
      previewUrl,
      triggerFileSelect,
      handleFileChange,
      handleDrop,
    };
  },
};
</script>

<style scoped>
.ktp-upload-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  width: 100%;
  text-align: left;
}

.upload-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
}

.upload-box {
  border: 2px dashed var(--color-hairline);
  border-radius: var(--rounded-lg);
  padding: var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  background-color: var(--color-surface-soft);
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-box:hover, .upload-box.dragging {
  border-color: var(--color-primary);
  background-color: var(--color-canvas);
}

.hidden-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: var(--color-muted);
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
}

.upload-subtext {
  font-size: 12px;
  color: var(--color-muted);
}

.upload-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;
  font-size: 14px;
  font-weight: 600;
}

.upload-box:hover .preview-overlay {
  opacity: 1;
}

.error-text {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 2px;
}
</style>
