<template>
  <div>
    <div class="p-2">
      <div class="d-flex">
        <div class="my-auto" title="Initiative roll">
          <font-awesome-icon :icon="['fa', 'dice-d20']" class="px-2" size="xl"/>
        </div>
        <input v-model="initiative" class="form-control initiative-roll"/>
      </div>
     
    </div>
    <div class="vue-dialog-buttons">
      <button type="button" class="vue-dialog-button-custom btn btn-secondary" style="flex: 1 1 100%;" @click="$emit('close')">Cancel</button>
      <button type="button" class="vue-dialog-button-custom btn btn-primary" style="flex: 1 1 100%;" @click="addButton">Add</button>
    </div>
  </div>
</template>


<script>
export default {

  props: {
    character: {
      type: Object,
      default: {}
    }
  },

  data: function () {
    return {
      initiative: null,
    }
  },

  methods: {  
    addButton() {
      $nuxt.$emit('addCharacterWithInitiative', {character:this.character, initiative:this.initiative});
      //$emit('close');
    },
  }
}
</script>
