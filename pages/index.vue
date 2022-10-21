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
                    <button type="button" class="accordion-button border-top border-bottom py-1 pl-2 w-100 text-left" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <font-awesome-icon :icon="['fa', 'dragon']" /> <b>Monsters</b>
                    </button>
                  </div>
                  <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#leftmenu-accordeon">
                    <CharactersPalette class="accordion-body"/>
                  </div>
                </div>
                <div class="accordion-item">
                  <div class="accordion-header" id="headingTwo">
                    <button type="button" class="accordion-button border-top border-bottom py-1 pl-2 w-100 text-left" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                      <font-awesome-icon :icon="['fa', 'dungeon']" /> <b>Prepared battles</b>
                    </button>
                  </div>
                  <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#leftmenu-accordeon">
                    <div class="accordion-body">
                      <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
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
          <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-expanded="false" aria-bs-controls="sidebarMenu">
            <font-awesome-icon :icon="['fa', 'bars']" />
          </button>

          <!-- Brand -->
          <span class="navbar-brand" href="#">
            <b class="text-primary">DNDHLP</b>
            <font-awesome-icon :icon="['fa', 'flag']" />
          </span>
          <!-- Search form -->


          <!-- Right links -->
        </div>
        <!-- Container wrapper -->
      </nav>
      <!-- Navbar -->
    </header>
    <!--Main Navigation-->

    <!--Main layout-->
    <main style="margin-top: 58px;" class="container pt-4">
      <Battlecounter/>
    </main>
    <!--Main layout-->
  </div>
</template>

<script>
import Vue from 'vue'
import CharactersPalette from '~/components/CharactersPalette.vue';

export default Vue.extend({
    name: "IndexPage",
    components: { CharactersPalette }
})
</script>
