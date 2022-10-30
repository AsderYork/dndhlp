<template>
  <div>
    <!--Main Navigation-->
    <header>
      <!-- Sidebar -->
      <nav id="sidebarMenu" class="sidebar bg-white collapse width">
        <div class="sidebar-body">
          <div>
            <div class="accordion py-2" id="leftmenu-accordeon">
              <div class="accordion-item">
                <div class="accordion-header" id="headingOne">
                  <button type="button" class="accordion-button border-top border-bottom py-1 pl-2 w-100 text-left"
                    data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                    aria-controls="collapseOne">
                    <font-awesome-icon :icon="['fa', 'dragon']" /> <b>Character palette</b>
                  </button>
                </div>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                  data-bs-parent="#leftmenu-accordeon">
                  <CharactersPalette class="accordion-body" />
                </div>
              </div>
              <div class="accordion-item">
                <div class="accordion-header" id="headingTwo">
                  <button type="button" class="accordion-button border-top border-bottom py-1 pl-2 w-100 text-left"
                    data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true"
                    aria-controls="collapseTwo">
                    <font-awesome-icon :icon="['fa', 'dungeon']" /> <b>Prepared battles</b>
                  </button>
                </div>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                  data-bs-parent="#leftmenu-accordeon">
                  <div class="accordion-body">
                    <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                    collapse plugin adds the appropriate classes that we use to style each element. These classes
                    control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                    modify any of this with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit
                    overflow.
                  </div>
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
          <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu"
            aria-expanded="false" aria-bs-controls="sidebarMenu">
            <font-awesome-icon :icon="['fa', 'bars']" />
          </button>

          <!-- Brand -->
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
              data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <b>DNDHLP</b>
              <font-awesome-icon :icon="['fa', 'flag']" />
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#" @click="createCharacter">
                <font-awesome-icon :icon="['fa', 'plus']" /> Create character
              </a>
              <a class="dropdown-item" href="#" @click="addBattleWindow">
                <font-awesome-icon :icon="['fa', 'hand-fist']" /> Start a battle
              </a>
              <a class="dropdown-item" href="#" @click="nextTheme">
                <font-awesome-icon :icon="['fa', 'palette']" /> Next theme
              </a>
              <a class="dropdown-item" href="#" @click="toggleFloat">
                <font-awesome-icon :icon="['fa', 'cloud']"/> afloat
              </a>
            </div>
          </div>

          <!-- Search form -->


          <!-- Right links -->
        </div>
        <!-- Container wrapper -->
      </nav>
      <!-- Navbar -->
    </header>
    <!--Main Navigation-->

    <!--Main layout-->
    <main style="margin-top: 58px; gap:10px" class="container pt-4 d-flex flex-column" ref="mainWindowStorage">
      <windowEdit v-for="window in windows" :key="window.id" :header="window.window" @requestClose="closeWindow(window)" @requestMoveToFront="moveWindowToFront(window)">
        <component :is="window.window" v-bind="window.props" @requestClose="closeWindow(window)" @click="moveWindowToFront(window)"></component>
      </windowEdit>
    </main>

   
    <!---->
    <!--Main layout-->
  </div>
</template>

<script>
import Vue from 'vue'
import CharactersPalette from '~/components/CharactersPalette.vue';
import CharacterEditor from '../components/characterEditor.vue';
import windowEdit from '../components/windowEdit.vue';
import battlecounter from '../components/battlecounter.vue';

const possibleWindows = [CharacterEditor, battlecounter];

export default Vue.extend({
  name: "IndexPage",
  components: { CharactersPalette, CharacterEditor },

  head() {
    return {
      htmlAttrs: {
        class: this.currentTheme
      },
      bodyAttrs: {
      class: (this.floatwindows ? 'floatwindows' : '')
      }
    }
  },

  data: function() {
    return {
      windowIdCounter: 0,
      floatwindows: false,
      avaliableThemes: ['darktheme-pur', 'darktheme-gol', 'notheme'],
      currentTheme:'darktheme-gol',
    };
  },
  computed: {
    battleCounterState() {
      return this.$store.getters['battleCounter/getFullState'];
    },
    windows() {
      return this.$store.state.windows;
    }
  },

  watch: {
    "battleCounterState": function(vv) {
      this.$root.mainSocket.emit('battleCounter', vv, (resp) => {console.log(resp);});
      }
  },

  methods: {
    createCharacter() {
      $nuxt.$emit('startWindow', {window:'characterEditor'});
    },
    closeWindow(windowToClose) {
      this.$store.dispatch('removeWindow', windowToClose);
    },
    nextTheme() {
      this.currentTheme = this.avaliableThemes[(this.avaliableThemes.indexOf(this.currentTheme) + 1) % this.avaliableThemes.length];
    },
    toggleFloat() {
      this.floatwindows = !this.floatwindows;
    },
    addBattleWindow() {
      $nuxt.$emit('startWindow', {window:'Battlecounter'});
    },
    moveWindowToFront(window) {
      if(this.floatwindows) {
        this.$store.dispatch('moveWindowToFront', window);
      }
    },

  },

  mounted() {
    console.log({possibleWindows:possibleWindows});
    this.$root.mainSocket = this.$nuxtSocket({
      name: 'main',
      vuex: {
        actions: [
          'battleCounter/setFullState'
        ],
      }
    
    
    });

    this.$nuxt.$on('startWindow', ({window, props}) => {
      this.$store.dispatch('addWindow', {window:window, props:props});
    });
  },
  async fetch() {
    const request = await this.$axios.$get('/api/charatersPalette');
    this.$store.commit('setKnownCharactes', request.characters);
  },
  
  fetchOnServer: false,
})
</script>
