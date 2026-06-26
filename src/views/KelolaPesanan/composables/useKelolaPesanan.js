import { ref, onMounted } from 'vue';
import api from '../../../services/api';

export default function useKelolaPesanan() {
  const rentals = ref([]);
  const isLoading = ref(true);
  const errorMessage = ref('');
  const successMessage = ref('');
  const currentUserId = ref('');

  // Modal / Inspection State
  const showDisburseModal = ref(false);
  const selectedTx = ref(null);

  const fetchData = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const profileRes = await api.get('/api/auth/profile');
      const user = profileRes.data?.data || profileRes.data;
      currentUserId.value = user?.id || '';

      const txRes = await api.get('/api/transactions');
      const allTransactions = txRes.data?.data || txRes.data || [];

      rentals.value = allTransactions.filter(
        (tx) => tx.item?.pemilik_id === currentUserId.value
      );
    } catch (error) {
      console.error('Fetch owner rentals error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal memuat data kelola pesanan.';
    } finally {
      isLoading.value = false;
    }
  };

  const openDisburseDialog = (tx) => {
    selectedTx.value = tx;
    showDisburseModal.value = true;
  };

  const closeDisburseDialog = () => {
    showDisburseModal.value = false;
    selectedTx.value = null;
  };

  const onInspectionCompleted = async () => {
    successMessage.value = 'Inspeksi selesai! Deposit diproses.';
    setTimeout(() => {
      successMessage.value = '';
      closeDisburseDialog();
    }, 2000);
    await fetchData();
  };

  const hubungiWhatsApp = (pesanan) => {
    const nomorHp = pesanan.User?.nomor_hp || pesanan.penyewa?.phone || pesanan.User?.phone || pesanan.penyewa?.nomor_hp || pesanan.nomor_hp || pesanan.phone;
    if (!nomorHp) {
      alert('Nomor WhatsApp penyewa tidak ditemukan.');
      return;
    }
    let formattedNumber = String(nomorHp).trim();
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.slice(1);
    }
    const teks = `Halo, saya pemilik barang. Saya ingin berdiskusi mengenai pesanan sewa Anda di Sewaki.`;
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(teks)}`, '_blank');
  };

  onMounted(fetchData);

  return {
    rentals,
    isLoading,
    errorMessage,
    successMessage,
    showDisburseModal,
    selectedTx,
    fetchData,
    openDisburseDialog,
    closeDisburseDialog,
    onInspectionCompleted,
    hubungiWhatsApp,
  };
}
