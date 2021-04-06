import MODELS from '@/utils/model'

let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : JSON.parse(JSON.stringify(MODELS.DEFAULT_USER_INFO))
function updateMatterInfoCache(info) {
  localStorage.setItem('userInfo', JSON.stringify(info))
}
var result = []
var hasModules = ['model:all', 'doc:all', 'digitalDelivery:all']
function deepClone(val) {
  if (val.children.length > 0) {
    for (let x = 0; x < val.children.length; x++) {
      for (let i in val.children[x]) {
        result.push(i)
        deepClone(val.children[x][i])
      }
    }
  }
}
export default{
  namespaced: true,
  state: userInfo,
  mutations: {
    updateCache(state) {
      Object.assign(state, userInfo)
    },
    clearCache(state) {
      Object.assign(state, MODELS.DEFAULT_USER_INFO)
    },
    saveUserInfo(state, val) {
      Object.assign(state.userInfo, val)
      updateMatterInfoCache(state)
    },
    saveProjectList(state, val) {
      Object.assign(state.projectList, val)
      updateMatterInfoCache(state)
    },
    saveCurrentPro(state, val) {
      Object.assign(state.currentPro, val)
      updateMatterInfoCache(state)
    },
    saveToolBtn(state, val) {
      Object.assign(state.toolBtn, val)
      updateMatterInfoCache(state)
    },
    formatterPermission(state, val) {
      if (JSON.stringify(val) !== '{}') {
        for (let i = 0; i < hasModules.length; i++) {
          if (val[hasModules[i]]) {
            result.push(hasModules[i])
            deepClone(val[hasModules[i]])
          }
        }
        Object.assign(state.permission, result)
        updateMatterInfoCache(state)
      } else {
        Object.assign(state.permission, {})
        updateMatterInfoCache(state)
      }
    }
  }
}
