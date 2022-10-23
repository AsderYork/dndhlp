<template>
  <div>
    <div class="text-center modal-caption shadow bg-danger">
        <h3>{{header}}</h3>
      </div>
    <div class="px-2">
      {{text}}     
    </div>
    <div class="vue-dialog-buttons">
      <button type="button" class="vue-dialog-button-custom btn btn-primary" style="flex: 1 1 100%;" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>


<script>
import charactercard from './charactercard.vue';
export default {
  name: 'charAddWindow',
  props: {
    header: {
      type: String,
    },
    text: {
      type: String,
    }
  },
}
</script>
