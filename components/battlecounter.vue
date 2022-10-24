<template>
  <div class="card">
    <div class="text-center" v-if="!isBattleEmpty">
      <div v-if="isBattleStarted">
        <div class="h2 mb-0">{{currentRound}}</div>
          <div class="mt-n2">Round</div>
      </div>
      <div v-else>
        <div class="h2 mb-0">Preparation</div>
          <div>Add all the required characters to a battle and then press "start battle"</div>
      </div>
     
    </div>

    <div v-if="isBattleEmpty" class="p-3 text-center">
      <div class="position-relative border-dashed body-bg-2">
        <draggable :sort="false" class="position-absolute w-100 h-100 p-2" v-model="battleList" :group="{name:'battleList',put:['charactersPalette']}" @start="drag=true" @end="drag=true" handle=".draggable-holder" :removeOnSpill="true" ghostClass="ghost">
          <charactercard v-for="element in battleList" v-bind:key="element.id" :currentInitiative="element?.currentInitiative" :levelVisible="true"
          :character="element.character"
          :class="[currentActiveCharacter?.id == element.id ? 'character-selected' : '', element ? '' : 'character-skipped']"
          :draggable="true"/>
        </draggable>
        <div class="p-4">
          <h2 class="mb-0">Battle is empty!</h2>
          <small>Add characters from the <span class="badge badge-primary"><a href="#"><font-awesome-icon :icon="['fa', 'dragon']" /> character palette</a></span> on the left to start a battle</small>
        </div>
      </div>
    </div>
    <draggable v-else class="p-2" v-model="battleList" :group="{name:'battleList',put:['charactersPalette']}" @start="drag=true" @end="drag=true" ghostClass="ghost" handle=".draggable-holder" :removeOnSpill="true" :onSpill="removeItem">
      <charactercard v-for="element in battleList" v-bind:key="element.id" :currentInitiative="element?.currentInitiative" :levelVisible="true"
        :character="element.character"
        :class="[currentActiveCharacter?.id == element.id ? 'character-selected' : '', element ? '' : 'character-skipped']"
        :draggable="true" @initiativeChanged="(x) => initiativeChanged(element, x)"/>

    </draggable>

    <div class="p-1 border-top m-1">
      <div class="mx-auto">

        <div class="btn" @click="toggleAutosort" :class="[isAutosorting ? 'btn-primary' : 'btn-secondary']" :title="[isAutosorting ? 'Characters are sorted by initiative' : 'Characters are not sorted']">
          <font-awesome-icon :icon="['fa', 'arrow-down-short-wide']" size="xl"/> 
        </div>

        <div class="btn" @click="toggleDontAskForNonUniqueRolls" :class="[dontAskForNonUniqueRolls ? 'btn-primary' : 'btn-secondary']" :title="[dontAskForNonUniqueRolls ? 'Generate initiative and health for non-unique characters automaticaly' : 'Require rolls for creation of non-unique characters']">
          <font-awesome-icon :icon="['fa', 'dice-d20']" size="xl"/> 
        </div>

      </div>
    </div>

    <div v-if="!isBattleEmpty">
      <button class="btn btn-primary w-100" v-on:click="endTurn">
        <span v-if="currentActiveCharacter">End turn</span>
        <span v-else>Start battle</span>
      </button>
    </div>

  </div>
</template>

<script>
import charactercard from './charactercard.vue';
import charAddWindow from './charAddWindow.vue';
import WarningModalVue from './WarningModal.vue';
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
    isBattleEmpty() {
      return this.currentBattle.length === 0;
    },

    battleList: {
        get() {
            //return this.currentBattle;
            return this.$store.state.battleCounter.battleList;
        },
        set(value) {
          var charactersToAdd = [];

          value = value.map((x, i) => {
            if(x.character === undefined) {
              charactersToAdd.push([x,i]);
              return null;
            }
            return x;
          });
          value = value.filter(x => x !== null);

          if(this.isAutosorting) {
            value = value.sort((a,b) => {return a.currentInitiative < b.currentInitiative ? 1 : ( a.currentInitiative > b.currentInitiative ? -1 : 0);});
          }

          this.$store.commit('battleCounter/setBattleList', value);
          this.currentBattle = value;

          for(var char of charactersToAdd) {
            var result = this.addNewCharacter(char[0], char[1]);
          }
          
          this.$axios.post('/api/setBattle', {battleList:this.battleList});

        }
    },

    isBattleStarted() {
      return this.currentActiveCharacter !== null;
    },

    isAutosorting() {
      return this.autoSort;
    }

  },
  methods: {
    
    removeItem(event){
      this.battleList = this.battleList.filter((x, i) => i !== event.oldIndex);
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

    addNewCharacter(character, index) {

      if(character.isUnique) {
        if(this.battleList.find(x => x.character.id === character.id)) {
          this.$modal.show(WarningModalVue, {header: 'Character allready in battle', text: `${character.name} is unique. Thуre can't be multiple instances of one unique character in a battle`}, { adaptive: true });
          return false;

        }
      }

      if(this.dontAskForNonUniqueRolls && !character.isUnique) {
        this.addCharacterWithInitiative({character:JSON.parse(JSON.stringify(character)), initiative:Math.ceil(Math.random()*20), insertIndex: index});
      } else {
        this.$modal.show(charAddWindow, {character: character, index: index}, { adaptive: true });
      }

      return true;
    
    
    },

    toggleAutosort() {
      this.autoSort = !this.autoSort;
      if(this.autoSort) {
        var sortable = [...this.battleList];
        sortable.sort((a,b) => {return a.currentInitiative < b.currentInitiative ? 1 : ( a.currentInitiative > b.currentInitiative ? -1 : 0);});
        this.$store.commit('battleCounter/setBattleList', sortable);
      }
    },

    toggleDontAskForNonUniqueRolls() {
      this.dontAskForNonUniqueRolls = !this.dontAskForNonUniqueRolls;
    },

    addCharacterWithInitiative(char) {
      var newChar = {
                id:this.battleIndex++,
                character: char.character,
                currentInitiative: char.initiative,
      };

      if(char.insertIndex) {
        var copied = [...this.battleList];
        copied.splice(char.insertIndex, 0, newChar);
        this.battleList = copied;
      } else {
        this.battleList = this.battleList.concat([newChar]);
      }

    },

    initiativeChanged(elem, newInitiative) {
      elem.currentInitiative = newInitiative;
    }

  },
  data: function () {
    return {
      battleIndex: 2,
      currentRound: 1,
      currentActiveCharacter: null,
      currentBattle: [],
      autoSort: true,
      dontAskForNonUniqueRolls: false,
    }
  },

  mounted() {
    this.$nuxt.$on('addCharacterFromPalette', (char) => {
      this.battleList = this.battleList.concat([char]);
    });

    this.$nuxt.$on('addCharacterWithInitiative', this.addCharacterWithInitiative);

    
  }
}
</script>
