<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="modal-main-title">Konfirmasi Penyewaan</h3>
    </template>

    <div class="booking-modal-body">
      <h4 class="item-name-heading">{{ itemName }}</h4>

      <!-- Date Pickers Grid -->
      <div class="date-pickers-layout">
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
      <div v-if="durationDays <= 0" class="date-warning-card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="warning-icon">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Tanggal selesai sewa harus setelah tanggal mulai.</span>
      </div>

      <!-- Price Breakdown Receipt -->
      <div v-else class="receipt-card-layout">
        <h4 class="receipt-title">Rincian Biaya</h4>
        <div class="receipt-items-list">
          <div class="receipt-item-row">
            <span class="receipt-lbl">Harga Sewa ({{ formatPrice(pricePerDay) }} × {{ durationDays }} hari)</span>
            <span class="receipt-val">{{ formatPrice(totalRent) }}</span>
          </div>
          <div class="receipt-item-row">
            <span class="receipt-lbl">Jaminan Deposit (Refundable)</span>
            <span class="receipt-val">{{ formatPrice(depositAmount) }}</span>
          </div>
          <div class="receipt-item-row">
            <span class="receipt-lbl">Biaya Admin</span>
            <span class="receipt-val">{{ formatPrice(adminFee) }}</span>
          </div>
          <hr class="receipt-line-divider" />
          <div class="receipt-item-row grand-total-row">
            <span class="total-lbl">Total Tagihan</span>
            <span class="total-val">{{ formatPrice(grandTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- Bank Refund Form -->
      <div v-if="durationDays > 0" class="bank-refund-form">
        <h4 class="bank-section-title">Rekening Pengembalian Deposit</h4>
        <p class="bank-section-subtitle">Dana jaminan didepositkan kembali secara otomatis ke rekening ini.</p>

        <div class="bank-inputs-stack">
          <div class="form-group-select">
            <label for="bankSelect" class="select-label">Nama Bank Tujuan</label>
            <div class="select-wrapper">
              <select id="bankSelect" v-model="localBank" class="select-custom">
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="MANDIRI">MANDIRI</option>
                <option value="BRI">BRI</option>
                <option value="DANA">DANA</option>
                <option value="OVO">OVO</option>
                <option value="GOPAY">GOPAY</option>
              </select>
              <div class="select-arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down">
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
      <div class="modal-footer-actions">
        <button class="btn-modal-cancel" @click="$emit('close')" :disabled="submitting">
          Batal
        </button>
        <button 
          class="btn-modal-submit"
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
  },
  emits: ['close', 'update-dates', 'submit'],
  setup(props, { emit }) {
    const localStartDate = ref(props.startDate);
    const localEndDate = ref(props.endDate);
    const localBank = ref('BCA');
    const localRekening = ref('');
    const localNamaRekening = ref('');

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

<style scoped>
.modal-main-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-ink);
  font-family: var(--font-sans);
  margin: 0;
  letter-spacing: -0.01em;
}

.booking-modal-body {
  padding: 8px 0;
  text-align: left;
}

.item-name-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 16px 0;
  font-family: var(--font-sans);
}

.date-pickers-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 480px) {
  .date-pickers-layout {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Date warning styling */
.date-warning-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 10px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
}

.warning-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Price Breakdown Receipt */
.receipt-card-layout {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.receipt-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 12px 0;
  font-family: var(--font-sans);
}

.receipt-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.receipt-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-family: var(--font-sans);
}

.receipt-lbl {
  color: var(--color-muted);
  font-weight: 500;
}

.receipt-val {
  color: var(--color-ink);
  font-weight: 600;
}

.receipt-line-divider {
  border: 0;
  border-top: 1px solid var(--color-hairline);
  margin: 4px 0;
}

.grand-total-row {
  font-size: 14.5px;
  font-weight: 700;
  margin-top: 2px;
}

.total-lbl {
  color: var(--color-ink);
}

.total-val {
  color: var(--color-ink);
}

/* Bank Refund Form */
.bank-refund-form {
  border-top: 1px solid var(--color-hairline);
  padding-top: 20px;
}

.bank-section-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  font-family: var(--font-sans);
}

.bank-section-subtitle {
  font-size: 12px;
  color: var(--color-muted);
  margin: 4px 0 16px 0;
  font-family: var(--font-sans);
  line-height: 1.4;
}

.bank-inputs-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Custom Select styling */
.form-group-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  font-family: var(--font-sans);
  text-align: left;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-custom {
  width: 100%;
  height: 52px;
  padding: 0 40px 0 16px;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 14.5px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.select-custom:focus {
  border-color: var(--color-ink);
  border-width: 2px;
}

.select-arrow-icon {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: var(--color-muted);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.chevron-down {
  width: 18px;
  height: 18px;
}

/* Footer Action Buttons */
.modal-footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.btn-modal-cancel {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.btn-modal-cancel:hover {
  background: var(--color-surface-soft);
  color: var(--color-ink);
  border-color: var(--color-muted-soft);
}

.btn-modal-submit {
  padding: 12px 24px;
  background: #ff385c;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
  box-shadow: 0 2px 8px rgba(255, 56, 92, 0.15);
}

.btn-modal-submit:hover:not(:disabled) {
  background: #e00b41;
  transform: translateY(-1px);
}

.btn-modal-submit:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn-modal-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
