<template>
  <div class="page-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageWrapper',
};
</script>

<style scoped>
.page-wrapper {
  min-height: calc(100vh - 64px - 320px); /* Spacing helper to match header & footer */
  padding-bottom: var(--spacing-xxl);
  box-sizing: border-box;
}
</style>
