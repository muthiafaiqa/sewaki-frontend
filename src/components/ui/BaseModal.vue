<template>
  <div>
    <Teleport to="body">
      <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-content">
          <button class="modal-close-btn" @click="$emit('close')">&times;</button>
          <div class="modal-header" v-if="$slots.header">
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['close']);
</script>

<style scoped>
.modal-close-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-muted);
}

.modal-close-btn:hover {
  color: var(--color-ink);
}

.modal-header {
  margin-bottom: var(--spacing-md);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--color-ink);
  text-align: left;
}

.modal-body {
  margin-bottom: var(--spacing-md);
  text-align: left;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
</style>
