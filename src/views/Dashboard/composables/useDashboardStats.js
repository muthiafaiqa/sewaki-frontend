import { ref, onMounted } from 'vue';
import api from '../../../services/api';

export default function useDashboardStats() {
  const isLoading = ref(true);
  const errorMessage = ref('');
  const dashboardData = ref(null);
  const userProfile = ref(null);

  // Withdraw State
  const showWithdrawModal = ref(false);
  const withdrawLoading = ref(false);
  const withdrawError = ref('');
  const withdrawSuccess = ref('');
  const withdrawForm = ref({
    bankCode: 'BCA',
    accountNumber: '',
    accountName: '',
    amount: 0,
  });

  const fetchDashboardData = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await api.get('/api/dashboard/stats');
      dashboardData.value = response.data?.data || response.data;
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal memuat data statistik dashboard.';
    } finally {
      isLoading.value = false;
    }
  };

  const openWithdrawModal = async () => {
    withdrawError.value = '';
    withdrawSuccess.value = '';
    withdrawForm.value.amount = dashboardData.value?.saldoBisaDicairkan || 0;
    showWithdrawModal.value = true;

    if (!userProfile.value) {
      try {
        const response = await api.get('/api/auth/profile');
        userProfile.value = response.data?.data || response.data;
        if (userProfile.value?.name || userProfile.value?.nama) {
          withdrawForm.value.accountName = userProfile.value.name || userProfile.value.nama;
        }
      } catch (err) {
        console.error('Gagal mengambil profil user:', err);
      }
    }
  };

  const handleWithdraw = async (payload) => {
    withdrawError.value = '';
    withdrawSuccess.value = '';
    withdrawLoading.value = true;

    try {
      const response = await api.post('/api/payments/withdraw', {
        id_transaksi: `wd-${Date.now()}`,
        jumlah_uang: parseInt(payload.amount, 10),
        kode_bank: payload.bankCode,
        nama_pemilik_rekening: payload.accountName,
        nomor_rekening: payload.accountNumber,
        deskripsi: `Penarikan Saldo Pemilik SewaKi`,
        email_user: userProfile.value?.email || ''
      });

      if (response.data?.success) {
        withdrawSuccess.value = 'Penarikan dana berhasil diproses. Silakan cek email Anda.';
        await fetchDashboardData();
        setTimeout(() => {
          showWithdrawModal.value = false;
        }, 1500);
      } else {
        withdrawError.value = response.data?.message || 'Gagal melakukan penarikan dana.';
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      withdrawError.value = err.response?.data?.error_detail || err.response?.data?.message || 'Terjadi kesalahan sistem saat melakukan penarikan dana.';
    } finally {
      withdrawLoading.value = false;
    }
  };

  onMounted(fetchDashboardData);

  return {
    isLoading,
    errorMessage,
    dashboardData,
    showWithdrawModal,
    withdrawLoading,
    withdrawError,
    withdrawSuccess,
    withdrawForm,
    fetchDashboardData,
    openWithdrawModal,
    handleWithdraw,
  };
}
