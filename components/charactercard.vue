<template>
  <div class="card">
    <div class="card-body p-1 pl-2">
      <div class="d-flex flex-row">
        <div class="d-flex align-items-end mr-2" v-if="currentInitiative">
          <div class="box h1 text-secondary" style="min-width: 38px; text-align: end;">
            {{currentInitiative}}
          </div>
        </div>
        <div class="mr-3 vr" v-if="currentInitiative"></div>
        <div>
          <span>
            <span class="text-primary mb-0 h3">
              {{characterName}}
            </span>
            <small class="text-muted font-bold ml-n1" v-if="levelVisible"><b>lvl.{{characterLevel}}</b></small>
          </span>
          <div class="text-muted mt-n1" v-if="[raceName, className].filter(x => x !== null).length > 0">
            {{[raceName, className].filter(x => x !== null).join(', ')}}
          </div>
        </div>
        <div class="text-muted background p-2 px-2"
          style="padding-left: 0.51rem!important;padding-top: 0.8rem !important; background-position: center; background-repeat: no-repeat"
          v-bind:style="{ backgroundImage: `url(${require('~/assets/images/shield-svgrepo-com.svg')})` }">
          <b>{{getArmourClass}}</b>
        </div>

        <div class="d-flex align-items-center mr-2 mx-1">
          <div class="box text-secondary">
            <div class="border-bottom border-dark">
              13
            </div>
            <div>
              55
            </div>

          </div>
        </div>
      </div>
      <div class="border-top mt-1">
        8/1
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

    currentInitiative: {
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
  data() {
    return {
    };
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
      return this?.character?.race?.name;
    },
    currHealth: function () {
      return this?.character?.health?.current;
    },
    maxHealth: function () {
      return this?.character?.health?.max;
    },
    isHealthVisible: function () {
      return this?.character?.health?.visible;
    },

    getArmourClass: function () {
      return this?.character?.armourClass;
    }


  }
}
</script>
