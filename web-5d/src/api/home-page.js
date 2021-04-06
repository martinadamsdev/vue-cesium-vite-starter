import { get, post } from '@/utils/request'
import config from '@/api/config'
// 根据项目获取模型
const getModel = (id) => get(config.modelTree + '/pTreeGroup/selectByProjectId', { id: id })
// 模型添加标注点
const addMark = (params) => post(config.annotationView + '/pGraphicsLabel/addPGraphicsLabel', params)
// 获取模型标注点
const getMark = (params) => post(config.annotationView + '/pGraphicsLabel/findByAll', params)
// 编辑标注点
const updateMark = (params) => post(config.annotationView + '/pGraphicsLabel/updateById', params)
// 获取共享标注
const getShareMark = (params) => post(config.annotationView + '/pGraphicsLabel/myShare', params)
// 分享标注
const shareMark = (params) => post(config.annotationView + '/pGraphicsLabel/batchShare', params)
// 删除标注点
const delMark = (params) => post(config.annotationView + '/pGraphicsLabel/batchDel', { id: params })
// 添加视点
const addTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/addPGraphicsViewpoint', params)
// 编辑视点
const editTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/updateById', params)
// 删除视点
const delTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/batchDel', { id: params })
// 获取我的视点
const getTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/findByAll', params)
// 视点分享/取消分享
const shareTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/batchShare', params)
// 取消视点分享
const cancelShareTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/batchShare', params)
// 获取共享视点
const getShareTag = (params) => post(config.annotationView + '/PGraphicsViewpoint/findByShared', params)
// 获取交付文档树形列表
const getFolderTreeList = (id) => post(config.deliveryService + '/pDeliveryContent/deliveryContentTreeList/' + id)
// 获取交付文档的文件
const getFolderData = (id) => post(config.docService + '/pAttachmentRefEntity/findMoreById/' + id)
// 模型元件关联文档
const modelLinkDoc = (params) => post(config.docService + '/pAttachmentRefEntity/insert', params)
// 查询模型图元关联的文件
const getEntityLinkDoc = (id) => post(config.docService + '/pAttachmentRefEntity/findAttachmentId/' + id)
// 获取模型属性
const modelProperty = (id) => get(config.modelTree + '/property/queryDesignDataById', { id: id })
// 关联工厂结构
const treeLinkModel = (params) => post(config.modelTree + '/treeRefEntity/pTreeRefEntity', params)
// 查询构件树节点对应模型的位置
const getTreeModelPosition = (id) => get(config.modelTree + '/treeRefEntity/queryGraphicsByTree', { treeId: id })
// pid 关联 后续需要删除
// 1.根据项目id查询pid
const getProPid = (id) => get(config.modelTree + '/refPid/getPidFileData', { projectId: id })
// 模型元件关联pid
const entityLinkPid = (params) => post(config.modelTree + '/refPid/getPidFileData', params)
// 根据entityId获取pid文件
const getPidByEntity = (id) => get(config.modelTree + '/refPid/getPidFileByEntityId', { entityId: id })
// 根据entityId获取pid的entityId
const getPEntityIdByEntity = (id) => get(config.modelTree + '/refPid/getPEntityIdByEntity', { entityId: id })
export default {
  getModel,
  addMark,
  getMark,
  updateMark,
  delMark,
  getShareMark,
  shareMark,
  addTag,
  editTag,
  delTag,
  getTag,
  shareTag,
  cancelShareTag,
  getShareTag,
  getFolderTreeList,
  getFolderData,
  modelLinkDoc,
  modelProperty,
  treeLinkModel,
  getTreeModelPosition,
  getEntityLinkDoc,
  getProPid,
  entityLinkPid,
  getPidByEntity,
  getPEntityIdByEntity
}
