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
            <button class="nav-link rounded-0" id="v-pills-resources-tab" data-bs-toggle="pill"
              data-bs-target="#v-pills-resources" type="button" role="tab" aria-controls="v-pills-resources"
              aria-selected="false">
              Resources
            </button>
          </div>
        </div>
        <div class="border-left px-2 w-100">
          <div class="mt-2 p-2">
            <div class="tab-content" id="v-pills-tabContent">
              <div class="tab-pane fade show active" id="v-pills-description" role="tabpanel"
                aria-labelledby="v-pills-description-tab">
                <h2 class="text-center" v-if="currentCampaign">
                  <assistEditableInput v-model="campaignName" :editable="editable"></assistEditableInput>
                </h2>
                <assistEditableInput v-model="campaignDescription" :editable="editable" :isTextarea="true">
                </assistEditableInput>
              </div>
              <div class="tab-pane fade" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab">
                <div v-if="campaignPlayers" class="d-flex flex-column" style="gap:0.25rem">
                  <div class="card p-2" v-for="player in campaignPlayers" :key="player.id">
                    <div class="d-flex" style="gap:0.25rem">
                      <div class="h2 mb-0">{{ player.User.name }}</div>
                      <small class="text-muted ml-1 mt-auto">{{ player.Role.name }}</small>
                    </div>
                  </div>
                </div>
                <div v-if="knownInvites.length > 0" class="border-top mt-2">
                  <div class="">
                    <h2 class="mb-0">Invites</h2>
                  </div>
                  <div v-for="invite in knownInvites" class="card p-2">
                    <div class="d-flex flex-wrap justify-content-center">

                      <div class="text-center">
                        <div v-if="invite.User == null">
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
              <div class="tab-pane fade" id="v-pills-resources" role="tabpanel" aria-labelledby="v-pills-resources-tab">
                <h2 class="text-center">Resources</h2>
                <b-table striped hover :items="activeDatabases" class="mb-0 table table-sm" :fields="['url', '']">
                  <template #cell(url)="row">
                    {{row.item.url}}
                    <a href="#" class="text-danger" @click.prevent="removeDatabase(row.item)">
                      <font-awesome-icon :icon="['fa', 'times']"/>
                    </a>
                  </template>
                </b-table>
                <button class="btn btn-primary w-100" @click="$modal.show('add-database');">
                  <font-awesome-icon :icon="['fa', 'plus']" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal name="add-database" :adaptive="true">
      <assistModalLook caption="Add database" @cancel="stopAddingDatabase" @ok="AddNewDatabase">
        <div class="text-center">
          <div class="border-bottom">
            <h3>Add Database</h3>
            <div>
              <v-select v-model="addingDatabase" :options="knownDatabases" :taggable="true" />
            </div>
          </div>
        </div>
      </assistModalLook>

    </modal>

    <modal name="add-player-modal" :adaptive="true">
      <assistModalLook caption="Add new player" @cancel="stopAddingNewPlayer" @ok="sendCreateInvite">
        <div class="text-center">
          <div class="border-bottom">
            <h3>Select an existing player or write a new name to create a request for registration</h3>
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
        Are you sure you want to cancel invite to {{ canelingInvite?.newUsername }}?
      </assistModalLook>
    </modal>

  </div>
</template>

<script>
export default {
  name: 'CampaignStatus',

  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    campaign: {
      type: Object,
      default() {
        return {
          name: 'Unnamed',
          settings: {
            remoteDatabases: [],
          },
          knownUsers: [],
          currentInvites: [],
        }
      }
    },
  },

  data() {
    return {
      fetchedUsers: [],
      currentInvite: null,
      userSelectedForInvite: null,
      canelingInvite: null,
      currentCampaign: {},
      knownDatabases: ['https://www.dnd5eapi.co/'],
      addingDatabase: null,
    }
  },

  computed: {
    name() {
      return this.$store.state.currentCampaign.name;
    },
    campaignPlayers() {
      return this.currentCampaign.CampaignPlayers;
    },
    knownUsers() {
      return this.fetchedUsers;
    },
    knownInvites() {
      if (!this.currentCampaign.CampaignInvites) {
        return [];
      }
      return this.currentCampaign.CampaignInvites;
    },
    mainColors() {
      return this.$store.state.colors;
    },

    activeDatabases() {
      if (this.currentCampaign?.settings?.externalDatabases) {
        return this.currentCampaign.settings.externalDatabases;
      }
      return [];
    },

    campaignName: {
      get() {
        return this.currentCampaign.name;
      },
      set(val) {
        this.currentCampaign.name = val;
        this.updateCampaign();
      }
    },
    campaignDescription: {
      get() {
        var description = this.currentCampaign.description;
        if (!description) {
          description = "Description";
        }
        return description;
      },
      set(val) {
        this.currentCampaign.description = val;
        this.updateCampaign();
      }
    },

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

    AddNewDatabase() {
      this.$modal.hide('add-database');

      if (!this.currentCampaign.settings) {
        this.currentCampaign.settings = {};
      }
      if (!this.currentCampaign.settings.externalDatabases) {
        this.currentCampaign.settings.externalDatabases = [];
      }

      this.currentCampaign.settings.externalDatabases.push({ url: this.addingDatabase });
      this.updateCampaign();
    },

    removeDatabase(item) {
      if (!this.currentCampaign.settings) {
        this.currentCampaign.settings = {};
      }
      if (!this.currentCampaign.settings.externalDatabases) {
        this.currentCampaign.settings.externalDatabases = [];
      }

      this.currentCampaign.settings.externalDatabases = this.currentCampaign.settings.externalDatabases.filter(x => x.url !== item.url);
      this.updateCampaign();
    },

    stopAddingDatabase() {
      this.$modal.hide('add-database');
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

      const request = await this.$axios.$post('/api/campaignInvitesCreate', newInvite);
      this.updateCampaign(false, request.campaign);


    },

    tryCancelInvite(cancelInvite) {
      this.$modal.show('cancel-ivite-warning');
      this.canelingInvite = cancelInvite;
    },

    async cancelInvite() {
      this.$modal.hide('cancel-ivite-warning');

      const request = await this.$axios.$post('/api/campaignInvitesDelete', { invite: { id: this.canelingInvite.id } });
      this.updateCampaign(false, request.campaign);
      this.canelingInvite = null;
    },

    showQRCode(invite) {
      this.currentInvite = invite;
      this.$modal.show('qrcode-show');

    },

    tokenToUrl(token) {
      return 'https://ifpio.org/login?token=' + token;
    },

    async updateCampaign(forceFetch = false, campaignData = null) {
      var newCampaignData = campaignData;

      if (newCampaignData === null) {

        if (this.currentCampaign && !forceFetch) {
          const response = await this.$axios.$post('/api/updateCampaign', this.currentCampaign);
          newCampaignData = response.campaign;
        } else {
          const campaign = await this.$axios.$get('/api/getCampaign', { params: { id: this.campaign.id } });
          newCampaignData = campaign.campaign;
        }
      }

      if (newCampaignData.settings && (typeof newCampaignData.settings === 'string' || newCampaignData.settings instanceof String)) { newCampaignData.settings = JSON.parse(newCampaignData.settings); }
      this.currentCampaign = newCampaignData;
    }

  },

  async fetch() {

    if (this.campaign.id) {
      await this.updateCampaign(true);
    }

  },
}
</script>
