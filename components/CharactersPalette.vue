<!-- Please remove this file from your project -->
<template>
  <div>
    <div class="px-2 py-1">
      <input v-model="paletteSearch" class="form-control w-100">
    </div>
    <draggable class="px-2 pb-2" v-model="filteredPalette" :group="{name:'charactersPalette', pull:'clone'}" @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder" :sort="false">
      <charactercard v-for="element in filteredPalette" v-bind:key="element.id" :levelVisible="true" :character="element" :draggable="!PreferAddable" :minimal="true" class="mt-1" :addable="PreferAddable" @addRequested="addFromPalette(element)"/>
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
    },
    PreferAddable () {
      return this.isCntrlPressed ? true : (this.windowWidth ? this.windowWidth <= 480 : false);
    },
    charactersPalette() {
      return this.$store.state.knownCharacters;
    },
  },
  data: function () {
    return {
      windowWidth : (typeof window !== 'undefined') ? window.innerWidth : 0,
      paletteSearch: '',
      isCntrlPressed:false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
      window.addEventListener('keydown', this.cntrlKeyActivate);
      window.addEventListener('keyup', this.cntrlKeyDeactivate);

    })
  },
  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize); 
    window.removeEventListener('keydown', this.cntrlKeyActivate); 
    window.removeEventListener('keyup', this.cntrlKeyDeactivate); 
  },
  methods: {  
    onResize() {
      this.windowWidth = window.innerWidth
    },
    addFromPalette(character) {
      $nuxt.$emit('addCharacterFromPalette', character);
    },

    cntrlKeyActivate(e) {
      if(e.code === 'ControlLeft') {this.isCntrlPressed = true;}
    },

    cntrlKeyDeactivate(e) {
      if(e.code === 'ControlLeft') {this.isCntrlPressed = false;}
    },


  },


}
</script>
