import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Auth/login/index.vue';
import Register from '../views/Auth/register/index.vue';
import Profile from '../views/Profile/index.vue';
import DetailBarang from '../views/DetailBarang/index.vue';

// Modular views (lazy-loaded)
const TambahBarang = () => import('../views/TambahBarang/index.vue');
const AdminKYC = () => import('../views/Admin/KYC/index.vue');
const AdminDashboard = () => import('../views/Admin/Dashboard/index.vue');
const RiwayatTransaksi = () => import('../views/RiwayatTransaksi/index.vue');
const KelolaPesanan = () => import('../views/KelolaPesanan/index.vue');
const Dashboard = () => import('../views/Dashboard/index.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/katalog/:id',
    name: 'DetailBarang',
    component: DetailBarang,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true, hideNavbar: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true, hideNavbar: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/riwayat',
    name: 'RiwayatTransaksi',
    component: RiwayatTransaksi,
    meta: { requiresAuth: true },
  },
  {
    path: '/kelola',
    name: 'KelolaPesanan',
    component: KelolaPesanan,
    meta: { requiresAuth: true, role: 'pemilik' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, role: 'pemilik' },
  },
  {
    path: '/tambah-barang',
    name: 'TambahBarang',
    component: TambahBarang,
    meta: { requiresAuth: true, role: 'pemilik' },
  },
  {
    path: '/admin/kyc',
    name: 'AdminKYC',
    component: AdminKYC,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // Fallback wildcard route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Rute butuh login, arahkan ke login jika belum terotentikasi
    if (!isAuthenticated) {
      next('/login');
    } else {
      // Cek peran admin
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        const role = localStorage.getItem('role') || '';
        if (role.toLowerCase() !== 'admin') {
          alert('Akses ditolak. Rute ini hanya untuk Admin.');
          next('/profile');
          return;
        }
      }
      // Cek peran pemilik barang
      if (to.matched.some(record => record.meta.role === 'pemilik')) {
        const role = localStorage.getItem('role') || '';
        if (role.toLowerCase() !== 'pemilik') {
          alert('Akses ditolak. Halaman ini hanya untuk Pemilik Barang.');
          next('/');
          return;
        }
      }
      // Cek status KYC untuk halaman tambah barang
      if (to.path === '/tambah-barang') {
        const kycStatus = localStorage.getItem('kyc_status') || 'unverified';
        if (kycStatus.toLowerCase() !== 'verified') {
          alert('Anda harus mengunggah KTP dan menunggu persetujuan Admin sebelum dapat melanjutkan');
          next('/profile');
          return;
        }
      }
      next();
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    // Rute hanya untuk tamu (non-login), arahkan ke beranda jika sudah terotentikasi
    if (isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
