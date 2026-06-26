import { ref, onMounted } from 'vue';
import api from '../../../../services/api';

export default function useAdminDashboard() {
  const users = ref([]);
  const isLoading = ref(true);
  const actionLoading = ref({});
  const errorMessage = ref('');
  const successMessage = ref('');
  const totalPendapatan = ref(0);

  // Lightbox
  const showModal = ref(false);
  const selectedUser = ref(null);
  const activeKtpUrl = ref('');
  const activeUserName = ref('');

  const fetchRevenue = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const response = await api.get('/api/admin/revenue', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      totalPendapatan.value = response.data?.totalPendapatanAdmin || 0;
    } catch (error) {
      console.error('Fetch revenue error:', error);
    }
  };

  const fetchPendingUsers = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await api.get('/api/auth/kyc-list');
      users.value = response.data?.data || response.data || [];
    } catch (error) {
      console.error('Fetch pending users error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal memuat daftar pengajuan KYC.';
    } finally {
      isLoading.value = false;
    }
  };

  const handleApprove = async (userId) => {
    actionLoading.value[userId] = true;
    errorMessage.value = '';
    successMessage.value = '';
    try {
      const response = await api.put(`/api/auth/verify-kyc/${userId}`, { status: 'verified' });
      successMessage.value = response.data?.message || 'Pengguna berhasil diverifikasi!';
      setTimeout(() => { successMessage.value = ''; }, 4000);
      await fetchPendingUsers();
    } catch (error) {
      console.error('Approve KYC error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal menyetujui verifikasi KTP.';
    } finally {
      actionLoading.value[userId] = false;
    }
  };

  const handleReject = async (userId) => {
    actionLoading.value[userId] = true;
    errorMessage.value = '';
    successMessage.value = '';
    try {
      const response = await api.put(`/api/auth/reject-kyc/${userId}`);
      successMessage.value = response.data?.message || 'Pengajuan KTP berhasil ditolak!';
      setTimeout(() => { successMessage.value = ''; }, 4000);
      await fetchPendingUsers();
    } catch (error) {
      console.error('Reject KYC error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal menolak verifikasi KTP.';
    } finally {
      actionLoading.value[userId] = false;
    }
  };

  const getKtpUrl = (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    const baseUrl = api.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
  };

  const openKtpModal = (user) => {
    if (!user.foto_ktp) return;
    selectedUser.value = user;
    activeKtpUrl.value = getKtpUrl(user.foto_ktp);
    activeUserName.value = user.nama;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    selectedUser.value = null;
    activeKtpUrl.value = '';
    activeUserName.value = '';
  };

  onMounted(() => {
    fetchPendingUsers();
    fetchRevenue();
  });

  return {
    users,
    isLoading,
    actionLoading,
    errorMessage,
    successMessage,
    totalPendapatan,
    showModal,
    selectedUser,
    activeKtpUrl,
    activeUserName,
    fetchPendingUsers,
    handleApprove,
    handleReject,
    openKtpModal,
    closeModal,
  };
}
