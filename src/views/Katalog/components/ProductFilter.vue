<template>
  <div class="filter-panel mb-lg">
    <div class="flex justify-between items-center gap-md flex-wrap">
      <div class="search-box flex-1">
        <BaseInput
          id="catalog-search"
          v-model="localSearch"
          placeholder="Cari barang sewa..."
          @input="emitFilter"
        />
      </div>

      <div class="category-box">
        <select 
          v-model="localCategory" 
          @change="emitFilter"
          class="category-select"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import BaseInput from '../../../components/ui/BaseInput.vue';

export default {
  name: 'ProductFilter',
  components: {
    BaseInput,
  },
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['filter-change'],
  setup(props, { emit }) {
    const localSearch = ref('');
    const localCategory = ref('');

    const emitFilter = () => {
      emit('filter-change', {
        search: localSearch.value,
        category: localCategory.value,
      });
    };

    return {
      localSearch,
      localCategory,
      emitFilter,
    };
  },
};
</script>

<style scoped>
.filter-panel {
  background-color: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  padding: var(--spacing-md);
}

.category-select {
  height: 40px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  min-width: 160px;
  cursor: pointer;
}

.category-select:focus {
  border-color: var(--color-primary);
}
</style>
