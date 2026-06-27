<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="text-[18px] font-extrabold text-ink font-sans m-0 tracking-[-0.01em]">Konfirmasi Penyewaan</h3>
    </template>

    <div class="py-[8px] px-0 text-left">
      <h4 class="text-[15px] font-bold text-ink mb-[16px] font-sans">{{ itemName }}</h4>

      <!-- Date Pickers Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-[12px] sm:gap-[16px] mb-[16px]">
        <BaseInput
          id="startDate"
          type="date"
          label="Tanggal Mulai Sewa"
          v-model="localStartDate"
          :min="todayStr"
          heightClass="h-[52px]"
          focusClass="focus:border-black"
          @input="emitDates"
        />
        <BaseInput
          id="endDate"
          type="date"
          label="Tanggal Selesai Sewa"
          v-model="localEndDate"
          :min="localStartDate || todayStr"
          heightClass="h-[52px]"
          focusClass="focus:border-black"
          @input="emitDates"
        />
      </div>

      <!-- Warning if invalid dates -->
      <div v-if="durationDays <= 0" class="flex items-center gap-[10px] p-[14px_16px] bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded-[10px] text-[#ef4444] text-[13px] font-semibold font-sans">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Tanggal selesai sewa harus setelah tanggal mulai.</span>
      </div>

      <!-- Price Breakdown Receipt -->
      <div v-else class="bg-surface-soft border border-hairline rounded-[12px] p-[16px] mb-[24px]">
        <h4 class="text-[13.5px] font-bold text-ink mb-[12px] font-sans">Rincian Biaya</h4>
        <div class="flex flex-col gap-[8px]">
          <div class="flex justify-between items-center text-[13px] font-sans">
            <span class="text-muted font-medium">Harga Sewa ({{ formatPrice(pricePerDay) }} × {{ durationDays }} hari)</span>
            <span class="text-ink font-bold">{{ formatPrice(totalRent) }}</span>
          </div>
          <div class="flex justify-between items-center text-[13px] font-sans">
            <span class="text-muted font-medium">Jaminan Deposit (Refundable)</span>
            <span class="text-ink font-bold">{{ formatPrice(depositAmount) }}</span>
          </div>
          <div class="flex justify-between items-center text-[13px] font-sans">
            <span class="text-muted font-medium">Biaya Admin</span>
            <span class="text-ink font-bold">{{ formatPrice(adminFee) }}</span>
          </div>
          <hr class="border-0 border-t border-hairline my-[4px]" />
          <div class="flex justify-between items-center text-[14.5px] font-bold mt-[2px]">
            <span class="text-ink">Total Tagihan</span>
            <span class="text-ink">{{ formatPrice(grandTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Bank Refund Form -->
      <div v-if="durationDays > 0" class="border-t border-hairline pt-[20px]">
        <h4 class="text-[14.5px] font-bold text-ink m-0 font-sans">Rekening Pengembalian Deposit</h4>
        <p class="text-[12px] text-muted mt-[4px] mr-0 mb-[16px] ml-0 font-sans leading-[1.4]">Dana jaminan didepositkan kembali secara otomatis ke rekening ini.</p>

        <div class="flex flex-col gap-[16px]">
          <div class="flex flex-col gap-[6px]">
            <label for="bankSelect" class="text-[13px] font-semibold text-ink font-sans text-left">Nama Bank Tujuan</label>
            <div class="relative w-full">
              <select id="bankSelect" v-model="localBank" class="w-full h-[52px] pr-[40px] pl-[16px] border border-hairline rounded-[8px] bg-canvas text-ink font-sans text-[14.5px] font-medium outline-none cursor-pointer appearance-none box-border transition-colors duration-150 ease-in-out focus:border-ink focus:border-2">
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="MANDIRI">MANDIRI</option>
                <option value="BRI">BRI</option>
                <option value="DANA">DANA</option>
                <option value="OVO">OVO</option>
                <option value="GOPAY">GOPAY</option>
              </select>
              <div class="absolute top-1/2 right-[16px] -translate-y-1/2 text-muted pointer-events-none flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <BaseInput
            id="rekening"
            label="Nomor Rekening / E-Wallet"
            v-model="localRekening"
            placeholder="Contoh: 7012345678"
            heightClass="h-[52px]"
            focusClass="focus:border-black"
            required
          />

          <BaseInput
            id="namaRekening"
            label="Nama Pemilik Rekening"
            v-model="localNamaRekening"
            placeholder="Contoh: Budi Santoso"
            heightClass="h-[52px]"
            focusClass="focus:border-black"
            required
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-[12px] w-full">
        <button class="py-[12px] px-[24px] bg-transparent border border-hairline rounded-[8px] text-[14px] font-semibold text-muted cursor-pointer transition-all duration-150 ease-in-out font-sans hover:bg-surface-soft hover:text-ink hover:border-muted-soft" @click="$emit('close')" :disabled="submitting">
          Batal
        </button>
        <button 
          class="py-[12px] px-[24px] bg-[#ff385c] border-none rounded-[8px] text-[14px] font-bold text-white cursor-pointer transition-all duration-150 ease-in-out font-sans shadow-[0_2px_8px_rgba(255,56,92,0.15)] hover:not-disabled:bg-[#e00b41] hover:not-disabled:-translate-y-[1px] active:not-disabled:translate-y-0 active:not-disabled:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          :disabled="durationDays <= 0 || submitting" 
          @click="handleSubmit"
        >
          <span v-if="submitting">Memproses...</span>
          <span v-else>Lanjut ke Pembayaran</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { ref, watch } from 'vue';
import BaseModal from '../../../components/ui/BaseModal.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';

export default {
  name: 'BookingForm',
  components: {
    BaseModal,
    BaseInput,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    itemName: {
      type: String,
      default: '',
    },
    todayStr: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    totalRent: {
      type: Number,
      required: true,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    adminFee: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    userProfile: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'update-dates', 'submit'],
  setup(props, { emit }) {
    const localStartDate = ref(props.startDate);
    const localEndDate = ref(props.endDate);
    const localBank = ref('BCA');
    const localRekening = ref('');
    const localNamaRekening = ref('');

    const populateDefaultBankDetails = () => {
      let bankVal = props.userProfile?.bank_default || props.userProfile?.default_bank;
      let rekeningVal = props.userProfile?.rekening_default || props.userProfile?.default_rekening;
      let namaRekeningVal = props.userProfile?.nama_rekening_default || props.userProfile?.default_nama_rekening;

      if (!bankVal) bankVal = localStorage.getItem('default_bank');
      if (!rekeningVal) rekeningVal = localStorage.getItem('default_rekening');
      if (!namaRekeningVal) namaRekeningVal = localStorage.getItem('default_nama_rekening');

      if (bankVal) {
        localBank.value = bankVal;
      }
      if (rekeningVal) {
        localRekening.value = rekeningVal;
      }
      if (namaRekeningVal) {
        localNamaRekening.value = namaRekeningVal;
      }
    };

    watch(() => props.show, (newVal) => {
      if (newVal) {
        populateDefaultBankDetails();
      }
    });

    watch(() => props.userProfile, () => {
      if (props.show) {
        populateDefaultBankDetails();
      }
    }, { deep: true });

    watch(() => props.startDate, (val) => { localStartDate.value = val; });
    watch(() => props.endDate, (val) => { localEndDate.value = val; });

    const emitDates = () => {
      emit('update-dates', {
        startDate: localStartDate.value,
        endDate: localEndDate.value,
      });
    };

    const formatPrice = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const handleSubmit = () => {
      if (!localBank.value || !localRekening.value || !localNamaRekening.value) {
        alert('Mohon lengkapi data rekening bank untuk keperluan pengembalian jaminan deposit.');
        return;
      }
      emit('submit', {
        bank: localBank.value,
        rekening: localRekening.value,
        namaRekening: localNamaRekening.value,
      });
    };

    return {
      localStartDate,
      localEndDate,
      localBank,
      localRekening,
      localNamaRekening,
      emitDates,
      formatPrice,
      handleSubmit,
    };
  },
};
</script>
