import { Loading } from 'element-ui'
var loadingInstance = {}
export function dateFormat(dateData) {
  var date = new Date(dateData)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  const time = y + '-' + m + '-' + d
  return time
}

export function getItem(key) {
  let item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item)
  }
  return null
}

export function loading(tips = '拼命加载中...') {
  loadingInstance = Loading.service({
    lock: true,
    fullscreen: true,
    text: tips,
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })
}

export function loadingClose() {
  loadingInstance.close()
}
