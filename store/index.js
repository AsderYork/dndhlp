export const state = () => ({
    windows: [],
    nextWindowId: 0,
    knownCharacters:[],
  })
  
  export const getters = {
    getWindows(state) {
      return state.windows;
    },
    getNextWindowId(state) {
      return state.nextWindowId;
    },
    getKnownCharactes(state) {
      return state.windows;
    },
  }
  
  export const mutations = {
    setWindows(state, windows) {
      state.windows = windows;
    },
    setNextWindowId(state, id) {
      state.nextWindowId = id;
    },
    setKnownCharactes(state, characters) {
      state.knownCharacters = characters;
    },
  }
  
  export const actions = {
    async createNextWindowId(state) {
      const nextWindowId = state.getters.getNextWindowId + 1;
      state.commit('setNextWindowId', nextWindowId);
      return nextWindowId;
    },
    async addWindow(state, window) {
      state.commit('setWindows', state.getters.getWindows.concat([Object.assign({id: await state.dispatch('createNextWindowId')}, window)]));
    },
    async moveWindowToFront(state, window) {
      const currWindows = state.getters.getWindows;
      if(currWindows.length > 0 && currWindows[currWindows.length - 1].id !== window.id) {
        var windowsWithoutMoved = currWindows.filter(x => x.id !== window.id);
        state.commit('setWindows', windowsWithoutMoved.concat([window]));
      }
    },
    async removeWindow(state, window) {
      const clearedWindows = state.getters.getWindows.filter(x => x.id !== window.id);
      state.commit('setWindows', clearedWindows);

    }
  }

