<template>
  <div class="grid-container">
    <div class="grid grid-cols-4 gap-lg">
      <div v-for="item in items" :key="item.id">
        <ProductCard 
          :item="item" 
          @click="$emit('click', $event)" 
          @rent="$emit('rent', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue';

export default {
  name: 'ProductGrid',
  components: {
    ProductCard,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ['click', 'rent'],
};
</script>

<style scoped>
.grid-container {
  width: 100%;
}
</style>
