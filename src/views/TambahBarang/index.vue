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
        :disabled="isLoading"
        :loading="isLoading"
        @click="handleSubmit"
      >
        Tambah Barang
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
      errorMessage,
      successMessage,
      handleFileChange,
      handleSubmit,
    } = useTambahBarang(router);

    return {
      form,
      errors,
      isLoading,
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
