<template>
  <div class="card">
    <div class="card-body p-1 pl-2">
      <div class="text-center d-flex justify-content-center">
        <h2>
          <assistEditableInput v-model="currentCharacter.name" editable="editable" />
        </h2>
      </div>
      <div class="d-flex flex-wrap">
        <div>
          <v-select style="min-width: 270px;" v-if="editable" v-model="currentCharacter.class"
            :options="avaliableClasses" label="name" :clearable="false"></v-select>
          <span v-else>{{ currentCharacter.class.name }}</span>
        </div>
        <div>
          <v-select style="min-width: 270px;" v-if="editable" v-model="currentCharacter.race" :options="avaliableRaces"
            label="name" :clearable="false"></v-select>
          <span v-else>{{ currentCharacter.class.name }}</span>
        </div>
      </div>


      <div>
        <div class="d-flex justify-content-around flex-wrap">
          <div class="m-2 d-flex flex-column" v-for="attribute in attributesComuted" style="flex: 1 1 0px">
            <div class="text-center">
              {{ attribute.name }}
            </div>
            <div v-bind:style="{ backgroundImage: `url(${require('~/assets/images/attrborder.svg')})` }"
              class="mx-auto imgbg-unrepeatable statblock-item d-flex">
              <div class="mx-auto my-auto">
                <div class="h1 mb-n2">
                <assistEditableInput type="number" v-model="attribute.value" editable="editable" />
              </div>
                <div class="text-center mb-n2">{{attribute.modifier}}</div>
              </div>
            </div>
          </div>
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
          attributes: [
            {name:'Strength', value: 12},
            {name:'Dexterity', value: 12},
            {name:'Constitution', value: 12},
            {name:'Intelligence', value: 12},
            {name:'Wisdom', value: 12},
            {name:'Charisma', value: 12},
          ],
          armourClass: 17,
        }
      }
    },
  },
  data: function () {
    return {
      currentCharacter: JSON.parse(JSON.stringify(this.character)),
      avaliableClasses: [],
      attributes: [
        { name: 'Strength' },
        { name: 'Dexterity' },
        { name: 'Constitution' },
        { name: 'Intelligence' },
        { name: 'Wisdom' },
        { name: 'Charisma' },
      ]
    }
  },
  computed: {
    attributesComuted() {
      return this.currentCharacter.attributes.map(x => Object.assign(x, {modifier:Math.floor((x.value-10)/2)}));
    },
  },

  async fetch() {
    this.avaliableClasses = await this.$axios.$get('/api/avaliableClasses');
    this.avaliableRaces = await this.$axios.$get('/api/avaliableRaces');
  },
  fetchOnServer: false,

}
</script>
