<template>
  <div class="bank-account-form-container text-left">
    <h3 class="bank-title">Rekening Default Deposit</h3>
    <p class="bank-subtitle">Atur rekening default Anda untuk mempercepat proses penarikan atau pengembalian dana deposit.</p>

    <div class="bank-inputs-stack">
      <div class="form-group-select">
        <label for="profileBank" class="select-label">Nama Bank / E-Wallet</label>
        <div class="select-wrapper">
          <select id="profileBank" v-model="bank" class="select-custom">
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
        id="profileRekening"
        label="Nomor Rekening / E-Wallet"
        v-model="rekening"
        placeholder="Contoh: 7012345678"
        heightClass="h-[52px]"
        focusClass="focus:border-black"
      />

      <BaseInput
        id="profileNamaRekening"
        label="Nama Pemilik Rekening"
        v-model="namaRekening"
        placeholder="Contoh: Budi Santoso"
        heightClass="h-[52px]"
        focusClass="focus:border-black"
      />

      <button class="btn-save-bank" @click="saveBankDetails">
        Simpan Rekening Default
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import BaseInput from '../../../components/ui/BaseInput.vue';

export default {
  name: 'BankAccountForm',
  components: {
    BaseInput,
  },
  setup() {
    const bank = ref('BCA');
    const rekening = ref('');
    const namaRekening = ref('');

    onMounted(() => {
      bank.value = localStorage.getItem('default_bank') || 'BCA';
      rekening.value = localStorage.getItem('default_rekening') || '';
      namaRekening.value = localStorage.getItem('default_nama_rekening') || '';
    });

    const saveBankDetails = () => {
      localStorage.setItem('default_bank', bank.value);
      localStorage.setItem('default_rekening', rekening.value);
      localStorage.setItem('default_nama_rekening', namaRekening.value);
      alert('Rekening default berhasil disimpan!');
    };

    return {
      bank,
      rekening,
      namaRekening,
      saveBankDetails,
    };
  },
};
</script>

<style scoped>
.bank-account-form-container {
  width: 100%;
}

.bank-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  font-family: var(--font-sans);
}

.bank-subtitle {
  font-size: 12.5px;
  color: var(--color-muted);
  margin: 4px 0 16px 0;
  line-height: 1.4;
  font-family: var(--font-sans);
}

.bank-inputs-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Custom Select Dropdown styling */
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

/* Save Bank Button */
.btn-save-bank {
  width: 100%;
  padding: 12px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-ink);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.btn-save-bank:hover {
  background: var(--color-surface-soft);
  border-color: var(--color-muted-soft);
}

.btn-save-bank:active {
  transform: scale(0.99);
}
</style>
