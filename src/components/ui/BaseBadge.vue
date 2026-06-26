<template>
  <span :class="[
    'inline-flex items-center justify-center whitespace-nowrap rounded-pill py-1 px-3 text-[13px] font-medium font-sans bg-surface-card text-ink',
    colorClasses
  ]">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'BaseBadge',
  props: {
    color: {
      type: String,
      default: 'default', // 'orange', 'pink', 'violet', 'emerald', 'default'
    },
  },
  computed: {
    colorClasses() {
      const colors = {
        orange: 'bg-badge-orange-bg text-badge-orange-text',
        pink: 'bg-badge-pink-bg text-badge-pink-text',
        violet: 'bg-badge-violet-bg text-badge-violet-text',
        emerald: 'bg-badge-emerald-bg text-badge-emerald-text',
      };
      return colors[this.color] || '';
    },
  },
};
</script>
