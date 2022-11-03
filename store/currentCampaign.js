

export const state = () => ({
  id: null,
  name: '',
  campaignPlayers: [],
})

export const getters = {
  getId(state) {
    return state.id
  },
  getName(state) {
    return state.name
  },

  getCampaignPlayers(state) {
    return state.campaignPlayers;
  },


}

export const mutations = {
  setId(state, value) {
    state.id = value;
  },
  setName(state, value) {
    state.name = value;
  },
  setCampaignPlayers(state, value) {
    state.campaignPlayers = value;
  },
}

export const actions = {
  setState(state, newState) {
  state.commit('setId', newState.id);
  state.commit('setName', newState.name);
  state.commit('setCampaignPlayers', newState.CampaignPlayers);

  }

}
