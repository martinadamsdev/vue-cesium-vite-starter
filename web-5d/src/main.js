/// <reference path="../node_modules/cesium/Build/Cesium/Cesium.d.ts"/>
import Vue from 'vue'
import App from './App'
import router from './router'
import less from 'less'
import axios from 'axios'
import ElementUI from 'element-ui'
import * as Cesium from 'cesium'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './common/css/reset.css'
import './assets/iconfont/iconfont.css'
import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css'
import { getToken, removeToken } from '@/utils/auth'
import login from '@/api/login'
import NProgress from 'nprogress'
import uploader from 'vue-simple-uploader'
import 'nprogress/nprogress.css'
import './common/css/common.less'
import 'babel-polyfill'
Vue.config.productionTip = false
Vue.prototype.Cesium = window.Cesium = Cesium
Vue.prototype.$axios = axios
Vue.use(less)
Vue.use(uploader)
Vue.use(ElementUI)

NProgress.configure({ showSpinner: false })
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    login.validationToken().then(res => {
      store.commit('userInfo/saveUserInfo', res)
      if (to.path === '/') {
        next({
          path: '/project-list'
        })
      } else {
        next()
      }
    }).catch(err => {
      switch (err.code) {
        case 401: ElementUI.Message({ type: 'error', message: err.msg, duration: 1500 })
          next({
            path: '/login'
          })
          removeToken()
          localStorage.removeItem('userInfo')
          break
        default: next()
      }
    })
  } else {
    store.commit('userInfo/clearCache')
    localStorage.removeItem('userInfo')
    if (to.path === '/' || to.path === '/login') {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
