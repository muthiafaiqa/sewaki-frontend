<template>
  <div class="avatar-circle">
    <img v-if="src" :src="src" :alt="alt" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script>
export default {
  name: 'BaseAvatar',
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  computed: {
    initials() {
      if (!this.name) return '';
      return this.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    },
  },
};
</script>
