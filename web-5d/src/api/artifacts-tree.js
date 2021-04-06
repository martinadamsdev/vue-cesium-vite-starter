/*
 * @Author: your name
 * @Date: 2021-01-06 16:47:04
 * @LastEditTime: 2021-01-06 16:54:17
 * @LastEditors: Please set LastEditors
 * @Description: 模型树调用接口
 * @FilePath: \web-5d\src\api\artifacts-tree.js
 */
import { get } from '@/utils/request'
import config from '@/api/config'
// 查询目录子节点
const getChildTreeNode = (params) => get(config.modelTree + '/pTreeFolder/childrenNode', params)
export default {
  getChildTreeNode
}
