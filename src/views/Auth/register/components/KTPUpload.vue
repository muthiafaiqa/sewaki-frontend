<template>
  <div class="flex flex-col gap-xxs w-full text-left">
    <label class="font-sans text-[14px] font-medium text-ink">{{ label }}</label>
    <div 
      class="border-2 border-dashed border-hairline rounded-lg p-lg text-center cursor-pointer bg-surface-soft transition-all duration-150 ease-in-out relative overflow-hidden min-h-[140px] flex items-center justify-center group" 
      :class="isDragging ? 'border-primary bg-canvas' : 'hover:border-primary hover:bg-canvas'"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileSelect"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept="image/*" 
        @change="handleFileChange" 
      />
      
      <div v-if="!previewUrl" class="flex flex-col items-center gap-xs">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-[32px] h-[32px] text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span class="text-[14px] font-medium text-ink">Klik atau seret foto KTP ke sini</span>
        <span class="text-[12px] text-muted">Maksimal ukuran file 2MB (JPG, PNG)</span>
      </div>
      
      <div v-else class="w-full h-full absolute top-0 left-0">
        <img :src="previewUrl" alt="KTP Preview" class="w-full h-full object-cover" />
        <div class="absolute top-0 left-0 w-full h-full bg-black/40 text-white flex items-center justify-center opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100 font-semibold text-[14px]">
          <span>Ganti Foto KTP</span>
        </div>
      </div>
    </div>
    <span v-if="error" class="text-[12px] text-error mt-[2px]">{{ error }}</span>
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
