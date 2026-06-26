import { ref } from 'vue';
import api from '../../../../services/api';

export default function useAdminKYC() {
  const userIdInput = ref('');
  const isLoading = ref(false);
  const successMessage = ref('');
  const errorMessage = ref('');

  // Antrean simulasi KTP pending untuk admin
  const pendingUsers = ref([
    { id: '101', name: 'Ahmad Dani', email: 'ahmad@example.com', ktpFileName: 'ktp_dani_surabaya.jpg' },
    { id: '102', name: 'Budi Cahyono', email: 'budi.c@example.com', ktpFileName: 'ktp_budi_bandung.png' },
    { id: '103', name: 'Citra Kirana', email: 'citra.kirana@example.com', ktpFileName: 'ktp_citra_jakarta.jpg' }
  ]);

  const verifyUser = async (id) => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    try {
      const response = await api.put(`/api/auth/verify-kyc/${id}`, { status: 'verified' });
      successMessage.value = response.data?.message || `User ID ${id} berhasil diverifikasi (KYC Sukses)!`;
      
      // Hapus dari antrean simulasi
      pendingUsers.value = pendingUsers.value.filter(u => u.id !== id);
      
      // Untuk mempermudah testing lokal oleh admin itu sendiri
      localStorage.setItem('kyc_status', 'verified');
    } catch (error) {
      console.error('KYC verification error:', error);
      errorMessage.value = error.response?.data?.message || `Gagal memverifikasi User ID ${id}.`;
    } finally {
      isLoading.value = false;
    }
  };

  const handleManualVerify = () => {
    if (!userIdInput.value.toString().trim()) {
      errorMessage.value = 'Silakan masukkan User ID terlebih dahulu.';
      return;
    }
    verifyUser(userIdInput.value.toString().trim());
  };

  return {
    userIdInput,
    isLoading,
    successMessage,
    errorMessage,
    pendingUsers,
    verifyUser,
    handleManualVerify,
  };
}
