<template>
  <div class="card">
    <div class="card-body p-1 pl-2">
      <div class="text-center d-flex justify-content-center">
        <h2>
            <assistEditableInput v-model="currentCharacter.name" :editable="true" />
        </h2>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'charactercard',
  props: {
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
    }
  },
  computed: {


  },

}
</script>
