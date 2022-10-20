<!-- Please remove this file from your project -->
<template>
  <div>
    <div class="px-2 py-1">
      <input v-model="paletteSearch" class="form-control w-100">
    </div>
    <draggable class="px-2 pb-2" v-model="filteredPalette" :group="{name:'charactersPalette', pull:'clone'}" @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder" :sort="false">
        <charactercard v-for="(element, index) in filteredPalette" v-bind:key="element.id" :levelVisible="true" :character="element" :draggable="true" :minimal="true" class="mt-1"/>
    </draggable>
  </div>
</template>

<script>
import charactercard from './charactercard.vue';
export default {
  name: "CharactersPalette",
  components: { },
  computed: {
    filteredPalette() {
      if (this.paletteSearch.length > 0) {
        return this.charactersPalette.filter(item => {
          return item.name.toLowerCase().indexOf(this.paletteSearch.toLowerCase()) > -1
        })
      }
      return this.charactersPalette;
    }
  },
  data: function () {
    return {
      paletteSearch: '',
      charactersPalette: [
        { id: 2, name: 'MahBoiHavanski', level: 3, class: { name: 'Sorcerer' }, race: { name: 'halfling' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true },
        { id: 3, name: 'Cheekebreeker', level: 4, class: { name: 'Artificer' }, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true },
        { id: 6, name: 'Orc', level: 2, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
        { id: 7, name: 'Goblin', level: 2, race: { name: 'Goblin' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true },
        { id: 8, name: 'Dire wolf', level: 2, race: { name: 'Dire wolf' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true },
      ],
    }
  }
}
</script>
