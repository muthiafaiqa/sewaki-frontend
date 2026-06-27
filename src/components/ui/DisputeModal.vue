<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-[16px] max-w-[500px] w-full p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative text-left">
      <!-- Header -->
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 rounded-full bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center shrink-0 text-[#f97316]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-[#111111] font-sans m-0">Ajukan Komplain / Kendala</h3>
          <p class="text-xs text-[#6b7280] font-sans mt-1 m-0 leading-relaxed">
            Laporkan masalah transaksi ini ke Admin untuk dilakukan penengahan manual.
          </p>
        </div>
      </div>

      <!-- Alert Error -->
      <div v-if="errorMsg" class="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-xs text-[#dc2626] font-semibold font-sans">
        {{ errorMsg }}
      </div>

      <!-- Form Inputs -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Dropdown Kategori Masalah -->
        <div>
          <label class="block text-xs font-bold text-[#374151] font-sans mb-1.5">Kategori Masalah <span class="text-red-500">*</span></label>
          <select 
            v-model="kategori" 
            class="w-full h-[44px] px-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm text-[#111111] font-sans outline-none transition-colors focus:border-[#111111] focus:bg-white"
          >
            <option value="Barang Rusak Semenjak Diterima">Barang Rusak Semenjak Diterima</option>
            <option value="Denda Pemilik Terlalu Besar">Denda Pemilik Terlalu Besar</option>
            <option value="Keterlambatan Tidak Sesuai">Keterlambatan Tidak Sesuai</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <!-- Textarea Kronologi Deskripsi -->
        <div>
          <label class="block text-xs font-bold text-[#374151] font-sans mb-1.5">Deskripsi Kronologi Kendala <span class="text-red-500">*</span></label>
          <textarea 
            v-model="deskripsi" 
            rows="4" 
            placeholder="Jelaskan secara rinci kronologi masalah atau ketidaksepakatan yang terjadi..." 
            class="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm text-[#111111] font-sans outline-none transition-colors resize-none placeholder:text-[#9ca3af] focus:border-[#111111] focus:bg-white"
          ></textarea>
        </div>

        <!-- Input File Bukti Pendukung -->
        <div>
          <label class="block text-xs font-bold text-[#374151] font-sans mb-1.5">Foto/Video Bukti Pendukung (Opsional)</label>
          <input 
            type="file" 
            @change="handleFileChange" 
            accept="image/*,video/*" 
            class="w-full text-xs text-[#6b7280] font-sans file:mr-3 file:py-2 file:px-4 file:rounded-md file:border border-[#e5e7eb] file:text-xs file:font-semibold file:bg-[#f3f4f6] file:text-[#111111] hover:file:bg-[#e5e7eb] cursor-pointer"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-3">
          <button 
            type="button" 
            @click="handleClose" 
            class="px-4 py-2.5 bg-white border border-[#e5e7eb] text-[#374151] rounded-lg text-xs font-bold font-sans hover:bg-[#f9fafb] transition-colors"
            :disabled="isLoading"
          >
            Batal
          </button>
          <button 
            type="submit" 
            class="px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-bold font-sans shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Sending...</span>
            <span v-else>Kirim Laporan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  transaction: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'submit']);

const kategori = ref('Barang Rusak Semenjak Diterima');
const deskripsi = ref('');
const buktiFile = ref(null);
const errorMsg = ref('');

watch(() => props.show, (newVal) => {
  if (newVal) {
    kategori.value = 'Barang Rusak Semenjak Diterima';
    deskripsi.value = '';
    buktiFile.value = null;
    errorMsg.value = '';
  }
});

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    buktiFile.value = e.target.files[0];
  }
};

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!deskripsi.value.trim()) {
    errorMsg.value = 'Mohon isi deskripsi kronologi kendala secara detail.';
    return;
  }
  errorMsg.value = '';
  emit('submit', {
    kategori: kategori.value,
    deskripsi: deskripsi.value,
    bukti: buktiFile.value,
    transaction: props.transaction,
  });
};
</script>
