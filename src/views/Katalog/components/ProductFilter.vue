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

    <!-- Filter Jarak Terdekat -->
    <div class="location-filter-row mt-md flex items-center justify-between gap-md flex-wrap">
      <div class="flex items-center gap-sm">
        <label class="switch">
          <input 
            type="checkbox" 
            v-model="localNearMe" 
            @change="emitFilter" 
          />
          <span class="slider"></span>
        </label>
        <span class="switch-text font-medium text-ink flex items-center gap-xs">
          Cari yang Terdekat dari Saya
        </span>
      </div>

      <div class="radius-box flex items-center gap-sm" :class="{ 'disabled-opacity': !localNearMe }">
        <label class="body-sm text-muted font-medium">Radius Jarak:</label>
        <select 
          v-model="localRadius" 
          @change="emitFilter"
          class="radius-select"
          :disabled="!localNearMe"
        >
          <option value="5">5 KM</option>
          <option value="10">10 KM</option>
          <option value="25">25 KM</option>
          <option value="all">Semua Jarak</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
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
    nearMe: {
      type: Boolean,
      default: false,
    },
    radius: {
      type: String,
      default: 'all',
    },
  },
  emits: ['filter-change'],
  setup(props, { emit }) {
    const localSearch = ref('');
    const localCategory = ref('');
    const localNearMe = ref(props.nearMe);
    const localRadius = ref(props.radius);

    watch(() => props.nearMe, (newVal) => {
      localNearMe.value = newVal;
    });

    watch(() => props.radius, (newVal) => {
      localRadius.value = newVal;
    });

    const emitFilter = () => {
      emit('filter-change', {
        search: localSearch.value,
        category: localCategory.value,
        nearMe: localNearMe.value,
        radius: localRadius.value,
      });
    };

    return {
      localSearch,
      localCategory,
      localNearMe,
      localRadius,
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

/* Custom Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-hairline, #e4e4e4);
  transition: .3s;
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

input:checked + .slider {
  background-color: #FF385C; /* Airbnb rausch-red brand color */
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* Radius select */
.radius-select {
  height: 36px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  min-width: 120px;
  cursor: pointer;
  transition: border-color 0.2s, opacity 0.2s;
}

.radius-select:focus:not(:disabled) {
  border-color: #FF385C;
}

.radius-select:disabled {
  background-color: var(--color-surface-soft);
  color: var(--color-muted);
  cursor: not-allowed;
}

.disabled-opacity {
  opacity: 0.6;
}

.location-filter-row {
  border-top: 1px solid var(--color-hairline);
  padding-top: var(--spacing-md);
}

.switch-text {
  font-size: 14px;
  user-select: none;
}
</style>
