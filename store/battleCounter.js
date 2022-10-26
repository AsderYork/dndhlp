
function sortpred(a, b) { return a < b ? 1 : (a > b ? -1 : 0); }

export const state = () => ({
  battleList: [],
  currentRound: 1,
  currentActiveCharacter: null,
})

export const getters = {
  getBattleList(state) {
    return state.battleList
  },
  getCurrentRound(state) {
    return state.currentRound
  },
  getCurrentActiveCharacter(state) {
    return state.currentActiveCharacter;
  },

  getFullState(state) {
    return { battleList: state.battleList, currentRound: state.currentRound, activeCharacter: state.currentActiveCharacter };
  },
}

export const mutations = {
  setBattleList(state, battleList) {
    state.battleList = battleList;
  },
  updateCharacterInBattleList(state, character) {
    var oldCharIndex = state.battleList.findIndex(x => x.id === character.id);
    state.battleList[oldCharIndex] = character;
  },
  setCurrentRound(state, currentRound) {
    state.currentRound = currentRound;
  },
  setCurrentActiveCharacter(state, character) {
    state.currentActiveCharacter = character;
  },
}

export const actions = {
  sortBattleList(state) {
    state.commit('setBattleList', [...state.getters.getBattleList].sort((a, b) => sortpred(a.currentInitiative, b.currentInitiative)));
  },

  nextTurn(state) {
    var skipped = 0;
    var nextActiveCharacter = state.getters.getCurrentActiveCharacter;
    const ln = state.getters.getBattleList.length;
    var nextRound = false;


    if (nextActiveCharacter === null) {
      nextActiveCharacter = state.getters.getBattleList[0];
    } else {
      do {
        const currIndex = state.getters.getBattleList.indexOf(nextActiveCharacter);
        const nextIndex = (currIndex + 1) % ln;
        nextActiveCharacter = state.getters.getBattleList[nextIndex];
        nextRound = nextRound || (nextIndex === 0);
        skipped++;
      } while (nextActiveCharacter != null && !(nextActiveCharacter.character.recieveTurn) && skipped < ln);
    }

    if (nextRound) {
      state.commit('setCurrentRound', state.getters.getCurrentRound + 1);
    }
    state.commit('setCurrentActiveCharacter', nextActiveCharacter);

  },

  setFullState(state, newState) {
    if (JSON.stringify(newState) !== JSON.stringify(state.getters.getFullState)) {
      state.commit('setCurrentRound', newState.currentRound);
      state.commit('setBattleList', newState.battleList)
      state.commit('setCurrentActiveCharacter', newState.activeCharacter)
    }
  }

}
