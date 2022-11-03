<template>
  <div>
    <div>
      <div class="d-flex">
        <div>
          <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <button class="nav-link rounded-0 active" id="v-pills-description-tab" data-bs-toggle="pill"
              data-bs-target="#v-pills-description" type="button" role="tab" aria-controls="v-pills-description"
              aria-selected="true">
              Description
            </button>
            <button class="nav-link rounded-0" id="v-pills-users-tab" data-bs-toggle="pill"
              data-bs-target="#v-pills-users" type="button" role="tab" aria-controls="v-pills-users"
              aria-selected="false">
              Members
            </button>
          </div>
        </div>
        <div class="border-left px-2 w-100">
          <div class="mt-2 p-2">
            <div class="tab-content" id="v-pills-tabContent">
              <div class="tab-pane fade show active" id="v-pills-description" role="tabpanel"
                aria-labelledby="v-pills-description-tab">
                <h2 class="text-center">{{ name }}</h2>
                A test compain for evaluating possibilities of a tool
              </div>
              <div class="tab-pane fade" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab">
                <div v-if="campaignPlayers">
                  <div class="card p-2" v-for="player in campaignPlayers">
                    <div class="d-flex">
                      <div class="h2 mb-0">{{ player.User.name }}</div>
                      <small class="text-muted ml-1 mt-auto">{{ player.Role.name }}</small>
                    </div>
                  </div>
                </div>
                <div v-if="liveInvites.length > 0" class="border-top mt-2">
                  <div class="">
                    <h2 class="mb-0">Invites</h2>
                  </div>
                  <div v-for="invite in liveInvites" class="card p-2">
                    <div class="d-flex flex-wrap justify-content-center">

                      <div class="text-center">
                        <div v-if="invite.User === null">
                          <h3 class="mb-n1">{{ invite.newUsername }}</h3>
                          <small class="text-muted">Unregistered user</small>
                        </div>
                        <div v-else>
                          <h3 class="mb-n1">{{ invite.User.name }}</h3>
                        </div>
                      </div>

                      <div v-if="invite.token" class="d-flex ml-2">
                        <div class="my-auto d-flex">
                          <div>
                            <h3 class="mb-n1">
                              {{ invite.token }}
                              <a class="align-text-top text-primary" href="#" @click="showQRCode(invite)"
                                :title="'Login token for ' + invite.newUsername">
                                <font-awesome-icon :icon="['fa', 'qrcode']" />
                              </a>
                            </h3>
                            <small class="text-muted">connection token</small>
                          </div>
                        </div>
                      </div>
                      
                      <div class="d-flex ml-2">
                        <div class="my-auto">
                          Sent: {{ invite.dateCreated | formatDateFull }}
                        </div>
                      </div>
                      <div class="ml-auto d-flex">
                        <div class="my-auto">
                          <a href="#" title="cancel invitation" @click="tryCancelInvite(invite)">
                            <font-awesome-icon :icon="['fa', 'times']" />
                          </a>

                        </div>
                      </div>
                    </div>
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

    <modal name="add-player-modal" :adaptive="true">
      <assistModalLook caption="Add new player" @cancel="stopAddingNewPlayer" @ok="sendCreateInvite">
        <div class="text-center">
          <div class="border-bottom">
            Select an existing player or write a new name create request for registration
            <div>
              <v-select v-model="userSelectedForInvite" :options="knownUsers" @search="fetchOptions" label="name"
                :taggable="true" :createOption="createInviteUser" />
            </div>
          </div>
        </div>
      </assistModalLook>

    </modal>

    <modal name="qrcode-show" :adaptive="true" :width="280" :height="380">
      <assistModalLook v-if="currentInvite" :caption="'Login token for ' + currentInvite?.newUsername"
        @ok="$modal.hide('qrcode-show');" :includeCancelButton="false">
        <div class="d-flex">
          <qr-code class="m-auto" :color="mainColors.primary" :bg-color="mainColors.background"
            :text="tokenToUrl(currentInvite?.token)" :title="'Login token for ' + currentInvite?.newUsername"></qr-code>
        </div>
      </assistModalLook>
    </modal>

    <modal name="cancel-ivite-warning" :adaptive="true">
      <assistModalLook caption="Revoke invite" @ok="cancelInvite" captionClass="bg-warning" okButtonText="revoke invite"
        okButtonClass="bg-danger text-dark">
        Are you shure you want to cancel invite to {{ canelingInvite?.newUsername }}?
      </assistModalLook>
    </modal>

  </div>
</template>

<script>
export default {
  name: 'CampaignStatus',

  data() {
    return {
      fetchedUsers: [],
      knownInvites: [],
      currentInvite: null,
      userSelectedForInvite: null,
      canelingInvite: null,
    }
  },

  computed: {
    name() {
      return this.$store.state.currentCampaign.name;
    },
    campaignPlayers() {
      return this.$store.state.currentCampaign.campaignPlayers;
    },
    knownUsers() {
      return this.fetchedUsers;
    },

    liveInvites() {
      return this.knownInvites.filter(x => x.deactivated === false);
    },
    mainColors() {
      return this.$store.state.colors;
    }

  },

  methods: {
    addPlayer() {
      this.userSelectedForInvite = null;
      this.$modal.show('add-player-modal');
      this.fetchOptions(null, null);
    },
    stopAddingNewPlayer() {
      this.$modal.hide('add-player-modal');
    },
    async fetchOptions(search, loading) {
      const users = await this.$axios.$get('/api/UsersFind', { params: { query: search } });
      this.fetchedUsers = users.users;

    },
    createInviteUser(name) {
      return { newUsername: name, name: name };
    },

    async sendCreateInvite(name) {
      this.$modal.hide('add-player-modal');

      var newInvite = {};

      if (this.userSelectedForInvite == null) {
        return;
      }

      if (this.userSelectedForInvite.id) {
        newInvite.UserId = this.userSelectedForInvite.id;
      } else {
        newInvite.newUsername = this.userSelectedForInvite.name;
      }

      await this.$axios.$post('/api/campaignInvitesCreate', newInvite);
      const invites = await this.$axios.$get('/api/campaignInvitesList');
      this.knownInvites = invites.invites;
    },

    tryCancelInvite(cancelInvite) {
      this.$modal.show('cancel-ivite-warning');
      this.canelingInvite = cancelInvite;
    },

    async cancelInvite() {
      await this.$axios.$post('/api/campaignInvitesDelete', { invite: { id: this.canelingInvite.id } });
      this.$modal.hide('cancel-ivite-warning');
      this.canelingInvite = null;

      const invites = await this.$axios.$get('/api/campaignInvitesList');
      this.knownInvites = invites.invites;
    },

    showQRCode(invite) {
      this.currentInvite = invite;
      this.$modal.show('qrcode-show');

    },

    tokenToUrl(token) {
      return 'https://ifpio.org/login?token=' + token;
    }

  },

  async fetch() {
    const request = await this.$axios.$get('/api/currentCampaign');
    this.$store.dispatch('currentCampaign/setState', request.campaign);
    const invites = await this.$axios.$get('/api/campaignInvitesList');
    this.knownInvites = invites.invites;
  },
}
</script>
