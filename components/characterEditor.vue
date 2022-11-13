<template>
  <div>
    <div class="p-1 pl-2">
      <div class="text-center d-flex justify-content-center border-bottom px-2 mb-2">
        <div class="position-absolute" sty>

        </div>
        <h2 class="mb-0">
          <assistEditableInput v-model="currentCharacter.name" :editable="editable" />
        </h2>
      </div>
      <div class="position-absolute text-muted" style="right: 15px;" v-if="currentCharacter.id"><small>id:{{currentCharacter.id}}</small></div>
      <div class="d-flex flex-wrap" style="gap: 0.5rem">
        <div class="border border-secondary rounded bg-primary d-flex">
          <div class="my-auto text-center font-weight-bold">
            <div class="px-2 border-bottom mx-1 pb-1">
              <assistEditableInput v-model="currentCharacter.health" type="numberex" :editable="editable"
                :selectOnEdit="false" />
            </div>
            <div class="px-2 mx-1 pt-1">
              <assistEditableInput v-model="currentCharacter.maxHealth" type="numberex" :editable="editable"
                :selectOnEdit="false" />
            </div>
          </div>
        </div>

        <div class="border border-secondary rounded bg-info d-flex">
          <div class="my-auto">
            <div class="px-2 mx-1 pt-1 font-weight-bold">
              <assistEditableInput v-model="currentCharacter.armourClass" type="number" :editable="editable"
                :selectOnEdit="false" />
            </div>
          </div>
        </div>

        <div>
          <div v-if="currentCharacter.class">
            <v-select style="min-width: 270px;" v-if="editable" v-model="currentCharacter.class"
              :options="avaliableClasses" label="name" :clearable="false"></v-select>
            <span v-else>{{ currentCharacter.class.name }}</span>
          </div>
          <div v-if="currentCharacter.race">
            <v-select style="min-width: 270px;" v-if="editable" v-model="currentCharacter.race"
              :options="avaliableRaces" label="name" :clearable="false"></v-select>
            <span v-else>{{ currentCharacter.race.name }}</span>
          </div>
        </div>

        <div class="border border-secondary rounded bg-secondary d-flex">
          <div class="my-auto">
            <div class="px-2 mx-1 pt-1 font-weight-bold">
              Lvl.<assistEditableInput v-model="currentCharacter.level" type="numberex" :editable="editable"
                :selectOnEdit="false" />
            </div>
          </div>
        </div>

      </div>
      <div>
        <div class="d-flex justify-content-around flex-wrap">
          <div class="m-2 d-flex flex-column" v-for="attribute in attributesComuted" :key="attribute.name" style="flex: 1 1 0px;width:90px">
            <div class="text-center">
              {{ attribute.name }}
            </div>
            <div v-bind:style="{ backgroundImage: `url(${require('~/assets/images/attrborder.svg')})` }"
              class="mx-auto imgbg-unrepeatable statblock-item d-flex">
              <div class="mx-auto my-auto">
                <div class="h1 mb-n2">
                  <assistEditableInput type="number" v-model="currentCharacter.attributes[attribute.name]" :editable="editable" />
                </div>
                <div class="text-center mb-n2">{{ attribute.modifier }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button v-if="editable && !isNewCharacter" class="btn btn-danger float-right mb-2" @click="deleteCharacter">Delete</button>
      <div v-if="editable" class="mt-2">
        <button class="btn btn-primary w-100" @click="save"><span v-if="isNewCharacter">Create</span><span v-else>Save</span></button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'characterEditor',
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: function () {
        return {
          name: 'Bielzeboba',
          level: 3,
          class: null,
          race: null,
          maxHealth: 45,
          health: 13,
          attributes: {
            Strength:10,
            Dexterity:10,
            Constitution:10,
            Intelligence:10,
            Wisdom:10,
            Charisma:10,
          },
          armourClass: 17,
        }
      }
    },
  },
  data: function () {
    return {
      currentCharacter: JSON.parse(JSON.stringify(this.value)),
      avaliableClasses: [],
      avaliableRaces: [],
      avaliableAttributes: [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma',
      ]
    }
  },
  computed: {

    isNewCharacter() {
      return this.currentCharacter.id === undefined;
    },

    attributesComuted: {
      get() {
        return this.avaliableAttributes.map(x => {return {name: x, value: this.currentCharacter.attributes[x], modifier: Math.floor((this.currentCharacter.attributes[x] - 10) / 2)};})
      }, 
      set(newval) {
        console.log(newval);
      }
      },
  },

  methods: {
    async save() {
      console.log(this.currentCharacter);
      var responce = await this.$axios.$post('/api/saveCharacter', this.currentCharacter);
      this.currentCharacter = responce.character;
      this.$emit('input', this.currentCharacter);
    },

    async deleteCharacter() {
      var responce = await this.$axios.$post('/api/deleteCharacter', {id:this.currentCharacter.id});
    this.$emit('requestClose');
    }
  },

  async fetch() {
    this.avaliableClasses = await this.$axios.$get('/api/avaliableClasses');
    if(this.currentCharacter.class === null) {
      this.currentCharacter.class = this.avaliableClasses[0];
    }

    this.avaliableRaces = await this.$axios.$get('/api/avaliableRaces');
    if(this.currentCharacter.race === null) {
      this.currentCharacter.race = this.avaliableRaces[0];
    }
  },
  fetchOnServer: false,

}
</script>
