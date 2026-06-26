<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="modal-main-title">KTP: {{ activeUserName }}</h3>
    </template>

    <div class="modal-body-container">
      <img :src="ktpUrl" alt="Foto KTP" class="ktp-image-large" />
    </div>

    <template #footer>
      <button class="btn-close-lightbox" @click="$emit('close')">Tutup</button>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from '../../../../components/ui/BaseModal.vue';

export default {
  name: 'KYCLightbox',
  components: {
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    ktpUrl: {
      type: String,
      default: '',
    },
    activeUserName: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
};
</script>

<style scoped>
.modal-main-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-ink);
  font-family: var(--font-sans);
  margin: 0;
  letter-spacing: -0.01em;
}

.modal-body-container {
  padding: 16px 0;
  text-align: center;
}

.ktp-image-large {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.btn-close-lightbox {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  color: var(--color-ink);
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.btn-close-lightbox:hover {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
}

.btn-close-lightbox:active {
  transform: scale(0.98);
}
</style>
