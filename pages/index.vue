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
          <div class="d-flex">
            <div class="text-primary h3 mb-0 mr-3">{{ username }}</div>
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
                <a class="dropdown-item" href="#" @click="addCampaignStatusWindow">
                  <font-awesome-icon :icon="['fa', 'hand-fist']" /> Campaign
                </a>
                <a class="dropdown-item" href="#" @click="nextTheme">
                  <font-awesome-icon :icon="['fa', 'palette']" /> Next theme
                </a>
                <a class="dropdown-item" href="#" @click="toggleFloat">
                  <font-awesome-icon :icon="['fa', 'cloud']" /> afloat
                </a>
                <a class="dropdown-item" href="#" @click="addProfileWindow">
                  <font-awesome-icon :icon="['fa', 'user']" /> profile
                </a>
                <a class="dropdown-item" href="/api/auth/logout">
                  <font-awesome-icon :icon="['fa', 'sign-out']" /> Log out
                </a>
              </div>
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

    <!--<client-only placeholder="Loading...">
      <qrcode-stream @decode="onDecode" @init="onInit"/>
    </client-only>-->
    <!--Main layout-->
    <main style="margin-top: 58px; gap:10px" class="container pt-4 d-flex flex-column" ref="mainWindowStorage">
      <windowEdit v-for="window in windows" :key="window.id" :header="window.windowHeader ? window.windowHeader : window.window" @requestClose="closeWindow(window)" @requestMoveToFront="moveWindowToFront(window)">
        <component :is="window.window" v-bind="window.props" v-on="window.on" @requestClose="closeWindow(window)" @click="moveWindowToFront(window)"></component>
      </windowEdit>
      <div v-if="windows.length === 0" class="text-center">
        <h1 class="mb-0">No windows!</h1>
        <h2>There's nothing to do. Leave</h2>
      </div>
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
import CampaignStatus from '../components/CampaignStatus.vue';
import userprofile from '../components/userprofile.vue';

const possibleWindows = [CharacterEditor, battlecounter, CampaignStatus, userprofile];

export default Vue.extend({
  name: "IndexPage",
  components: {
    CharactersPalette, CharacterEditor,
    QrcodeStream: async () => { if (process.client) { const { QrcodeStream } = await import('vue-qrcode-reader'); return QrcodeStream; } },
  },

  head() {
    return {
      htmlAttrs: {
        class: this.userCurrentTheme
      },
      bodyAttrs: {
        class: (this.userUseAfloat ? 'floatwindows' : '')
      }
    }
  },

  data: function () {
    return {
      windowIdCounter: 0,
      floatwindows: false,
      avaliableThemes: ['darktheme-pur', 'darktheme-gol', 'notheme'],
      themeColors: {
        'darktheme-pur': { primary: '#694481', background: '#252525' },
        'darktheme-gol': { primary: '#888a20', background: '#252525' },
        'notheme': { primary: '#fff', background: '#000' }
      },
    };
  },
  computed: {

    userUseAfloat() {
      return this.$auth.$state.user?.settings?.useAfloat ? this.$auth.$state.user.settings.useAfloat : false;
    },

    userCurrentTheme() {
      return this.$auth.$state.user?.settings?.preferedTheme ? this.$auth.$state.user.settings.preferedTheme : this.avaliableThemes[0];
    },

    battleCounterState() {
      return this.$store.getters['battleCounter/getFullState'];
    },
    windows() {
      return this.$store.state.windows;
    },
    username() {
      return this.$auth.$state.user.name;
    },
  },

  watch: {
    "battleCounterState": function (vv) {
      this.$root.mainSocket.emit('battleCounter', vv, (resp) => { console.log(resp); });
    }
  },

  methods: {

    async injectUserSettings(settings) {
      var tmpUser = JSON.parse(JSON.stringify(this.$auth.$state.user));
      tmpUser.settings = tmpUser.settings ? tmpUser.settings : {};
      tmpUser.settings = Object.assign(tmpUser.settings, settings);

      const response = await this.$axios.$post('/api/changeUser', tmpUser);
      this.$auth.setUser(response.user);
      $nuxt.$emit('userChanged', {user:response.user, source:this._uid});
    },

    createCharacter() {
      $nuxt.$emit('startWindow', { window: 'characterEditor' });
    },
    closeWindow(windowToClose) {
      this.$store.dispatch('removeWindow', windowToClose);
    },
    async nextTheme() {
      const nextTheme = this.avaliableThemes[(this.avaliableThemes.indexOf(this.userCurrentTheme) + 1) % this.avaliableThemes.length];
      await this.injectUserSettings({preferedTheme: nextTheme});
    },
    async toggleFloat() {
      await this.injectUserSettings({useAfloat: !this.userUseAfloat});
    },
    addBattleWindow() {
      $nuxt.$emit('startWindow', { window: 'Battlecounter' });
    },
    addProfileWindow() {
      $nuxt.$emit('startWindow', { window: 'userprofile', windowHeader: `User Profile ${this.$auth.$state.user.name}`, props:{user:this.$auth.$state.user}});
    },
    addCampaignStatusWindow() {
      $nuxt.$emit('startWindow', { window: 'CampaignStatus', windowHeader: 'Campaign' });
    },
    moveWindowToFront(window) {
      if (this.floatwindows) {
        this.$store.dispatch('moveWindowToFront', window);
      }
    },




    onDecode(decodedString) {
      console.log(decodedString);
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permission"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        } else if (error.name === 'InsecureContextError') {
          this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
        //alert(this.error);
      }
    }
  },

  mounted() {
    this.$root.mainSocket = this.$nuxtSocket({
      name: 'main',
      vuex: {
        actions: [
          'battleCounter/setFullState'
        ],
      }
    });

    this.$nuxt.$on('startWindow', ({ window, props, windowHeader, on }) => {
      this.$store.dispatch('addWindow', { window: window, props: props, windowHeader: windowHeader, on: on});
    });

    this.$root.mainSocket.on('reloadCharacters', (data) => {
      this.$store.commit('setKnownCharactes', data.characters);
    })

    if (this.windows.length === 0) {
      this.addProfileWindow();
    }


    this.$store.commit('setColors', this.themeColors[this.currentTheme]);
  },
  async fetch() {
    const request = await this.$axios.$get('/api/charatersPalette');
    this.$store.commit('setKnownCharactes', request.characters);
  },

  fetchOnServer: false,
})
</script>
