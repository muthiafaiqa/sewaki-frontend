<template>
  <div class="owner-card-container">
    <div class="owner-flex-layout">
      <!-- Avatar Section -->
      <div class="avatar-wrapper">
        <div class="avatar-circle">
          {{ avatarInitial }}
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="owner-text-info">
        <h4 class="owner-name-title">Dihosting oleh {{ ownerName }}</h4>
        <p class="owner-subtitle-text">Pemilik Terverifikasi</p>
      </div>

      <!-- Action Section -->
      <button class="chat-wa-btn" @click="$emit('chat')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="wa-icon">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        Hubungi Pemilik
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'OwnerCard',
  props: {
    owner: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['chat'],
  setup(props) {
    const ownerName = computed(() => {
      return props.owner?.nama || props.owner?.name || 'Pemilik Barang';
    });

    const avatarInitial = computed(() => {
      return ownerName.value.charAt(0).toUpperCase();
    });

    return {
      ownerName,
      avatarInitial,
    };
  },
};
</script>

<style scoped>
.owner-card-container {
  width: 100%;
  padding: 20px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-hairline);
  border-radius: 16px;
  box-sizing: border-box;
}

.owner-flex-layout {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-surface-strong);
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-sans);
  border: 1.5px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.owner-text-info {
  flex: 1;
  text-align: left;
  min-width: 140px;
}

.owner-name-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
}

.owner-subtitle-text {
  font-size: 12.5px;
  color: var(--color-muted);
  margin: 2px 0 0 0;
  font-family: var(--font-sans);
}

.chat-wa-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-sans);
}

.chat-wa-btn:hover {
  background: var(--color-ink);
  color: #ffffff;
  border-color: var(--color-ink);
}

.chat-wa-btn:active {
  transform: scale(0.98);
}

.wa-icon {
  width: 15px;
  height: 15px;
}

@media (max-width: 480px) {
  .chat-wa-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
