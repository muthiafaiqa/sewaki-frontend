<template>
  <form @submit.prevent="$emit('submit')" class="add-item-form text-left flex flex-col gap-md">
    <!-- Nama Barang -->
    <BaseInput
      id="namaBarang"
      label="Nama Barang"
      v-model="modelValue.nama_barang"
      placeholder="Contoh: Stroller Bayi Hybrid Cabi"
      :error="errors.nama_barang"
      :disabled="loading"
    />

    <!-- Deskripsi Barang -->
    <div class="form-group">
      <label for="formDeskripsi" class="input-label">Deskripsi Barang</label>
      <textarea
        id="formDeskripsi"
        v-model="modelValue.deskripsi"
        placeholder="Jelaskan kondisi barang, kelengkapan, dan ketentuan sewa..."
        rows="4"
        class="textarea-custom"
        :disabled="loading"
      ></textarea>
      <span v-if="errors.deskripsi" class="error-text mt-xxs">{{ errors.deskripsi }}</span>
    </div>

    <!-- Harga & Stok Grid -->
    <div class="grid grid-cols-2 gap-md">
      <BaseInput
        id="hargaSewa"
        type="number"
        label="Harga Sewa / Hari (Rp)"
        v-model.number="modelValue.harga_sewa_per_hari"
        placeholder="50000"
        :error="errors.harga_sewa_per_hari"
        :disabled="loading"
      />
      <BaseInput
        id="stokBarang"
        type="number"
        label="Stok Tersedia"
        v-model.number="modelValue.stok"
        placeholder="1"
        :error="errors.stok"
        :disabled="loading"
      />
    </div>

    <!-- Deposit & Lokasi Grid -->
    <div class="grid grid-cols-2 gap-md">
      <BaseInput
        id="depositBarang"
        type="number"
        label="Jaminan Deposit (Rp)"
        v-model.number="modelValue.deposit"
        placeholder="20000"
        :error="errors.deposit"
        :disabled="loading"
      />
      <BaseInput
        id="lokasiBarang"
        label="Lokasi Pengambilan / COD"
        v-model="modelValue.lokasi"
        placeholder="Contoh: Bandung Kota"
        :error="errors.lokasi"
        :disabled="loading"
      />
    </div>

    <!-- Foto Barang -->
    <KTPUpload 
      v-model="localFile" 
      label="Foto Barang Bayi" 
      class="mt-xs"
    />
  </form>
</template>

<script>
import { ref, watch } from 'vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import KTPUpload from '../../Auth/register/components/KTPUpload.vue';

export default {
  name: 'ItemForm',
  components: {
    BaseInput,
    KTPUpload,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'update:file'],
  setup(props, { emit }) {
    const localFile = ref(null);

    watch(localFile, (val) => {
      emit('update:file', val);
    });

    return {
      localFile,
    };
  },
};
</script>

<style scoped>
.textarea-custom {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
}

.textarea-custom:focus {
  border-color: var(--color-primary);
}

.error-text {
  font-size: 12px;
  color: var(--color-error);
}

.input-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  margin-bottom: var(--spacing-xxs);
  display: block;
}
</style>
