<template>
  <PageWrapper>
    <HeroSection />
    <FeatureList />
    <ProductPromo />
  </PageWrapper>
</template>

<script>
import PageWrapper from '../../components/layout/PageWrapper.vue';
import HeroSection from './components/HeroSection.vue';
import FeatureList from './components/FeatureList.vue';
import ProductPromo from './components/ProductPromo.vue';

export default {
  name: 'HomeView',
  components: {
    PageWrapper,
    HeroSection,
    FeatureList,
    ProductPromo,
  },
};
</script>
