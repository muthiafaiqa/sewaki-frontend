<template>
  <div :class="cardClass">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    variant: {
      type: String,
      default: 'base', // 'base', 'feature', 'product-mockup', 'featured'
    },
  },
  computed: {
    cardClass() {
      const classes = {
        base: 'bg-canvas rounded-lg border border-hairline p-lg shadow-sm',
        feature: 'bg-surface-card rounded-lg p-xl border-none',
        'product-mockup': 'bg-canvas rounded-lg p-lg border border-hairline shadow-md',
        featured: 'bg-surface-dark text-on-dark rounded-lg p-xl border-none',
      };
      return classes[this.variant] || classes.base;
    },
  },
};
</script>
