import { ref, onMounted } from 'vue';
import api from '../../../services/api';

export default function useRiwayat() {
  const transactions = ref([]);
  const reviewsList = ref([]);
  const isLoading = ref(true);
  const errorMessage = ref('');

  // Modal & Upload State
  const showReturnModal = ref(false);
  const selectedTxId = ref(null);
  const selectedFile = ref(null);
  const uploadLoading = ref(false);
  const uploadError = ref('');

  // Review State
  const showReviewModal = ref(false);
  const reviewRating = ref(5);
  const reviewComment = ref('');
  const reviewTx = ref(null);
  const isSubmittingReview = ref(false);
  const reviewError = ref('');

  const fetchTransactions = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await api.get('/api/transactions/my-rentals');
      transactions.value = response.data || [];
      await fetchReviews();
    } catch (error) {
      console.error('Fetch rentals error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal memuat riwayat transaksi Anda.';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get('/api/reviews');
      reviewsList.value = res.data?.data || [];
    } catch (error) {
      console.error('Fetch reviews error:', error);
    }
  };

  const isReviewed = (txId) => {
    return reviewsList.value.some(r => r.id_transaksi === txId);
  };

  const openReviewModal = (tx) => {
    reviewTx.value = tx;
    reviewRating.value = 5;
    reviewComment.value = '';
    reviewError.value = '';
    showReviewModal.value = true;
  };

  const closeReviewModal = () => {
    showReviewModal.value = false;
    reviewTx.value = null;
    reviewRating.value = 5;
    reviewComment.value = '';
    reviewError.value = '';
  };

  const submitReview = async () => {
    if (!reviewRating.value || reviewRating.value < 1 || reviewRating.value > 5) {
      reviewError.value = 'Harap berikan rating 1-5 bintang.';
      return;
    }

    isSubmittingReview.value = true;
    reviewError.value = '';

    try {
      const payload = {
        penyewa_id: reviewTx.value.penyewa_id,
        id_transaksi: reviewTx.value.id,
        rating: reviewRating.value,
        komentar: reviewComment.value
      };

      const response = await api.post(`/api/items/${reviewTx.value.item_id}/reviews`, payload);
      if (response.data?.success) {
        alert('Terima kasih atas ulasan Anda!');
        closeReviewModal();
        await fetchTransactions();
      } else {
        throw new Error(response.data?.message || 'Gagal mengirim ulasan.');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      reviewError.value = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim ulasan.';
    } finally {
      isSubmittingReview.value = false;
    }
  };

  const openReturnModal = (txId) => {
    selectedTxId.value = txId;
    selectedFile.value = null;
    uploadError.value = '';
    showReturnModal.value = true;
  };

  const closeReturnModal = () => {
    showReturnModal.value = false;
    selectedTxId.value = null;
    selectedFile.value = null;
    uploadError.value = '';
  };

  const handleFileChange = (file) => {
    selectedFile.value = file;
  };

  const handleUploadProof = async () => {
    if (!selectedFile.value) {
      uploadError.value = 'Harap upload bukti pengembalian terlebih dahulu!';
      return;
    }

    uploadLoading.value = true;
    uploadError.value = '';

    try {
      const formData = new FormData();
      formData.append('bukti_pengembalian', selectedFile.value);

      const res = await api.put(`/api/transactions/return/${selectedTxId.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success || res.status === 200) {
        closeReturnModal();
        await fetchTransactions();
      } else {
        throw new Error(res.data?.message || 'Gagal mengirim bukti pengembalian.');
      }
    } catch (error) {
      console.error('Submit return proof error:', error);
      uploadError.value = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim bukti.';
    } finally {
      uploadLoading.value = false;
    }
  };

  const handleTransactionExpired = async (txId) => {
    try {
      const response = await api.get(`/api/transactions/${txId}`);
      if (response.data?.success && response.data?.data) {
        const updatedTx = response.data.data;
        const index = transactions.value.findIndex(t => t.id === txId);
        if (index !== -1) {
          transactions.value[index] = updatedTx;
        }
      }
    } catch (error) {
      console.error('Error fetching expired transaction details:', error);
    }
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

      const found = transactions.value.find(t => t.id === data.transaction.id);
      if (found) {
        found.status_transaksi = 'DISPUTED';
      }

      alert('Laporan sengketa berhasil dikirim. Admin SewaKi akan segera meninjau kendala Anda.');
      closeDisputeModal();
      await fetchTransactions();
    } catch (err) {
      console.error('Submit dispute error:', err);
      const found = transactions.value.find(t => t.id === data.transaction.id);
      if (found) {
        found.status_transaksi = 'DISPUTED';
      }
      alert('Laporan sengketa berhasil dicatat (Status: DISPUTED). Admin akan meninjau kendala ini.');
      closeDisputeModal();
    } finally {
      isSubmittingDispute.value = false;
    }
  };

  onMounted(fetchTransactions);

  return {
    transactions,
    reviewsList,
    isLoading,
    errorMessage,
    showReturnModal,
    selectedTxId,
    selectedFile,
    uploadLoading,
    uploadError,
    showReviewModal,
    reviewRating,
    reviewComment,
    reviewTx,
    isSubmittingReview,
    reviewError,
    showDisputeModal,
    selectedDisputeTx,
    isSubmittingDispute,
    openDisputeModal,
    closeDisputeModal,
    handleDisputeSubmit,
    fetchTransactions,
    isReviewed,
    openReviewModal,
    closeReviewModal,
    submitReview,
    openReturnModal,
    closeReturnModal,
    handleFileChange,
    handleUploadProof,
    handleTransactionExpired,
  };
}
