<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="global-footer">
      <div class="footer-content">
        <span class="footer-brand">Sewaki Makassar</span>
        <a href="mailto:halo@sewaki.id" class="footer-contact">halo@sewaki.id</a>
      </div>
    </footer>
  </div>
</template>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
}

.global-footer {
  background: var(--bg);
  border-top: 1px solid var(--border);
  padding: 32px 40px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  font-weight: 700;
  color: var(--text-h);
  font-size: 16px;
}

.footer-contact {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
}

.footer-contact:hover {
  color: var(--accent);
}

@media (max-width: 600px) {
  .global-footer {
    padding: 24px 20px;
  }
  .footer-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
