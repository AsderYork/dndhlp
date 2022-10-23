import Vue from "vue"
import { VTooltip, VPopover, VClosePopover } from "v-tooltip"

Vue.directive("tooltip", VTooltip);
Vue.directive("close-popover", VClosePopover)
Vue.component("v-popover", VPopover)


  /*bind,
  update: bind,
  unbind (el) {
    destroyTooltip(el)
  },*/

Vue.directive('htooltip', {
    options: VTooltip.defaultOptions,
    bind: function (el) {
        el.addEventListener('mouseover', function (evt) {
          let targetEl = evt.target;
          if (targetEl.offsetWidth < targetEl.scrollWidth) {
            const text = evt.target.textContent.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g,' ').replace(/^\s+|\s+$/,'');
            VTooltip.bind(el, text);
            targetEl.setAttribute('v-htooltip', text);
          } else {
            targetEl.hasAttribute('v-tooltip') && targetEl.removeAttribute('v-tooltip');
            VTooltip.unbind(el);
          }
        });
      },
    update: VTooltip.update,
    unbind: VTooltip.unbind,
})