<template>
  <div class="profile-header-container">
    <!-- Custom Avatar Circle -->
    <div class="avatar-circle">
      {{ avatarInitial }}
    </div>
    
    <h2 class="user-display-name">{{ name }}</h2>
    
    <div class="role-badge-wrapper">
      <span class="role-badge" :class="roleClass">{{ roleLabel }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProfileHeader',
  props: {
    name: {
      type: String,
      default: '',
    },
    roleLabel: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const avatarInitial = computed(() => {
      return props.name ? props.name.charAt(0).toUpperCase() : 'U';
    });

    const roleClass = computed(() => {
      const r = props.role?.toLowerCase() || '';
      if (r === 'admin') return 'role-admin';
      if (r === 'pemilik' || r === 'pemilik barang') return 'role-owner';
      return 'role-renter';
    });

    return {
      avatarInitial,
      roleClass,
    };
  },
};
</script>

<style scoped>
.profile-header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-surface-strong);
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  font-family: var(--font-sans);
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.user-display-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-ink);
  margin: 12px 0 0 0;
  letter-spacing: -0.01em;
  font-family: var(--font-sans);
}

.role-badge-wrapper {
  margin-top: 8px;
}

.role-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-sans);
  display: inline-block;
}

.role-admin {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid rgba(180, 83, 9, 0.1);
}

.role-owner {
  background-color: #f5f3ff;
  color: #6d28d9;
  border: 1px solid rgba(109, 40, 217, 0.1);
}

.role-renter {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid rgba(4, 120, 87, 0.1);
}
</style>
