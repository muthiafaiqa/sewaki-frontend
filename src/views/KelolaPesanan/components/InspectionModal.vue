<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="modal-main-title">Form Inspeksi Barang</h3>
    </template>

    <div class="modal-body-container">
      <InspectionForm 
        v-slot 
        v-if="transaction" 
        :transaction="transaction" 
        @completed="$emit('completed')" 
      />
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from '../../../components/ui/BaseModal.vue';
import InspectionForm from '../../../components/InspectionForm.vue';

export default {
  name: 'InspectionModal',
  components: {
    BaseModal,
    InspectionForm,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    transaction: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'completed'],
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
  padding: 8px 0;
  text-align: left;
}
</style>
