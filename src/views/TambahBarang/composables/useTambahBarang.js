import { ref, reactive } from 'vue';
import api from '../../../services/api';

export default function useTambahBarang(router) {
  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const selectedFile = ref(null);

  const form = reactive({
    nama_barang: '',
    deskripsi: '',
    harga_sewa_per_hari: '',
    stok: '',
    lokasi: '',
    deposit: 0,
  });

  const errors = reactive({
    nama_barang: '',
    deskripsi: '',
    harga_sewa_per_hari: '',
    stok: '',
    lokasi: '',
    deposit: '',
  });

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    errors.nama_barang = '';
    errors.deskripsi = '';
    errors.harga_sewa_per_hari = '';
    errors.stok = '';
    errors.lokasi = '';
    errors.deposit = '';

    if (!form.nama_barang.trim()) {
      errors.nama_barang = 'Nama barang wajib diisi';
      isValid = false;
    }
    
    if (!form.deskripsi.trim()) {
      errors.deskripsi = 'Deskripsi barang wajib diisi';
      isValid = false;
    }

    if (form.harga_sewa_per_hari === '' || form.harga_sewa_per_hari === null) {
      errors.harga_sewa_per_hari = 'Harga sewa per hari wajib diisi';
      isValid = false;
    } else if (Number(form.harga_sewa_per_hari) < 0) {
      errors.harga_sewa_per_hari = 'Harga sewa tidak boleh bernilai negatif';
      isValid = false;
    }

    if (form.stok === '' || form.stok === null) {
      errors.stok = 'Stok barang wajib diisi';
      isValid = false;
    } else if (Number(form.stok) < 0) {
      errors.stok = 'Stok tidak boleh bernilai negatif';
      isValid = false;
    }

    if (!form.lokasi.trim()) {
      errors.lokasi = 'Lokasi barang wajib diisi';
      isValid = false;
    }

    if (form.deposit === '' || form.deposit === null) {
      errors.deposit = 'Nominal deposit wajib diisi';
      isValid = false;
    } else if (Number(form.deposit) < 0) {
      errors.deposit = 'Deposit tidak boleh bernilai negatif';
      isValid = false;
    }

    return isValid;
  };

  const handleFileChange = (file) => {
    selectedFile.value = file;
  };

  const handleSubmit = async () => {
    errorMessage.value = '';
    successMessage.value = '';

    if (!validateForm()) return;

    isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('name', form.nama_barang);
      formData.append('nama_barang', form.nama_barang);
      formData.append('description', form.deskripsi);
      formData.append('deskripsi', form.deskripsi);
      formData.append('price', Number(form.harga_sewa_per_hari));
      formData.append('harga_sewa_per_hari', Number(form.harga_sewa_per_hari));
      formData.append('stock', Number(form.stok));
      formData.append('stok', Number(form.stok));
      formData.append('location', form.lokasi);
      formData.append('lokasi', form.lokasi);
      formData.append('deposit', Number(form.deposit));
      formData.append('jaminan_deposit', Number(form.deposit));
      
      if (selectedFile.value) {
        formData.append('foto', selectedFile.value);
        formData.append('image', selectedFile.value);
      }

      const response = await api.post('/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      successMessage.value = response.data?.message || 'Barang sewa berhasil ditambahkan!';
      
      // Reset form
      form.nama_barang = '';
      form.deskripsi = '';
      form.harga_sewa_per_hari = '';
      form.stok = '';
      form.lokasi = '';
      form.deposit = 0;
      selectedFile.value = null;

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Add item error:', error);
      if (error.response) {
        errorMessage.value = error.response.data?.message || error.response.data?.error || 'Gagal menambahkan barang sewa. Silakan periksa kembali input Anda.';
      } else {
        errorMessage.value = error.message || 'Terjadi kesalahan saat menambahkan barang.';
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    errors,
    isLoading,
    errorMessage,
    successMessage,
    selectedFile,
    handleFileChange,
    handleSubmit,
  };
}
