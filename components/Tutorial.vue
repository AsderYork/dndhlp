<!-- Please remove this file from your project -->
<template>
  <div>

    <allheader/>

    <main role="main">

      <section>
        <div class="container">

          <draggable class="p-2" v-model="myArray" group="characters" @start="drag=true" @end="drag=false" ghostClass="ghost" handle=".draggable-holder">
            <charactercard v-for="element in cahracters" :currentInitiative="1" :levelVisible="true" :character="element" :class="currentTurn == element.id ? 'character-selected' : ''"/>
          </draggable>

        </div>
      </section>

    </main>
      
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
    },
    data: function() {
      return {
        currentTurn:2,
        cahracters: [
          {id:1, name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: {max:23, current:12, visible:true}, armourClass: 17, },
          {id:2, name: 'MahBoiHavanski', level: 3, class: { name: 'Sorcerer' }, race: { name: 'halfling' }, health: {max:23, current:12, visible:true}, armourClass: 13, },
          {id:3, name: 'Cheekebreeker', level: 4, class: { name: 'Artificer' }, race: { name: 'Orc' }, health: {max:23, current:12, visible:true}, armourClass: 15, }
        ],
      }
    }
}
</script>
