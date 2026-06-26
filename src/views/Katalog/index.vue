<template>
  <PageWrapper class="container mt-lg">
    <div class="catalog-header mb-lg">
      <h1 class="display-md text-ink">Katalog Barang Sewa</h1>
      <p class="body-md text-muted">Telusuri perlengkapan berkualitas terbaik untuk kebutuhan buah hati Anda.</p>
    </div>

    <ProductFilter 
      :categories="categories" 
      @filter-change="handleFilterChange" 
    />

    <BaseSpinner v-if="isLoading" />

    <div v-else-if="filteredItems.length === 0" class="empty-state text-center p-xl">
      <p class="body-lg text-muted">Tidak ada barang yang cocok dengan kriteria pencarian Anda.</p>
    </div>

    <div v-else>
      <ProductGrid 
        :items="paginatedItems" 
        @click="navigateToDetail" 
        @rent="navigateToDetail"
      />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-md mt-xl">
        <BaseButton 
          variant="secondary" 
          :disabled="currentPage === 1" 
          @click="prevPage"
        >
          Sebelumnya
        </BaseButton>
        <span class="body-sm text-ink font-semibold">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
        <BaseButton 
          variant="secondary" 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
        >
          Selanjutnya
        </BaseButton>
      </div>
    </div>
  </PageWrapper>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageWrapper from '../../components/layout/PageWrapper.vue';
import ProductFilter from './components/ProductFilter.vue';
import ProductGrid from './components/ProductGrid.vue';
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import api from '../../services/api';
import { dummyItems } from '../../data/dummyData';

export default {
  name: 'KatalogView',
  components: {
    PageWrapper,
    ProductFilter,
    ProductGrid,
    BaseSpinner,
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const items = ref([]);
    const isLoading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = 24;

    const filter = ref({
      search: '',
      category: '',
    });

    const categories = ['Elektronik', 'Fotografi', 'Berkemah', 'Kendaraan', 'Pakaian'];

    const fetchItems = async () => {
      isLoading.value = true;
      try {
        const response = await api.get('/api/items');
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          items.value = data;
        } else {
          items.value = dummyItems;
        }
      } catch (error) {
        console.warn('API error, falling back to dummy:', error);
        items.value = dummyItems;
      } finally {
        isLoading.value = false;
      }
    };

    const handleFilterChange = (newFilter) => {
      filter.value = newFilter;
      currentPage.value = 1;
    };

    const filteredItems = computed(() => {
      let result = items.value;
      const searchVal = filter.value.search.toLowerCase().trim();
      const catVal = filter.value.category;

      if (searchVal) {
        result = result.filter(item => 
          (item.nama_barang || item.name || '').toLowerCase().includes(searchVal) ||
          (item.category || '').toLowerCase().includes(searchVal)
        );
      }

      if (catVal) {
        result = result.filter(item => item.category === catVal);
      }

      return result;
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / itemsPerPage) || 1;
    });

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredItems.value.slice(start, end);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const navigateToDetail = (itemId) => {
      const id = typeof itemId === 'object' ? itemId.id : itemId;
      router.push(`/katalog/${id}`);
    };

    onMounted(fetchItems);

    return {
      isLoading,
      categories,
      filteredItems,
      paginatedItems,
      currentPage,
      totalPages,
      handleFilterChange,
      nextPage,
      prevPage,
      navigateToDetail,
    };
  },
};
</script>

<style scoped>
.catalog-header {
  text-align: left;
}
</style>
