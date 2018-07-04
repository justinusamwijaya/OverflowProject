import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: !!localStorage.getItem('token'),
    username: localStorage.getItem('username')
  },
  mutations: {
    changeUsername (state) {
      state.username = localStorage.getItem('username')
    }
  },
  actions: {
    changeUsernameAct ({commit}) {
      commit('changeUsername')
    }
  }
})
