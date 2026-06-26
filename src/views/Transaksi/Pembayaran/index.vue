<template>
  <PageWrapper class="container py-lg text-left">
    <BaseCard class="p-lg">
      <h1 class="title-md text-ink font-bold mb-xs">Transaksi Pembayaran</h1>
      <p class="body-md text-muted">Halaman ini digunakan untuk mengelola pembayaran transaksi sewa.</p>
    </BaseCard>
  </PageWrapper>
</template>

<script>
import PageWrapper from '../../../components/layout/PageWrapper.vue';
import BaseCard from '../../../components/ui/BaseCard.vue';

export default {
  name: 'TransaksiPembayaranView',
  components: {
    PageWrapper,
    BaseCard,
  },
};
</script>
