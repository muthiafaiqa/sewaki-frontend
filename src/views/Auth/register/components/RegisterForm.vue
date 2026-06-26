<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-md">
    <BaseInput
      id="name"
      type="text"
      label="Nama Lengkap"
      v-model="form.name"
      placeholder="Nama Lengkap Anda"
      :error="errors.name"
      :disabled="loading"
      autocomplete="name"
      heightClass="h-14 py-4"
      focusClass="focus:border-2 focus:border-ink focus:ring-0"
      required
    />

    <BaseInput
      id="email"
      type="email"
      label="Alamat Email"
      v-model="form.email"
      placeholder="nama@email.com"
      :error="errors.email"
      :disabled="loading"
      autocomplete="email"
      heightClass="h-14 py-4"
      focusClass="focus:border-2 focus:border-ink focus:ring-0"
      required
    />

    <BaseInput
      id="nomor_hp"
      type="text"
      label="Nomor WhatsApp"
      v-model="form.nomor_hp"
      placeholder="Contoh: 081234567890"
      :error="errors.nomor_hp"
      :disabled="loading"
      autocomplete="tel"
      heightClass="h-14 py-4"
      focusClass="focus:border-2 focus:border-ink focus:ring-0"
      required
    />

    <BaseInput
      id="password"
      :type="showPassword ? 'text' : 'password'"
      label="Kata Sandi"
      v-model="form.password"
      placeholder="Minimal 6 karakter"
      :error="errors.password"
      :disabled="loading"
      autocomplete="new-password"
      heightClass="h-14 py-4"
      focusClass="focus:border-2 focus:border-ink focus:ring-0"
      inputClass="pr-24"
      required
    >
      <template #append>
        <button 
          type="button" 
          class="absolute right-4 top-[50%] -translate-y-[50%] bg-transparent border-none text-[12px] font-semibold text-muted hover:text-ink cursor-pointer select-none focus:outline-none"
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <span v-if="showPassword">Sembunyikan</span>
          <span v-else>Tampilkan</span>
        </button>
      </template>
    </BaseInput>

    <div class="flex flex-col text-left w-full gap-xxs">
      <label for="role" class="font-sans text-xs font-semibold uppercase tracking-wider text-muted mb-xxs">Peran / Role Akun</label>
      <div class="relative w-full">
        <select 
          id="role" 
          v-model="form.role" 
          :disabled="loading"
          class="bg-canvas text-ink font-sans text-base font-normal rounded-md pl-[14px] pr-[36px] h-14 border border-hairline outline-none box-border w-full transition-all duration-150 focus:border-2 focus:border-ink focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed appearance-none cursor-pointer"
        >
          <option value="user">Penyewa</option>
          <option value="pemilik">Pemilik Barang</option>
        </select>
        <span class="absolute right-4 top-[50%] -translate-y-[50%] pointer-events-none text-muted text-[10px] select-none font-bold">▼</span>
      </div>
      <span v-if="errors.role" class="font-sans text-[12px] text-error mt-0.5">{{ errors.role }}</span>
    </div>

    <BaseButton 
      type="submit" 
      :loading="loading" 
      class="h-12 w-full !bg-[#ff385c] !border-[#ff385c] hover:!bg-[#e00b41] hover:!border-[#e00b41] text-white rounded-md font-semibold font-sans mt-md transition-all duration-150 active:scale-[0.98]"
    >
      Daftar Sekarang
    </BaseButton>
  </form>
</template>

<script>
import { reactive, ref } from 'vue';
import BaseInput from '../../../../components/ui/BaseInput.vue';
import BaseButton from '../../../../components/ui/BaseButton.vue';

export default {
  name: 'RegisterForm',
  components: {
    BaseInput,
    BaseButton,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const form = reactive({
      name: '',
      email: '',
      password: '',
      role: 'user',
      nomor_hp: '',
    });

    const errors = reactive({
      name: '',
      email: '',
      password: '',
      role: '',
      nomor_hp: '',
    });

    const showPassword = ref(false);

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const validateForm = () => {
      let isValid = true;

      if (!form.name) {
        errors.name = 'Nama lengkap wajib diisi';
        isValid = false;
      } else if (form.name.length < 3) {
        errors.name = 'Nama lengkap minimal 3 karakter';
        isValid = false;
      } else {
        errors.name = '';
      }

      if (!form.email) {
        errors.email = 'Email wajib diisi';
        isValid = false;
      } else if (!validateEmail(form.email)) {
        errors.email = 'Format email tidak valid';
        isValid = false;
      } else {
        errors.email = '';
      }

      if (!form.nomor_hp) {
        errors.nomor_hp = 'Nomor WhatsApp wajib diisi';
        isValid = false;
      } else if (!/^\d+$/.test(form.nomor_hp)) {
        errors.nomor_hp = 'Nomor WhatsApp hanya boleh berisi angka';
        isValid = false;
      } else if (form.nomor_hp.length < 9) {
        errors.nomor_hp = 'Nomor WhatsApp minimal 9 angka';
        isValid = false;
      } else {
        errors.nomor_hp = '';
      }

      if (!form.password) {
        errors.password = 'Password wajib diisi';
        isValid = false;
      } else if (form.password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
        isValid = false;
      } else {
        errors.password = '';
      }

      if (!form.role) {
        errors.role = 'Role wajib dipilih';
        isValid = false;
      } else {
        errors.role = '';
      }

      return isValid;
    };

    const handleSubmit = () => {
      if (!validateForm()) return;
      emit('submit', { ...form });
    };

    return {
      form,
      errors,
      showPassword,
      handleSubmit,
    };
  },
};
</script>
