<!-- Please remove this file from your project -->
<template>
  <div>
    <!--Main Navigation-->
    <header>
      <!-- Sidebar -->
        <nav id="sidebarMenu" class="sidebar bg-white collapse width ">
          <div class="position-sticky sidebar-body">
              ф   фыфыв чясыфыйфв
          </div>
        </nav>
    
      <!-- Sidebar -->

      <!-- Navbar -->
      <nav id="main-navbar" class="navbar navbar-light bg-white fixed-top border-bottom">
        <!-- Container wrapper -->
        <div class="container-fluid">
          <!-- Toggle button -->
          <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-expanded="false" aria-bs-controls="sidebarMenu">
            <font-awesome-icon :icon="['fa', 'bars']" />
          </button>

          <!-- Brand -->
          <span class="navbar-brand" href="#">
            <b class="text-primary">DNDHLP</b>
            <font-awesome-icon :icon="['fa', 'flag']" />
          </span>
          <!-- Search form -->


          <!-- Right links -->
        </div>
        <!-- Container wrapper -->
      </nav>
      <!-- Navbar -->
    </header>
    <!--Main Navigation-->

    <!--Main layout-->
    <main style="margin-top: 58px;">
      <div class="container pt-4">
        <section>
          <div class="container">
            <div class="text-center">
              <div class="h2 mb-0">{{currentRound}}</div>
              <div>Round</div>
            </div>
            <draggable class="p-2" v-model="characters" :group="{name:'characters',put:['charactersPalette']}"
              @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder">
              <charactercard v-for="(element, index) in characters" v-bind:key="element.id" :currentInitiative="1"
                :levelVisible="true" :character="element"
                :class="[currentTurn == index ? 'character-selected' : '', element.recieveTurn ? '' : 'character-skipped']"
                :draggable="true" />
            </draggable>
            <div>
              <button class="btn btn-primary w-100" v-on:click="endTurn">
                End turn
              </button>
            </div>

          </div>
        </section>

        <section>
          <input v-model="paletteSearch">
          <draggable class="p-2" v-model="filteredPalette" :group="{name:'charactersPalette', pull:'clone'}"
            @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder" :sort="false">
            <charactercard v-for="(element, index) in filteredPalette" v-bind:key="element.id" :levelVisible="true"
              :character="element" :draggable="true" />
          </draggable>
        </section>
      </div>
    </main>
    <!--Main layout-->
  </div>



</template>

<script>
import Header from './allheader.vue';
import charactercard from './charactercard.vue';
export default {
  name: "NuxtTutorial",
  components: { Header },
  dragOptions() {
    return {
      animation: 0,
      group: "description",
      disabled: !this.editable,
      ghostClass: "ghost"
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.editable,
        ghostClass: "ghost"
      };
    },
    filteredPalette() {
      if (this.paletteSearch.length > 0) {
        return this.charactersPalette.filter(item => {
          return item.name.toLowerCase().indexOf(this.paletteSearch.toLowerCase()) > -1
        })
      }
      return this.charactersPalette;
    }
  },
  methods: {
    endTurn: function () {
      var skipped = 0;
      do {
        skipped++;
        this.currentTurn += 1;
        if (this.currentTurn >= this.characters.length) {
          this.currentTurn = 0;
          this.currentRound += 1;
        }
      } while (!(this.characters[this.currentTurn].recieveTurn) && skipped < this.characters.length);
    },
  },
  data: function () {
    return {
      paletteSearch: '',
      currentRound: 1,
      currentTurn: 0,
      characters: [
        { id: 1, name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
        { id: 2, name: 'MahBoiHavanski', level: 3, class: { name: 'Sorcerer' }, race: { name: 'halfling' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true },
        { id: 3, name: 'Cheekebreeker', level: 4, class: { name: 'Artificer' }, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true }
      ],
      charactersPalette: [
        { id: 1, name: 'Orc', level: 2, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
        { id: 2, name: 'Goblin', level: 2, race: { name: 'Goblin' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true },
        { id: 3, name: 'dire wolf', level: 2, race: { name: 'Dire wolf' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true }
      ],
    }
  }
}
</script>
