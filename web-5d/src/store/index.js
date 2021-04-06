import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import userInfo from './modules/user-info'
Vue.use(Vuex)
export default new Vuex.Store({
  state,
  mutations,
  modules: {
    userInfo
  }
})
