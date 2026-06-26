<template>
  <PageWrapper class="container py-lg text-left">
    <BaseCard class="p-lg">
      <h1 class="title-md text-ink font-bold mb-xs">Kelola Deposit</h1>
      <p class="body-md text-muted">Halaman ini digunakan untuk mengelola pengembalian dan pencairan deposit jaminan sewa.</p>
    </BaseCard>
  </PageWrapper>
</template>

<script>
import PageWrapper from '../../../components/layout/PageWrapper.vue';
import BaseCard from '../../../components/ui/BaseCard.vue';

export default {
  name: 'TransaksiKelolaDepositView',
  components: {
    PageWrapper,
    BaseCard,
  },
};
</script>
