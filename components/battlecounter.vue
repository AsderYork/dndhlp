<!-- Please remove this file from your project -->
<template>
  <div>
    <div class="text-center">
      <div class="h2 mb-0">{{currentRound}}</div>
      <div>Round</div>
    </div>
    <draggable class="p-2" v-model="battleList" :group="{name:'battleList',put:['charactersPalette']}" @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder" @add="onAdd" @drop="onDrop" @change="onChange">
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
              return {
                id:this.battleIndex++,
                character: x,
                currentInitiative: 5,
              };
            }
            return x;
          });
          this.currentBattle = value;
        }
    },

  },
  methods: {

    onChange: function({ added }) {
      if (added) {
        added.element = {character: added.element}; // Not published
      }
    },
    
    onAdd: function(evt, eewq){
      return false;
      evt.draggedContex = Object.assign(sku, {selected:false});
    },
    onDrop: function(evt, eewq){
      return false;
      evt.draggedContex = Object.assign(sku, {selected:false});
    },

    endTurn: function () {
        var skipped = 0;
        do {
          if(this.currentActiveCharacter === null) {
            this.currentActiveCharacter = this.currentBattle[0];
          } else {
            const currIndex = this.currentBattle.indexOf(this.currentActiveCharacter);
            if(currIndex + 1 >= this.currentBattle.length) {
              this.currentActiveCharacter = this.currentBattle[0];
              this.currentRound += 1;
            } else {
              this.currentActiveCharacter = this.currentBattle[currIndex + 1];
            }
          }
          skipped++;
      } while(this.currentActiveCharacter != null && !(this.currentActiveCharacter.recieveTurn) && skipped < this.currentBattle.length);
    },
  },
  data: function () {
    return {
      battleIndex: 1,
      currentRound: 1,
      currentActiveCharacter: null,
      currentBattle: [
        {
          id:this.battleIndex,
          character:{ id: 1, name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
          currentInitiative:3,
        }
        
        
      ],
    }
  }
}
</script>
