export const state = () => ({
    battleList:[],
    currentRound:1,
    isBattleActive:false,
  })
  
  export const getters = {
    getBattleList(state) {
      return state.battleList
    },
    getCurrentRound(state) {
      return state.currentRound
    },
    getIsBattleActive(state) {
      return state.isBattleActive
    }
  }
  
  export const mutations = {
    setBattleList(state, battleList) {
      state.battleList = battleList;
    },
    setCurrentRound(state, currentRound) {
      state.currentRound = currentRound;
    },
    setIsBattleActive(state, isBattleActive) {
      state.isBattleActive = isBattleActive;
    }
  }
  