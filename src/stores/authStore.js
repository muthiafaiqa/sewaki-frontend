import { ref, computed } from 'vue';

const token = ref(localStorage.getItem('token') || '');
const role = ref(localStorage.getItem('role') || '');

export const useAuthStore = () => {
  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => role.value.toLowerCase() === 'admin');
  const isPemilik = computed(() => role.value.toLowerCase() === 'pemilik');

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole.toLowerCase());
    token.value = newToken;
    role.value = newRole.toLowerCase();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('kyc_status');
    localStorage.removeItem('default_bank');
    localStorage.removeItem('default_rekening');
    localStorage.removeItem('default_nama_rekening');
    sessionStorage.clear();
    token.value = '';
    role.value = '';
  };

  return {
    token,
    role,
    isLoggedIn,
    isAdmin,
    isPemilik,
    login,
    logout
  };
};
