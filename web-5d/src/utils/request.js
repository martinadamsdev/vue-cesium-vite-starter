import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
const instance = axios.create({
  baseURL: process.env.API_HOST,
  timeout: 100000
})
// 请求拦截
instance.interceptors.request.use(function (config) {
  let token = getToken()
  if (token) {
    config.headers['authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 返回拦截
instance.interceptors.response.use(function (response) {
  if (response.status === 200) {
    if (response.data.code) {
      if (response.data.code === 200) {
        return response.data
      } else {
        return Promise.reject(response.data)
      }
    } else {
      if (response.config.responseType === 'arraybuffer' && response.data) {
        return response
      } else {
        return Promise.reject(Error(response.data))
      }
    }
  } else {
    return Promise.reject(Error(response.data))
  }
}, function (err) {
  if (err.response) {
    console.log(err)
    switch (err.response.status) {
      // 返回401 清除token信息并跳转到登录页面
      case 401: removeToken()
        localStorage.removeItem('userInfo')
        router.replace({
          path: '/'
        })
        break
      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        Message({
          type: 'error',
          message: '登录过期，请重新登录',
          duration: 1000,
          forbidClick: true
        })
        // 清除token
        removeToken()
        localStorage.removeItem('userInfo')
        router.replace({
          path: '/'
        })
        break
        // 404请求不存在
      case 404:
        Message({
          type: 'error',
          message: '网络请求不存在',
          duration: 1500,
          forbidClick: true
        })
        break
      case 504:
        Message({
          type: 'error',
          message: '请求超时, 请稍后重试',
          duration: 1500,
          forbidClick: true
        })
        break
        // 其他错误，直接抛出错误提示
      default:
        Message({
          type: 'error',
          message: err.response.data.message,
          duration: 1500,
          forbidClick: true
        })
    }
  }
  return Promise.reject(err.response.data)
})
// /**
//  * get方法，对应get请求
//  * @param {String} url [请求的url地址]
//  * @param {Object} params [请求时携带的参数]
//  */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// /**
//  * post方法，对应post请求
//  * @param {String} url [请求的url地址]
//  * @param {Object} params [请求时携带的参数]
//  */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    instance.post(url, params, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function postFormdata(url, params, config) {
  return new Promise((resolve, reject) => {
    instance.post(url, params, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// /**
//  * put方法，对应put请求
//  * @param {String} url [请求的url地址]
//  * @param {Object} params [请求时携带的参数]
//  */
export function put(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .put(url, params)
      .then(res => {
        resolve(res)
        // Loading.service(true).close();
        //  Message({message: '请求成功', type: 'success'});
      })
      .catch(err => {
        reject(err)
        // Loading.service(true).close();
        // Message({message: '加载失败', type: 'error'});

        Message.error('加载失败')
      })
  })
}

// /**
//  * delete
//  * @param {String} url [请求的url地址]
//  * @param {Object} params [请求时携带的参数]
//  */
export function deletedata(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, params)
      .then(res => {
        resolve(res)
        // Loading.service(true).close();
        //  Message({message: '请求成功', type: 'success'});
      })
      .catch(err => {
        reject(err)
        // Loading.service(true).close();
        // Message({message: '加载失败', type: 'error'});
        Message.error('加载失败')
      })
  })
}
