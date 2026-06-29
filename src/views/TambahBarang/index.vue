<template>
  <PageWrapper class="flex justify-center items-center py-xl">
    <BaseCard class="form-card p-xl">
      <div class="form-header text-center mb-xl">
        <div class="icon-placeholder mb-sm">✨</div>
        <h2 class="title-md text-ink font-bold">Tambah Barang Sewa</h2>
        <p class="body-sm text-muted">Daftarkan barang Anda untuk mulai menyewakannya di SewaKi</p>
      </div>

      <div v-if="errorMessage" class="alert alert-error p-sm mb-md">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success p-sm mb-md">{{ successMessage }}</div>

      <ItemForm
        v-model="form"
        :errors="errors"
        :loading="isLoading"
        @update:file="handleFileChange"
      />

      <BaseButton
        variant="primary"
        class="w-full mt-lg"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        <span v-if="isSubmitting" class="flex items-center gap-2 justify-center">
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Menyimpan...</span>
        </span>
        <span v-else>Tambah Barang</span>
      </BaseButton>
    </BaseCard>
  </PageWrapper>
</template>

<script>
import { useRouter } from 'vue-router';
import PageWrapper from '../../components/layout/PageWrapper.vue';
import BaseCard from '../../components/ui/BaseCard.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import ItemForm from './components/ItemForm.vue';
import useTambahBarang from './composables/useTambahBarang';

export default {
  name: 'TambahBarangView',
  components: {
    PageWrapper,
    BaseCard,
    BaseButton,
    ItemForm,
  },
  setup() {
    const router = useRouter();

    const {
      form,
      errors,
      isLoading,
      isSubmitting,
      errorMessage,
      successMessage,
      handleFileChange,
      handleSubmit,
    } = useTambahBarang(router);

    return {
      form,
      errors,
      isLoading,
      isSubmitting,
      errorMessage,
      successMessage,
      handleFileChange,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.form-card {
  width: 100%;
  max-width: 520px;
}

.icon-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--color-surface-soft);
  border-radius: var(--rounded-lg);
  font-size: 24px;
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--color-error);
  border-radius: var(--rounded-md);
  font-size: 13px;
  text-align: left;
}

.alert-success {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: var(--color-success);
  border-radius: var(--rounded-md);
  font-size: 13px;
  text-align: left;
}
</style>
