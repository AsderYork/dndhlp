<template>
  <div class="card element-window" :style="{ 'top': this.posy + 'px', 'left': this.posx + 'px' }" @mousedown="resizeMouseDown">
    <div class="border-bottom pl-2 bg-primary rounded-top d-flex justify-content-between" @mouseup="mouseup" @mousedown="mousedown">
      <div class="user-select-none">{{header}}</div>
      <div class="user-select-none border-left bg-secondary px-2" style="border-top-right-radius: 0.25rem"><a href="#" @click="requestClose"><font-awesome-icon :icon="['fa', 'times']" /></a></div>
    </div>
    
    <div>
        <slot></slot>
    </div>
  </div>
</template>

<style>
.nuxt-logo {
  height: 180px;
}
</style>


<script>
import { eventNames } from 'process';

export default {
  name: "windowEdit",
  props: {
    header: {
      type: String,
      default: 'window',
    },
  },
  components: {},
  data: function () {
    return {
      offset: { x: 0, y: 0 },
      posx: 0,
      posy: 200,
      isMoving: false,
    }
  },
  methods: {
    mousemove(event) {
      if (this.isMoving) {
        var newposx = event.x - this.offset.x;
        var newposy = event.y - this.offset.y;

        if (newposx < 0) { newposx = 0; }
        if (newposy < 54) { newposy = 54; }

        this.posx = newposx;
        this.posy = newposy;
      }
    },

    mouseup(event) {
      this.isMoving = false;
    },
    mousedown(event) {
      this.offset = { x: event.offsetX, y: event.offsetY };
      this.isMoving = true;
    },
    resizeMouseDown(event) {
    },
    requestClose() {
    console.log('requessss');
    this.$emit('requestClose');
  }
  },
  mounted() {
    document.addEventListener('mousemove', this.mousemove);
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.mousemove);
  },


}
</script>