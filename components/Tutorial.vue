<!-- Please remove this file from your project -->
<template>
  <div>

    <allheader/>

    <main role="main">

      <section>
        <div class="container">

          <div class="p-2">
            <charactercard :currentInitiative="1" :levelVisible="true" :character="{name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: {max:23, current:12, visible:true}, armourClass: 17, }"/>
            <charactercard class="my-1" :currentInitiative="12" :levelVisible="true" :character="{name: 'MahBoiHavanski', level: 3, class: { name: 'Sorcerer' }, race: { name: 'halfling' }, health: {max:23, current:12, visible:true}, armourClass: 13, }"/>
            <charactercard class="my-1" :currentInitiative="13" :levelVisible="true" :character="{name: 'Cheekebreeker', level: 4, class: { name: 'Artificer' }, race: { name: 'Orc' }, health: {max:23, current:12, visible:true}, armourClass: 15, }"/>
        </div>

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
    components: { Header }
}
</script>
