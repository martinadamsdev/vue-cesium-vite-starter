/*
 * @Author: your name
 * @Date: 2021-01-28 14:13:21
 * @LastEditTime: 2021-03-17 18:08:48
 * @LastEditors: Please set LastEditors
 * @Description: 我的任务
 * @FilePath: \web-5d\src\api\task.js
 */
import config from './config'
import { post, postFormdata } from '@/utils/request'
// 交付任务获取 文档/模型/数据交付列表
const findMyTaskByUserId = (fromData) => post(config.deliveryService + '/myTask/findMyDeliveryTaskByUserId', fromData)
// 我的任务列表 加载
const findMyTaskList = (userId, projectId) => post(config.deliveryService + '/myTask/findMyTaskByUserId/' + userId + '/' + projectId)
// 上传文件获取文件正则
const uploadFileFindFileCode = (fromData) => post(config.deliveryService + '/pDeliveryContentDoc/findByName', fromData)
// 添加交付清单
const addDY = (fromData) => postFormdata(config.deliveryService + '/pDeliveryContentDoc/insert', fromData, { headers: {
  'content-type': 'multipart/form-data'
} })
// 修改清单交付文档文件名称
const updateDD = (fromData) => post(config.deliveryService + '/pDeliveryContentDoc/updatePDCDById', fromData)
// 文档交付删除
const deleteDD = (idArry) => post(config.deliveryService + '/pDeliveryContentDoc/batchDel', { id: idArry })
// 完成交付
const taskOk = (fromData) => post(config.deliveryService + '/myTask/fulfil', fromData)
// 根据不同的数据状态查找不同的任务清单 验收||审核
const findMyTaskByDCId = (query) => postFormdata(config.deliveryService + '/myTask/findMyTaskByDCId', query, { headers: { 'content-type': 'multipart/form-data' } })
// 根据文件id实现在线浏览
const previewDoc = (id) => post(config.docService + `/pAttachment/fileBrowseOnline/${id}`)
// 文件下载
const downloadDoc = (fileId) => postFormdata(config.docService + `/pAttachment/download/${fileId}`, {}, {responseType: 'arraybuffer'})
// 点击查询历史记录
const findHistoryById = (query) => post(config.deliveryService + `/myTask/findMyTaskByModelId`, query)
// 模型交付单独新增
const addModel = (fromData) => post(config.deliveryService + '/pDeliveryModelFile/insert', fromData, { headers: {
  'content-type': 'multipart/form-data'
} })
// 模型单独修改
const updataModel = (query) => post(config.deliveryService + '/pDeliveryModelFile/updatePDCDById', query)
// 模型单独删除
const deleteModel = (idArry) => post(config.deliveryService + '/pDeliveryModelFile/batchDel', { id: idArry })
// 根据项目id 查找所有名称和正则表达式
const findRegByProjectId = (projectId) => post(config.deliveryService + '/pDeliveryContentDoc/findNameAndRegularByProjectId/' + projectId)
// 添加数据交付-属性清单
const addProtypeData = (fromData) => postFormdata(config.deliveryService + '/pDeliveryPropertyFile/insert', fromData, { headers: {
  'content-type': 'multipart/form-data'
} })
// 根据属性id查询审核界面所有数据
const getProperty = (query) => post(config.deliveryService + `/myTask/findMyTaskByPropertyId/?id=${query}`)
// 数据交付-属性 修改名称
const updataProtypeData = (fromData) => post(config.deliveryService + '/pDeliveryPropertyFile/updatePDPFById', fromData)
// 数据-属性 单独删除
const deleteDataProtype = (idArry) => post(config.deliveryService + '/pDeliveryPropertyFile/batchDel', { id: idArry })
// 属性单独查找
const findMyTaskByPropertyId = (id) => post(`${config.deliveryService}/myTask/findMyTaskByPropertyId?id=${id}`)
// 根据交付查找对应规则 -文档
const findMyDelRegFlieList = (id) => post(`${config.deliveryService}/pDeliveryContent/findRegulationAttachmentById/${id}`)
// 根据交付查找对应规则 -model
const findRegulationAttachmentById = (id) => post(`${config.deliveryService}/pDeliveryModelSetting/findRegulationAttachmentById/${id}`)
// 根据交付查找对应规则 -data-property
const findRegulationAttachmentByIdByProperty = (id) => post(`${config.deliveryService}/pDeliveryPropertySetting/findRegulationAttachmentById/${id}`)
export default {
  findMyTaskByUserId,
  findMyTaskList,
  uploadFileFindFileCode,
  addDY,
  updateDD,
  deleteDD,
  taskOk,
  findMyTaskByDCId,
  previewDoc,
  downloadDoc,
  findHistoryById,
  addModel,
  updataModel,
  deleteModel,
  findRegByProjectId,
  addProtypeData,
  updataProtypeData,
  deleteDataProtype,
  findMyTaskByPropertyId,
  getProperty,
  findMyDelRegFlieList,
  findRegulationAttachmentById,
  findRegulationAttachmentByIdByProperty
}
