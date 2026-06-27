<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="text-[18px] font-extrabold text-ink font-sans m-0 tracking-[-0.01em]">KTP: {{ activeUserName }}</h3>
    </template>

    <div class="py-[16px] px-0 text-center">
      <img :src="ktpUrl" alt="Foto KTP" class="max-w-full max-h-[400px] object-contain rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]" />
    </div>

    <template #footer>
      <button class="px-[20px] py-[10px] bg-white border border-hairline text-ink rounded-[8px] text-[13.5px] font-semibold cursor-pointer transition-all duration-150 ease-in-out hover:bg-surface-soft hover:border-muted-soft active:scale-[0.98] font-sans" @click="$emit('close')">Tutup</button>
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
