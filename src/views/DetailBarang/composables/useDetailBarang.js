import { ref, computed, onMounted } from 'vue';
import api from '../../../services/api';

export default function useDetailBarang(itemId, router) {
  const item = ref(null);
  const isLoading = ref(true);
  const errorMessage = ref('');
  const reviews = ref([]);

  // Form Booking State
  const showModal = ref(false);
  const isSubmitting = ref(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const startDate = ref(todayStr);
  const endDate = ref(tomorrowStr);

  const bankDeposit = ref('BCA');
  const rekeningDeposit = ref('');
  const namaRekeningDeposit = ref('');

  const fetchItemDetails = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await api.get(`/api/items/${itemId}`);
      item.value = response.data?.data || response.data;
    } catch (error) {
      console.error('Fetch item details error:', error);
      errorMessage.value = error.response?.data?.message || 'Gagal memuat rincian barang sewa.';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/api/items/${itemId}/reviews`);
      reviews.value = response.data?.data || [];
    } catch (error) {
      console.error('Fetch reviews error:', error);
    }
  };

  const pricePerDay = computed(() => {
    if (!item.value) return 0;
    return item.value.harga_sewa_per_hari !== undefined ? item.value.harga_sewa_per_hari : (item.value.price || 0);
  });

  const depositAmount = computed(() => {
    if (!item.value) return 0;
    return item.value.deposit !== undefined ? item.value.deposit : 0;
  });

  const durationDays = computed(() => {
    if (!startDate.value || !endDate.value) return 0;
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = end - start;
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  const totalRent = computed(() => {
    return pricePerDay.value * durationDays.value;
  });

  const adminFee = ref(10000);

  const grandTotal = computed(() => {
    if (durationDays.value <= 0) return 0;
    return totalRent.value + depositAmount.value + adminFee.value;
  });

  const submitTransaction = async () => {
    if (durationDays.value <= 0) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const kycStatus = localStorage.getItem('kyc_status') || 'unverified';
    if (kycStatus.toLowerCase() !== 'verified') {
      alert('Anda harus mengunggah KTP dan menunggu persetujuan Admin sebelum dapat melanjutkan');
      router.push('/profile');
      return;
    }

    if (!bankDeposit.value || !rekeningDeposit.value || !namaRekeningDeposit.value) {
      alert('Mohon lengkapi data rekening bank untuk keperluan pengembalian jaminan deposit.');
      return;
    }

    isSubmitting.value = true;
    try {
      const payload = {
        item_id: item.value.id,
        tanggal_mulai: new Date(startDate.value).toISOString(),
        tanggal_selesai: new Date(endDate.value).toISOString(),
        total_harga: totalRent.value,
        jaminan_deposit: depositAmount.value,
        biaya_admin: adminFee.value,
        bank_deposit: bankDeposit.value,
        rekening_deposit: rekeningDeposit.value,
        nama_rekening_deposit: namaRekeningDeposit.value
      };

      const response = await api.post('/api/transactions', payload);
      const invoiceUrl = response.data?.invoice_url;
      if (invoiceUrl) {
        window.location.href = invoiceUrl;
      } else {
        alert('Gagal mendapatkan URL pembayaran dari server.');
      }
    } catch (error) {
      console.error('Submit transaction error:', error);
      alert(error.response?.data?.message || 'Gagal memproses transaksi sewa.');
    } finally {
      isSubmitting.value = false;
    }
  };

  const hubungiPemilik = () => {
    if (!item.value) return;
    const pemilik = item.value.Pemilik || item.value.pemilik || item.value.User || item.value.user;
    const targetNomor = pemilik?.nomor_hp || pemilik?.phone || item.value.nomor_hp || item.value.phone;
    if (!targetNomor) {
      alert('Nomor WhatsApp pemilik tidak ditemukan.');
      return;
    }
    let formattedNumber = String(targetNomor).trim();
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.slice(1);
    }
    const namaBarang = item.value.nama_barang || item.value.name || 'Barang';
    const teks = `Halo, saya melihat barang ${namaBarang} di Sewaki. Apakah barang ini masih tersedia?`;
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(teks)}`, '_blank');
  };

  const currentUser = ref(null);
  const userTransactions = ref([]);
  const reviewRating = ref(5);
  const reviewComment = ref('');
  const isSubmittingReview = ref(false);
  const reviewError = ref('');
  const reviewSuccessMessage = ref('');

  const fetchCurrentUserAndRentals = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const profileRes = await api.get('/api/auth/profile');
      currentUser.value = profileRes.data?.data || profileRes.data;
      
      const rentalsRes = await api.get('/api/transactions/my-rentals');
      userTransactions.value = rentalsRes.data || [];
    } catch (err) {
      console.error('Error fetching current user and rentals:', err);
    }
  };

  const pendingReviewTransaction = computed(() => {
    if (!currentUser.value) return null;
    
    const completedTx = userTransactions.value.filter(
      tx => tx.item_id === itemId && tx.status_transaksi === 'selesai'
    );
    
    for (const tx of completedTx) {
      const alreadyReviewed = reviews.value.some(r => r.id_transaksi === tx.id);
      if (!alreadyReviewed) {
        return tx;
      }
    }
    
    return null;
  });

  const submitReview = async () => {
    if (!pendingReviewTransaction.value) return;
    if (!reviewRating.value || reviewRating.value < 1 || reviewRating.value > 5) {
      reviewError.value = 'Harap berikan rating 1-5 bintang.';
      return;
    }
    
    isSubmittingReview.value = true;
    reviewError.value = '';
    reviewSuccessMessage.value = '';
    
    try {
      const payload = {
        item_id: itemId,
        penyewa_id: currentUser.value.id,
        id_transaksi: pendingReviewTransaction.value.id,
        rating: parseInt(reviewRating.value, 10),
        komentar: reviewComment.value
      };
      
      const response = await api.post(`/api/items/${itemId}/reviews`, payload);
      if (response.data?.success) {
        reviewSuccessMessage.value = response.data?.message || 'Ulasan Anda berhasil ditambahkan!';
        reviewComment.value = '';
        reviewRating.value = 5;
        await fetchReviews();
        await fetchCurrentUserAndRentals();
      } else {
        throw new Error(response.data?.message || 'Gagal mengirim ulasan.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      reviewError.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengirim ulasan.';
    } finally {
      isSubmittingReview.value = false;
    }
  };

  onMounted(() => {
    fetchItemDetails();
    fetchReviews();
    fetchCurrentUserAndRentals();
  });

  return {
    item,
    isLoading,
    errorMessage,
    reviews,
    showModal,
    isSubmitting,
    todayStr,
    startDate,
    endDate,
    bankDeposit,
    rekeningDeposit,
    namaRekeningDeposit,
    pricePerDay,
    depositAmount,
    durationDays,
    totalRent,
    adminFee,
    grandTotal,
    currentUser,
    pendingReviewTransaction,
    reviewRating,
    reviewComment,
    isSubmittingReview,
    reviewError,
    reviewSuccessMessage,
    submitReview,
    submitTransaction,
    hubungiPemilik,
    fetchItemDetails,
  };
}
