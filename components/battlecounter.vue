<!-- Please remove this file from your project -->
<template>
  <div>
    <div class="text-center">
      <div class="h2 mb-0">{{currentRound}}</div>
      <div>Round</div>
    </div>
    <draggable class="p-2" v-model="battleList" :group="{name:'battleList',put:['charactersPalette']}" @start="drag=true" @end="drag=true" ghostClass="ghost" handle=".draggable-holder" :removeOnSpill="true" :onSpill="removeItem">
      <charactercard v-for="element in battleList" v-bind:key="element.id" :currentInitiative="element?.currentInitiative" :levelVisible="true"
        :character="element.character"
        :class="[currentActiveCharacter?.id == element.id ? 'character-selected' : '', element ? '' : 'character-skipped']"
        :draggable="true" :removeOnSpill="true" />
    </draggable>
    <div>
      <button class="btn btn-primary w-100" v-on:click="endTurn">
        End turn
      </button>
    </div>

  </div>
</template>

<script>
import charactercard from './charactercard.vue';
import charAddWindow from './charAddWindow.vue';
export default {
  name: "Battlecounter",
  components: { },
  props: {
    levelVisible: {
      type: Boolean,
      default: false,
    },
    
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    },

    battleList: {
        get() {
            return this.currentBattle
        },
        set(value) {
          value = value.map(x => {
            if(x.character === undefined) {

              this.$modal.show(charAddWindow, {character: x}, { adaptive: true });
              return null;


              return {
                id:this.battleIndex++,
                character: x,
                currentInitiative: 5,
              };
            }
            return x;
          });
          this.currentBattle = value.filter(x => x !== null);
        }
    },

  },
  methods: {
    
    removeItem(event){
        this.battleList.splice(event.oldIndex, 1);
    },

    endTurn: function () {

        var skipped = 0;
        do {
          if(this.currentActiveCharacter === null) {
            this.currentActiveCharacter = this.battleList[0];
          } else {
            const currIndex = this.battleList.indexOf(this.currentActiveCharacter);
            if(currIndex + 1 >= this.battleList.length) {
              this.currentActiveCharacter = this.battleList[0];
              this.currentRound += 1;
            } else {
              this.currentActiveCharacter = this.battleList[currIndex + 1];
            }
          }
          skipped++;
      } while(this.currentActiveCharacter != null && !(this.currentActiveCharacter.character.recieveTurn) && skipped < this.battleList.length);
    },
  },
  data: function () {
    return {
      battleIndex: 2,
      currentRound: 1,
      currentActiveCharacter: null,
      currentBattle: [
        {
          id:1,
          character:{ id: 1, name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
          currentInitiative:3,
        }
        
        
      ],
    }
  },

  mounted() {
    this.$nuxt.$on('addCharacterFromPalette', (char) => {
      this.battleList = this.battleList.concat([char]);
    });

    this.$nuxt.$on('addCharacterWithInitiative', (char) => {

      var newChar = {
                id:this.battleIndex++,
                character: char.character,
                currentInitiative: char.initiative,
              }

      this.battleList = this.battleList.concat([newChar]);
    });

    
  }
}
</script>
