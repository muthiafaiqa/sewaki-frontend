import { ref, computed, onMounted } from 'vue';
import api from '../../../services/api';

export default function useProfile(router) {
  const user = ref(null);
  const isLoading = ref(true);
  const errorMessage = ref('');
  const redirecting = ref(false);

  // KYC State
  const selectedFile = ref(null);
  const kycStatus = ref('unverified');
  const uploadProgress = ref(false);
  const kycErrorMessage = ref('');
  const kycSuccessMessage = ref('');

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      user.value = response.data?.data || response.data;
      
      const status = user.value?.status_kyc || user.value?.kyc_status || user.value?.kycStatus || 'unverified';
      kycStatus.value = status.toLowerCase();
      localStorage.setItem('kyc_status', kycStatus.value);
      
      if (user.value?.role) {
        localStorage.setItem('role', user.value.role.toLowerCase());
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        redirecting.value = true;
        errorMessage.value = 'Sesi Anda telah berakhir. Mengalihkan ke halaman login...';
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        errorMessage.value = error.response?.data?.message || error.message || 'Gagal memuat profil user.';
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleUploadKtp = async (file) => {
    if (!file) {
      kycErrorMessage.value = 'Silakan pilih file KTP Anda terlebih dahulu.';
      return;
    }
    
    selectedFile.value = file;
    kycErrorMessage.value = '';
    kycSuccessMessage.value = '';
    uploadProgress.value = true;
    
    try {
      const formData = new FormData();
      formData.append('user_id', user.value.id);
      formData.append('ktp', file);
      
      await api.post('/api/auth/upload-ktp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      kycSuccessMessage.value = 'KTP berhasil diunggah! Menunggu persetujuan Admin.';
      kycStatus.value = 'pending';
      localStorage.setItem('kyc_status', 'pending');
      if (user.value) {
        user.value.kyc_status = 'pending';
      }
    } catch (error) {
      console.error('KTP upload error:', error);
      kycErrorMessage.value = error.response?.data?.message || 'Gagal mengunggah KTP.';
    } finally {
      uploadProgress.value = false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('kyc_status');
    redirecting.value = true;
    errorMessage.value = 'Mengalihkan ke halaman login...';
    
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  // Location State
  const locationLoading = ref(false);
  const locationSuccessMessage = ref('');
  const locationErrorMessage = ref('');

  const updateUserLocation = async (latitude, longitude, alamatLengkap) => {
    if (!user.value || !user.value.id) {
      locationErrorMessage.value = 'Data pengguna tidak ditemukan.';
      return;
    }
    
    locationLoading.value = true;
    locationErrorMessage.value = '';
    locationSuccessMessage.value = '';
    
    try {
      const response = await api.put(`/api/auth/${user.value.id}/lokasi`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        alamat_lengkap: alamatLengkap || ''
      });
      
      if (response.data && response.data.success) {
        locationSuccessMessage.value = response.data.message || '📍 Lokasi berhasil diperbarui!';
        if (user.value) {
          user.value.latitude = parseFloat(latitude);
          user.value.longitude = parseFloat(longitude);
          user.value.alamat_lengkap = alamatLengkap || '';
        }
      } else {
        throw new Error(response.data?.message || 'Gagal memperbarui lokasi.');
      }
    } catch (error) {
      console.error('Update location error:', error);
      locationErrorMessage.value = error.response?.data?.message || error.message || 'Terjadi kesalahan saat memperbarui lokasi.';
    } finally {
      locationLoading.value = false;
    }
  };

  const avatarInitials = computed(() => {
    if (!user.value || !user.value.name) return 'U';
    return user.value.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  const roleLabel = computed(() => {
    if (!user.value || !user.value.role) return '-';
    const role = user.value.role.toLowerCase();
    if (role === 'penyewa' || role === 'user') return 'Penyewa';
    if (role === 'pemilik barang' || role === 'pemilik') return 'Pemilik Barang';
    if (role === 'admin') return 'Administrator';
    return user.value.role;
  });

  onMounted(fetchProfile);

  return {
    user,
    isLoading,
    errorMessage,
    redirecting,
    selectedFile,
    kycStatus,
    uploadProgress,
    kycErrorMessage,
    kycSuccessMessage,
    locationLoading,
    locationSuccessMessage,
    locationErrorMessage,
    avatarInitials,
    roleLabel,
    handleUploadKtp,
    handleLogout,
    fetchProfile,
    updateUserLocation,
  };
}
