<template>
  <div>
    <div class="text-center modal-caption shadow">
        <h3>Add character to a battle</h3>
      </div>
    <div class="px-2">
      <div>
        <charactercard :character="character" class="border-0"/>
      </div>
      <div class="border-top pt-2 mt-2">
        <div class="d-flex">
          <div class="my-auto" title="Initiative roll">
            <font-awesome-icon :icon="['fa', 'person-running']" class="px-2" size="xl" title="Initiative roll"/>
          </div>
          <input v-model="initiative" ref="initiativeRoll" class="form-control"/>
        </div>

        <div class="d-flex mt-1">
          <div class="my-auto" title="Initiative roll">
            <font-awesome-icon :icon="['fa', 'plus']" class="px-2" size="xl" title="health"/>
          </div>
          <input v-model="characterHealth" ref="health" class="form-control"/>
        </div>
       
      </div>
     
      
     
    </div>
    <div class="vue-dialog-buttons">
      <button type="button" class="vue-dialog-button-custom btn btn-secondary" style="flex: 1 1 100%;" @click="$emit('close')">Cancel</button>
      <button type="button" class="vue-dialog-button-custom btn btn-primary" style="flex: 1 1 100%;" @click="addButton">Add</button>
    </div>
  </div>
</template>


<script>
import charactercard from './charactercard.vue';
export default {
  name: 'charAddWindow',
  props: {
    character: {
      type: Object,
      default: {}
    }
  },

  computed: {
    characterHealth: {
      get() {
        return this?.character.health.current;
      },
      set(val) {
        if(this.character) {
          this.character.health.current = val;
        }
      }
    }
  },

  data: function () {
    return {
      initiative: Math.ceil(Math.random()*20),
    }
  },

  mounted () {
    this.$refs.initiativeRoll.select();
  },

  methods: {  
    addButton() {
      $nuxt.$emit('addCharacterWithInitiative', {character:JSON.parse(JSON.stringify(this.character)), initiative:this.initiative});
      this.$emit('close');
    },
  }
}
</script>
