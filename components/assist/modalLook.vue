<template>
  <div>
    <div class="text-center modal-caption shadow">
        <h3>{{caption}}</h3>
      </div>
    <form class="px-2">
      <slot></slot>
    </form>
    <div class="vue-dialog-buttons">
      <button type="button" class="vue-dialog-button-custom btn btn-secondary" style="flex: 1 1 100%;" @click="cancel">Cancel</button>
      <button type="button" class="vue-dialog-button-custom btn btn-primary" style="flex: 1 1 100%;" @click="$emit('ok')">Add</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modalLook',
  props: {
    caption: {
      type: String,
      default: 'Modal'
    },
    index: Number,
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

