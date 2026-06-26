<template>
  <div class="profile-details-list">
    <!-- Email block -->
    <div class="detail-item">
      <span class="detail-label">Alamat Email</span>
      <span class="detail-value">{{ email }}</span>
    </div>
    
    <!-- User ID block -->
    <div class="detail-item">
      <span class="detail-label">ID Pengguna</span>
      <span class="detail-value font-mono-id">{{ userId }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileForm',
  props: {
    email: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.profile-details-list {
  background-color: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: 12px;
  overflow: hidden;
  text-align: left;
}

.detail-item {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-hairline-soft);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  font-family: var(--font-sans);
}

.detail-value {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

.font-mono-id {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted-soft);
}
</style>
