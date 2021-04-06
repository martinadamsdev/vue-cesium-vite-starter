import { post } from '@/utils/request'
import config from '@/api/config'
// 验证token是否有效
const validationToken = (token) => post(config.userService + '/login/token', {})
// 登录
const login = (params) => post(config.userService + '/login/toLogin', params)
const loginOut = () => post(config.userService + '/login/logOut')
export default {
  validationToken,
  login,
  loginOut
}
