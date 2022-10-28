<template>
  <div class="card">
    <div class="card-body p-1 pl-2">
      <div class="d-flex">
        <div class="d-flex align-items-end mr-2" v-if="currentInitiative">
          <div class="box h1 text-secondary text-nowrap" style="width: 45px; text-align: end; overflow: hidden;">
            <span v-if="canEditInitative">
                <span @click="editInitiative" v-if="!isInitiativeEdit">
                  {{currentInitiative}}
                </span>
                <input type="number" v-else v-model="tmpInitiative" class="form-control" ref="initiativeEditor" @blur="stopEditingInitiative"/>
            </span>
            <span v-else>
                {{currentInitiative}}
            </span>
          </div>
        </div>
        <div class="mr-3 vr" v-if="currentInitiative"></div>
        <div class="my-auto text-truncate" v-htooltip>
          <div class="text-truncate" v-htooltip>
            <span>
              <span class="text-primary mb-0 h3">
                {{characterName}}
              </span>
              <small class="text-muted font-bold ml-n1" v-if="levelVisible"><b>lvl.{{characterLevel}}</b></small>
            </span>
          </div>
          <div class="text-muted mt-n1" v-if="[raceName, className].filter(x => !!x).length > 0">
            {{[raceName, className].filter(x => !!x).join(', ')}}
          </div>
        </div>
        <div class="my-auto">
          <div class="text-muted background centereded-background" v-if="getArmourClass" style="padding:6px; padding-top: 3px;"
          v-bind:style="{ backgroundImage: `url(${require('~/assets/images/shield-svgrepo-com.svg')})` }">
            <b>{{getArmourClass}}</b>
          </div>
        </div>
      

        <div class="d-flex align-items-center mr-2 mx-1" v-if="isHealthVisible">
          <div class="box text-secondary">
            <div class="border-bottom border-dark">
              {{currHealth}}
            </div>
            <div>
              {{maxHealth}}
            </div>

          </div>
        </div>

        <div class="ml-auto d-flex">
          <div class="my-auto " v-if="editable">
            <a href="#">
              <font-awesome-icon :icon="['fa', 'pen']" title="Edit" @click="attemptEdit"/>
            </a>
          </div>
          <div class="my-auto" v-if="draggable">
            <div class="draggable-holder"
              v-bind:style="{ backgroundImage: `url(${require('~/assets/images/noun-drag.svg')})` }"></div>
          </div>
        
          <div class="my-auto mr-1" v-if="addable">
            <div class="btn text-muted" @click="$emit('addRequested')">
              <font-awesome-icon :icon="['fa', 'plus']" size="xl" />
            </div>
          </div>
        </div>
        

       
      </div>
      <div class="border-top mt-1" v-if="showFull">
        <div>
          <div class="attribute-pict-wrap">
            <img class="attribute-pict" src="~/assets/images/noun-strength.svg">
            <div class="attribute-pict-content text-muted">
              <b>14</b>
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
    levelVisible: {
      type: Boolean,
      default: false,
    },

    minimal: {
      type: Boolean,
      default: false,
    },

    currentInitiative: Number,

    draggable: {
      type: Boolean,
      default: false,
    },

    addable: {
      type: Boolean,
      default: false,
    },

    editable: {
      type: Boolean,
      default: true,
    },

    character: {
      type: Object,
      default: {
        name: 'Bielzeboba',
        level: 3,
        class: { name: 'Barbarian' },
        race: { name: 'Dragonborn' },
        health: { max: 23, current: 12, visible: true },
        armourClass: 17,
      }
    },
  },
  data: function() {
    return {
      isInitiativeEdit: false,
      tmpInitiative: null,
    }
  },
  computed: {

    isLevelVisible: function () {
      return this.levelVisible && this.characterLevel > 0;
    },

    characterName: function () {
      return this?.character?.name;
    },
    characterLevel: function () {
      return this?.character?.level;
    },
    className: function () {
      return this?.character?.class?.name;
    },
    raceName: function () {
      const name = this?.character?.race?.name;
      if(name == this.characterName) {
        return '';
      }
      return this?.character?.race?.name;
    },
    currHealth: function () {
      return this?.character?.health;
    },
    maxHealth: function () {
      return this?.character?.maxHealth;
    },
    isHealthVisible: function () {
      if(this.minimal) {return false;}
      return true;
    },

    getArmourClass: function () {
      if(this.minimal) {return false;}
      return this?.character?.armourClass;
    },

    showFull: function () {
      return false;
    },

    editableInitiative: {
      get() {
        return this.currentInitiative;
      },
      set(val) {
        this.$emit('initiativeChanged', parseInt(val));
      }
    },

    canEditInitative() {
      return this._events['initiativeChanged']?.length > 0;
    },


  },
  methods: {
    editInitiative() {
      this.isInitiativeEdit = true;
      this.tmpInitiative = this.editableInitiative;
      this.$nextTick(() => {
        this.$refs.initiativeEditor.select();
      });
    },
    stopEditingInitiative() {
      this.isInitiativeEdit = false;
      this.editableInitiative = this.tmpInitiative;
    },

    attemptEdit() {
      $nuxt.$emit('startWindow', {window:'characterEditor', props:{value:this.character}});
    }
  },

}
</script>
