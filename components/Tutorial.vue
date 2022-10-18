<!-- Please remove this file from your project -->
<template>
  <div>
    <!--Main Navigation-->
    <header>
      <!-- Sidebar -->
        <nav id="sidebarMenu" class="sidebar bg-white collapse width ">
          <div class="position-sticky sidebar-body">

            <div class="accordion py-2" id="leftmenu-accordeon">
              <div class="accordion-item">
                <div class="accordion-header" id="headingOne">
                  <button type="button" class="accordion-button border-top border-bottom py-1 pl-2 w-100 text-left" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <font-awesome-icon :icon="['fa', 'dragon']" /> <b>Monsters</b>
                  </button>
                </div>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#leftmenu-accordeon">
                  <div class="accordion-body">
                    <div class="px-2 py-1">
                      <input v-model="paletteSearch" class="form-control w-100">
                    </div>
                    <draggable class="px-2 pb-2" v-model="filteredPalette" :group="{name:'charactersPalette', pull:'clone'}"
                      @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder" :sort="false">
                      <charactercard v-for="(element, index) in filteredPalette" v-bind:key="element.id" :levelVisible="true" :character="element" :draggable="true" :minimal="true" class="mt-1"/>
                    </draggable>  
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <div class="accordion-header" id="headingTwo">
                  <button type="button" class="accordion-button border-top border-bottom py-1 pl-2 w-100 text-left" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    <font-awesome-icon :icon="['fa', 'dungeon']" /> <b>Prepared battles</b>
                  </button>
                </div>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#leftmenu-accordeon">
                  <div class="accordion-body">
                    <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                  </div>
                </div>
              </div>
            </div>
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
              @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder" :change="onChange">
              <charactercard v-for="element in characters" v-bind:key="element.id" :currentInitiative="1"
                :levelVisible="true" :character="element"
                :class="[currentActiveCharacter?.id == element.id ? 'character-selected' : '', element.recieveTurn ? '' : 'character-skipped']"
                :draggable="true"
                :removeOnSpill="true" />
            </draggable>
            <div>
              <button class="btn btn-primary w-100" v-on:click="endTurn">
                End turn
              </button>
            </div>

          </div>
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

    onChange:function(a,b) {
      console.log(a);
    },

    endTurn: function () {
        var skipped = 0;
        do {
          if(this.currentActiveCharacter === null) {
            this.currentActiveCharacter = this.characters[0];
          } else {
            const currIndex = this.characters.indexOf(this.currentActiveCharacter);
            if(currIndex + 1 >= this.characters.length) {
              this.currentActiveCharacter = this.characters[0];
              this.currentRound += 1;
            } else {
              this.currentActiveCharacter = this.characters[currIndex + 1];
            }
          }
          skipped++;
      } while(this.currentActiveCharacter != null && !(this.currentActiveCharacter.recieveTurn) && skipped < this.characters.length);
    },
  },
  data: function () {
    return {
      paletteSearch: '',
      currentRound: 1,
      currentTurn: null,
      currentActiveCharacter: null,
      characters: [
        { id: 1, name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
        { id: 2, name: 'MahBoiHavanski', level: 3, class: { name: 'Sorcerer' }, race: { name: 'halfling' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true },
        { id: 3, name: 'Cheekebreeker', level: 4, class: { name: 'Artificer' }, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true }
      ],
      charactersPalette: [
        { id: 1, name: 'Orc', level: 2, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true },
        { id: 2, name: 'Goblin', level: 2, race: { name: 'Goblin' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true },
        { id: 3, name: 'Dire wolf', level: 2, race: { name: 'Dire wolf' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true }
      ],
    }
  }
}
</script>
