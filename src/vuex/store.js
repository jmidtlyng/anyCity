import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// the root, initial state object
export default new Vuex.Store({
  state: {
    // workout builder work in progress. array of workout data to be submitted
    wbWip: []
  },
  mutations: {
    ADD_EXERCISE_TO_WIP(state, newExercise){
      state.wbWip.push(newExercise)
    },
    REMOVE_EXERCISE_FROM_WIP(state, exToRemove){
      // find and remove wip item
      var i = state.wbWip.indexOf(exToRemove);
      state.wbWip.splice(i, 1)
    }
  },
  actions: {
    addExerciseToWip({commit}, newExercise){
      commit('ADD_EXERCISE_TO_WIP', newExercise)
    },
    removeExerciseFromWip({commit}, exToRemove){
      commit('REMOVE_EXERCISE_FROM_WIP', exToRemove)
    }
  },
  getters: {
    wbWip: state => state.wbWip
  }
})
