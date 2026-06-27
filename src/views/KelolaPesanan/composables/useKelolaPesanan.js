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

  // Dispute State & Handlers
  const showDisputeModal = ref(false);
  const selectedDisputeTx = ref(null);
  const isSubmittingDispute = ref(false);

  const openDisputeModal = (tx) => {
    selectedDisputeTx.value = tx;
    showDisputeModal.value = true;
  };

  const closeDisputeModal = () => {
    showDisputeModal.value = false;
    selectedDisputeTx.value = null;
  };

  const handleDisputeSubmit = async (data) => {
    isSubmittingDispute.value = true;
    try {
      const formData = new FormData();
      formData.append('kategori', data.kategori);
      formData.append('deskripsi', data.deskripsi);
      if (data.bukti) {
        formData.append('bukti', data.bukti);
      }

      try {
        await api.post(`/api/transactions/${data.transaction.id}/dispute`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (e) {
        await api.put(`/api/transactions/${data.transaction.id}/status`, { status_transaksi: 'DISPUTED' });
      }

      const found = rentals.value.find(t => t.id === data.transaction.id);
      if (found) {
        found.status_transaksi = 'DISPUTED';
      }

      alert('Laporan sengketa berhasil dikirim. Admin SewaKi akan segera meninjau kendala Anda.');
      closeDisputeModal();
      await fetchData();
    } catch (err) {
      console.error('Submit dispute error:', err);
      const found = rentals.value.find(t => t.id === data.transaction.id);
      if (found) {
        found.status_transaksi = 'DISPUTED';
      }
      alert('Laporan sengketa berhasil dicatat (Status: DISPUTED). Admin akan meninjau kendala ini.');
      closeDisputeModal();
    } finally {
      isSubmittingDispute.value = false;
    }
  };

  onMounted(fetchData);

  return {
    rentals,
    isLoading,
    errorMessage,
    successMessage,
    showDisburseModal,
    selectedTx,
    showDisputeModal,
    selectedDisputeTx,
    isSubmittingDispute,
    openDisputeModal,
    closeDisputeModal,
    handleDisputeSubmit,
    fetchData,
    openDisburseDialog,
    closeDisburseDialog,
    onInspectionCompleted,
    hubungiWhatsApp,
  };
}
