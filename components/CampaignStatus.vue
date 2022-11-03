<template>
  <div>
    <div class="border-bottom px-4">
      <h2 class="text-center">{{ name }}</h2>
    </div>
    <div>
      <div class="d-flex">
          <div>
            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <button class="nav-link rounded-0 active" id="v-pills-description-tab" data-bs-toggle="pill" data-bs-target="#v-pills-description" type="button" role="tab" aria-controls="v-pills-description" aria-selected="true">
                Description
              </button>
              <button class="nav-link rounded-0" id="v-pills-users-tab" data-bs-toggle="pill" data-bs-target="#v-pills-users" type="button" role="tab" aria-controls="v-pills-users" aria-selected="false">
                Members
              </button>
            </div>
          </div>
          <div class="border-left px-2 w-100">
            <div class="mt-2 p-2">
              <div class="tab-content" id="v-pills-tabContent">
              <div class="tab-pane fade show active" id="v-pills-description" role="tabpanel" aria-labelledby="v-pills-description-tab">
                A test compain for evaluating possibilities of a tool  
              </div>
              <div class="tab-pane fade" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab">
                <div class="card p-2" v-for="player in campaignPlayers">
                  <div class="d-flex">
                    <div class="h2 mb-0">{{player.User.name}}</div>
                    <small class="text-muted ml-1 mt-auto">{{player.Role.name}}</small>
                  </div>
                </div>
                
                <div class="mt-1 pt-1 border-top">
                  <button class="btn btn-primary w-100" @click="addPlayer">
                    <font-awesome-icon :icon="['fa', 'plus']" /> Invite players
                  </button>
                </div>

              </div>
            </div>
            </div>
          </div>
        </div>  
    </div>

    <modal name="add-player-modal">
      <assistModalLook caption="Add new player" @cancel="stopAddingNewPlayer">
        This is my first modal
      </assistModalLook>
        
    </modal>

  </div>
</template>

<script>
export default {
  name: 'CampaignStatus',

  computed: {
    name() {
      return this.$store.state.currentCampaign.name;
    },
    campaignPlayers() {
      return this.$store.state.currentCampaign.campaignPlayers;
    },
  },

  methods: {
    addPlayer() {
      this.$modal.show('add-player-modal');
    },
    stopAddingNewPlayer() {
      this.$modal.hide('add-player-modal');
    }
  },

  async fetch() {
    const request = await this.$axios.$get('/api/currentCampaign', { params: { campaign: { id: 1 } } });
    console.log(request);
    this.$store.dispatch('currentCampaign/setState', request.campaign);
  },
}
</script>
