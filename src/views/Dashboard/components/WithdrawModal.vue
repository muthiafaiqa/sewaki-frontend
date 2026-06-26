<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="title-sm text-ink">Form Tarik Dana</h3>
    </template>

    <form @submit.prevent="handleSubmit" class="withdraw-modal-form text-left flex flex-col gap-sm">
      <div v-if="error" class="alert-error p-sm mb-xs">{{ error }}</div>
      <div v-if="success" class="alert-success p-sm mb-xs">{{ success }}</div>

      <div class="form-group">
        <label for="wdBank" class="input-label">Pilih Bank</label>
        <select id="wdBank" v-model="form.bankCode" class="select-custom">
          <option value="BCA">BCA (Bank Central Asia)</option>
          <option value="MANDIRI">Mandiri</option>
          <option value="BNI">BNI (Bank Negara Indonesia)</option>
          <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
          <option value="CIMB">CIMB Niaga</option>
        </select>
      </div>

      <BaseInput
        id="wdRekening"
        label="Nomor Rekening"
        v-model="form.accountNumber"
        placeholder="Masukkan nomor rekening tujuan"
        required
      />

      <BaseInput
        id="wdNama"
        label="Nama Pemilik Rekening"
        v-model="form.accountName"
        placeholder="Masukkan nama pemilik rekening"
        required
      />

      <div class="form-group">
        <label for="wdAmount" class="input-label">Jumlah Penarikan (Rp)</label>
        <input 
          id="wdAmount" 
          type="number" 
          v-model.number="form.amount" 
          :max="maxAmount" 
          min="1"
          class="input-custom" 
          required 
        />
        <span class="body-xs text-muted mt-xxs">Maksimal penarikan: {{ formatPrice(maxAmount) }}</span>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="$emit('close')" :disabled="loading">
        Batal
      </BaseButton>
      <BaseButton variant="primary" :disabled="loading || form.amount <= 0 || form.amount > maxAmount" :loading="loading" @click="handleSubmit">
        Konfirmasi Penarikan
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import { reactive, watch } from 'vue';
import BaseModal from '../../../components/ui/BaseModal.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';

export default {
  name: 'WithdrawModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    maxAmount: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    success: {
      type: String,
      default: '',
    },
    initialForm: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const form = reactive({
      bankCode: 'BCA',
      accountNumber: '',
      accountName: '',
      amount: 0,
    });

    watch(() => props.initialForm, (newVal) => {
      if (newVal) {
        form.bankCode = newVal.bankCode || 'BCA';
        form.accountNumber = newVal.accountNumber || '';
        form.accountName = newVal.accountName || '';
        form.amount = newVal.amount || 0;
      }
    }, { immediate: true, deep: true });

    const formatPrice = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const handleSubmit = () => {
      emit('submit', { ...form });
    };

    return {
      form,
      formatPrice,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.select-custom {
  width: 100%;
  height: 40px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.input-custom {
  width: 100%;
  height: 40px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-hairline);
  border-radius: var(--rounded-md);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.input-custom:focus {
  border-color: var(--color-primary);
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--color-error);
  border-radius: var(--rounded-md);
  font-size: 13px;
}

.alert-success {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: var(--color-success);
  border-radius: var(--rounded-md);
  font-size: 13px;
}

.input-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  margin-bottom: var(--spacing-xxs);
  display: block;
}
</style>
