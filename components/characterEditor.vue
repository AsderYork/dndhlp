<template>
  <div class="card">
    <div class="card-body p-1 pl-2">
      <div class="text-center d-flex justify-content-center">
        <h2>
            <assistEditableInput v-model="currentCharacter.name" editable="editable" />
        </h2>
      </div>
      <div>
        <div>
          <v-select :options="[{label: 'Canada', code: 'ca'}]"></v-select>
          <select class="form-control" v-if="editable">
            <option v-for="avaliableClass in avaliableClasses">{{avaliableClass.name}}</option>
          </select>
          <span v-else>{{currentCharacter.class.name}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'charactercard',
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    character: {
      type: Object,
      default: function () {
        return {
          name: 'Bielzeboba',
          level: 3,
          class: { name: 'Barbarian' },
          race: { name: 'Dragonborn' },
          health: { max: 23, current: 12, visible: true },
          armourClass: 17,
        }
      }
    },
  },
  data: function () {
    return {
      currentCharacter: JSON.parse(JSON.stringify(this.character)),
      avaliableClasses: [],
    }
  },
  computed: {

  },
  
  async fetch() {
    this.avaliableClasses = await this.$axios.$get('/api/avaliableClasses');
  },
  fetchOnServer: false,

}
</script>
