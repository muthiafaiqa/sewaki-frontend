<template>
  <footer class="footer-dark">
    <div class="container footer-grid">
      <div class="footer-brand">
        <span class="footer-logo">sewaki.</span>
        <p class="footer-desc mt-xs">Sewa perlengkapan bayi dan anak dengan mudah, aman, dan terpercaya.</p>
      </div>
      <div class="footer-links">
        <h4 class="footer-title">Layanan</h4>
        <ul>
          <li><router-link to="/">Sewa Barang</router-link></li>
          <li><router-link to="/">Syarat & Ketentuan</router-link></li>
          <li><router-link to="/">Hubungi Kami</router-link></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4 class="footer-title">Kemitraan</h4>
        <ul>
          <li><router-link to="/dashboard">Jadi Pemilik Barang</router-link></li>
          <li><router-link to="/tambah-barang">Tambah Katalog</router-link></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4 class="footer-title">Akun</h4>
        <ul>
          <li><router-link to="/profile">Profil Saya</router-link></li>
          <li><router-link to="/riwayat">Riwayat Sewa</router-link></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>&copy; {{ currentYear }} SewaKi. Hak Cipta Dilindungi.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.footer-dark {
  background-color: var(--color-surface-dark);
  color: var(--color-on-dark-soft);
  padding: 64px 0 32px;
  margin-top: auto;
  border-top: 1px solid var(--color-surface-dark-elevated);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-xl);
  text-align: left;
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-on-dark);
  letter-spacing: -0.5px;
}

.footer-desc {
  font-size: 14px;
  line-height: 1.6;
}

.footer-title {
  color: var(--color-on-dark);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer-links a {
  color: var(--color-on-dark-soft);
  font-size: 14px;
}

.footer-links a:hover {
  color: var(--color-on-dark);
}

.footer-bottom {
  margin-top: 48px;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-surface-dark-elevated);
  font-size: 13px;
  text-align: left;
}

@media (max-width: 767px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
