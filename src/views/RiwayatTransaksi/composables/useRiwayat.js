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
    fetchTransactions,
    isReviewed,
    openReviewModal,
    closeReviewModal,
    submitReview,
    openReturnModal,
    closeReturnModal,
    handleFileChange,
    handleUploadProof,
  };
}
