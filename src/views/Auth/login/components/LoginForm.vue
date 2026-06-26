<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-md">
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
      id="password"
      :type="showPassword ? 'text' : 'password'"
      label="Kata Sandi"
      v-model="form.password"
      placeholder="Masukkan password"
      :error="errors.password"
      :disabled="loading"
      autocomplete="current-password"
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

    <BaseButton 
      type="submit" 
      :loading="loading" 
      class="h-12 w-full !bg-[#ff385c] !border-[#ff385c] hover:!bg-[#e00b41] hover:!border-[#e00b41] text-white rounded-md font-semibold font-sans mt-md transition-all duration-150 active:scale-[0.98]"
    >
      Masuk
    </BaseButton>
  </form>
</template>

<script>
import { reactive, ref } from 'vue';
import BaseInput from '../../../../components/ui/BaseInput.vue';
import BaseButton from '../../../../components/ui/BaseButton.vue';

export default {
  name: 'LoginForm',
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
      email: '',
      password: '',
    });

    const errors = reactive({
      email: '',
      password: '',
    });

    const showPassword = ref(false);

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const validateForm = () => {
      let isValid = true;

      if (!form.email) {
        errors.email = 'Email wajib diisi';
        isValid = false;
      } else if (!validateEmail(form.email)) {
        errors.email = 'Format email tidak valid';
        isValid = false;
      } else {
        errors.email = '';
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
