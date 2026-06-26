<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center font-sans font-semibold text-[14px] leading-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed',
      btnClass
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <slot v-if="!loading"></slot>
    <span v-else :class="[
      'animate-spin inline-block w-4 h-4 border-2 rounded-full',
      variant === 'secondary' ? 'border-black/10 border-t-ink' : 'border-white/30 border-t-white'
    ]"></span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary', // 'primary', 'secondary', 'icon-circular'
    },
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnClass() {
      const classes = {
        primary: 'bg-primary text-on-primary border border-primary h-10 px-5 rounded-md hover:bg-primary-active hover:border-primary-active active:bg-primary-active active:border-primary-active disabled:bg-primary-disabled disabled:text-muted disabled:border-primary-disabled',
        secondary: 'bg-canvas text-ink border border-hairline h-10 px-5 rounded-md hover:bg-surface-soft hover:border-muted active:bg-surface-soft disabled:opacity-50',
        'icon-circular': 'bg-canvas text-ink border border-hairline w-9 h-9 rounded-full hover:bg-surface-soft active:bg-surface-soft disabled:opacity-50',
      };
      return classes[this.variant] || classes.primary;
    },
  },
};
</script>
