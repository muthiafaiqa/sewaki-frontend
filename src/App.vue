<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <Navbar v-if="!route.meta.hideNavbar" />
    <main class="main-content">
      <router-view />
    </main>
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
</style>
