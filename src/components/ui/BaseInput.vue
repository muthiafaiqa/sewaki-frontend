<template>
  <div class="form-group flex flex-col gap-xxs w-full text-left">
    <label v-if="label" class="font-sans text-xs font-semibold uppercase tracking-wider text-muted mb-xxs">{{ label }}</label>
    <div class="relative w-full">
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="['bg-canvas text-ink font-sans text-base font-normal rounded-md px-[14px] border border-hairline outline-none box-border w-full transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed', heightClass, focusClass, inputClass]"
        v-bind="$attrs"
      />
      <slot name="append"></slot>
    </div>
    <span v-if="error" class="error-text font-sans text-[12px] text-error mt-0.5">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    error: {
      type: String,
      default: '',
    },
    heightClass: {
      type: String,
      default: 'h-10 py-[10px]',
    },
    focusClass: {
      type: String,
      default: 'focus:border-ink focus:ring-1 focus:ring-ink',
    },
    inputClass: {
      type: String,
      default: '',
    },
  },
};
</script>
