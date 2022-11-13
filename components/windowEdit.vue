<template>
  <div class="card element-window" :style="{ 'top': this.posy + 'px', 'left': this.posx + 'px' }" @mousedown="resizeMouseDown" ref="wndcap">
    <div class="border-bottom pl-2 bg-primary rounded-top d-flex justify-content-between" @mouseup="mouseup" @mousedown="mousedown">
      <div class="user-select-none text-white">{{header}}</div>
      <div class="user-select-none border-left bg-secondary px-2" style="border-top-right-radius: 0.25rem"><a href="#" @click="requestClose"><font-awesome-icon :icon="['fa', 'times']" /></a></div>
    </div>
    
    <div>
        <slot></slot>
    </div>
  </div>
</template>

<script>
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
      document.body.classList.remove('unselectable');

    },
    mousedown(event) {
      if(window.getComputedStyle(this.$refs.wndcap).position === 'absolute') {
        this.$emit('requestMoveToFront');
        this.offset = { x: event.offsetX, y: event.offsetY };
        this.isMoving = true;
        document.body.classList.add('unselectable');
      }
    },
    resizeMouseDown(event) {},
    requestClose() {
      this.$emit('requestClose');    
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.mousemove);
    document.addEventListener('mouseup', this.mouseup);
  },
  beforeDestroy() {
    document.body.classList.remove('unselectable');
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
  },


}
</script>