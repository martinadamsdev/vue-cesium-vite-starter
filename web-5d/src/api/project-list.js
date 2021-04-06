/*
 * @Author: qi lan li
 * @Date: 2020-12-17 09:02:16
 * @LastEditTime: 2021-01-14 14:03:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-5d\src\api\project-list.js
 */
import { post } from '@/utils/request'
import config from '@/api/config'
const getProjectList = (id) => post(config.userService + '/sysUser/findUsersByIds', { id: [id] })
const getProjectDetails = (id) => post(config.userService + '/project/findProByIds', { id: [id] })
const getMilestone = (fromData) => post(config.deliveryService + '/pMilestoneContent/findByName', fromData)
const getMilestoneContent = (id) => post(config.deliveryService + '/pMilestoneContent/findAllPDC/' + id)
export default {
  getProjectList,
  getProjectDetails,
  getMilestone, // 个人主页里程碑
  getMilestoneContent
}
