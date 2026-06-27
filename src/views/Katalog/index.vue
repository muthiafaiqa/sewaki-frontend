<template>
  <PageWrapper class="container mt-lg">
    <div class="catalog-header mb-lg">
      <h1 class="display-md text-ink">Katalog Barang Sewa</h1>
      <p class="body-md text-muted">Telusuri perlengkapan berkualitas terbaik untuk kebutuhan buah hati Anda.</p>
    </div>

    <ProductFilter 
      :categories="categories" 
      :nearMe="filter.nearMe"
      :radius="filter.radius"
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

    <!-- GPS Location Warning Modal -->
    <BaseModal :show="showGpsModal" @close="showGpsModal = false">
      <template #header>
        <div class="flex items-center gap-sm text-primary font-bold">
          <span style="font-size: 20px;">📍</span> Lokasi GPS Diperlukan
        </div>
      </template>
      
      <div class="modal-alert-body text-center p-md">
        <div class="alert-icon mb-md">
          <div class="icon-circle">
            <span class="icon-pin">📍</span>
          </div>
        </div>
        <p class="body-md text-ink font-medium mb-sm">
          Mohon aktifkan lokasi GPS Anda di halaman Profil terlebih dahulu untuk menggunakan fitur ini.
        </p>
        <p class="body-sm text-muted">
          Kami memerlukan koordinat lokasi Anda untuk mencari dan menyortir barang sewa terdekat dari posisi Anda.
        </p>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="showGpsModal = false">
          Batal
        </BaseButton>
        <BaseButton variant="primary" @click="navigateToProfile">
          Buka Profil
        </BaseButton>
      </template>
    </BaseModal>
  </PageWrapper>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageWrapper from '../../components/layout/PageWrapper.vue';
import ProductFilter from './components/ProductFilter.vue';
import ProductGrid from './components/ProductGrid.vue';
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import BaseModal from '../../components/ui/BaseModal.vue';
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
    BaseModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const items = ref([]);
    const isLoading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = 24;

    const filter = ref({
      search: route.query.search || '',
      category: route.query.category || '',
      nearMe: false,
      radius: 'all',
    });

    watch(() => route.query.search, (newSearch) => {
      filter.value.search = newSearch || '';
    });

    watch(() => route.query.category, (newCategory) => {
      filter.value.category = newCategory || '';
    });

    const currentUser = ref(null);
    const showGpsModal = ref(false);

    const categories = ['Elektronik', 'Fotografi', 'Berkemah', 'Kendaraan', 'Pakaian'];

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const response = await api.get('/api/auth/profile');
        currentUser.value = response.data?.data || response.data;
        return currentUser.value;
      } catch (error) {
        console.error('Gagal mengambil data profil user:', error);
        return null;
      }
    };

    const fetchItems = async () => {
      isLoading.value = true;
      try {
        const params = {};
        
        // Cek jika filter terdekat aktif dan radius bukan semua jarak ('all')
        if (filter.value.nearMe && filter.value.radius !== 'all') {
          const lat = currentUser.value?.latitude;
          const lng = currentUser.value?.longitude;
          if (lat && lng) {
            params.latitude = lat;
            params.longitude = lng;
            params.radius = filter.value.radius;
          }
        }

        const response = await api.get('/api/items', { params });
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          items.value = data;
        } else {
          // Jika kosong, backend mungkin memang tidak menemukan barang
          items.value = [];
        }
      } catch (error) {
        console.warn('API error, falling back to dummy:', error);
        items.value = dummyItems;
      } finally {
        isLoading.value = false;
      }
    };

    const handleFilterChange = async (newFilter) => {
      const isNearMeToggled = newFilter.nearMe && !filter.value.nearMe;
      
      // Update filter values
      filter.value = {
        ...filter.value,
        ...newFilter
      };

      if (filter.value.nearMe) {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Silakan login terlebih dahulu untuk menggunakan fitur pencarian terdekat.');
          filter.value.nearMe = false;
          router.push('/login');
          return;
        }

        // Ambil profil jika belum ter-cache
        if (!currentUser.value) {
          isLoading.value = true;
          const userProfile = await fetchUserProfile();
          isLoading.value = false;
          if (!userProfile) {
            filter.value.nearMe = false;
            return;
          }
        }

        // Validasi GPS
        const lat = currentUser.value?.latitude;
        const lng = currentUser.value?.longitude;

        if (!lat || !lng) {
          filter.value.nearMe = false;
          showGpsModal.value = true;
          return;
        }
      }

      currentPage.value = 1;
      await fetchItems();
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

    const navigateToProfile = () => {
      showGpsModal.value = false;
      router.push('/profile');
    };

    onMounted(fetchItems);

    return {
      isLoading,
      categories,
      filteredItems,
      paginatedItems,
      currentPage,
      totalPages,
      filter,
      showGpsModal,
      handleFilterChange,
      nextPage,
      prevPage,
      navigateToDetail,
      navigateToProfile,
    };
  },
};
</script>

<style scoped>
.catalog-header {
  text-align: left;
}

/* Modal GPS alert styling */
.modal-alert-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alert-icon {
  margin-bottom: var(--spacing-md);
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: rgba(255, 56, 92, 0.1);
  border-radius: 50%;
}

.icon-pin {
  font-size: 32px;
}
</style>
