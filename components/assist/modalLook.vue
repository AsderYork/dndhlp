<template>
  <div>
    <div class="text-center modal-caption shadow" :class="captionClass">
        <h3 class="text-dark">{{caption}}</h3>
      </div>
    <form class="px-2">
      <slot></slot>
    </form>
    <div class="vue-dialog-buttons">
      <button v-if="includeCancelButton" type="button" class="vue-dialog-button-custom btn btn-secondary" style="flex: 1 1 100%;" @click="cancel">Cancel</button>
      <button type="button" class="vue-dialog-button-custom btn btn-primary" style="flex: 1 1 100%;" @click="$emit('ok')" :class="okButtonClass">{{okButtonText}}</button>
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
    captionClass: {
      type: String,
      default: ''
    },
    index: Number,
    okButtonText: {
      type: String,
      default: 'ok'
    },
    okButtonClass: {
      type: String,
      default: ''
    },
    includeCancelButton: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

