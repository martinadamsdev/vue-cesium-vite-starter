/*
 * @Author: your name
 * @Date: 2021-02-21 16:01:58
 * @LastEditTime: 2021-03-03 15:12:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-5d\src\api\config.js
 */
/** @Author: wuhaimin * @Date: 2021-01-19 16:06:50 * @Last Modified by:   wuhaimin * @Last Modified time: 2021-01-19 16:06:50 * @Description: 配置请求接口的微服务名称 */

const _curEnv = 'prod'
const userService = _curEnv === 'dev' ? '/user' : '/api/user-service'
const docService = _curEnv === 'dev' ? '/doc' : '/api/doc-service'
const modelTree = _curEnv === 'dev' ? '/modelTree' : '/api/modelTree-service'
const annotationView = _curEnv === 'dev' ? '/annotationView' : '/api/annotationView-service'
const deliveryService = _curEnv === 'dev' ? '/delivery' : '/api/delivery-service'
export default{
  userService,
  docService,
  modelTree,
  annotationView,
  deliveryService
}
