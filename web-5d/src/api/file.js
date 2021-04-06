import { post, deletedata, postFormdata } from '@/utils/request'
import config from '@/api/config'
//  添加文件夹
const addMenuList = (params) => post(config.docService + '/pAttachmentFolder/addPAttachmentFolder', params)
// 删除文件夹
const deleteMenuList = (params) => deletedata(config.docService + '/pAttachmentFolder/deletePAttachmentFolder', {data: params})
// 根据文件夹名称查询
// const selectMenuList = (params) => post('/pAttachmentFolder/findFolderName', params)
// 默认查出所有文件夹
const getMenulist = (projectId) => post(config.docService + `/pAttachmentFolder/findFolderAll/${projectId}`)
// 根据文件夹id查文件
const getChildrenList = (params) => post(config.docService + '/pAttachment/findAllByFolder', params)
// 修改文件夹
const editMenuList = (params) => post(config.docService + '/pAttachmentFolder/updateFolder', params)
// 查询文件
const selectCerterList = (params) => post(config.docService + '/pAttachment/findByPA', params)
// 修改文件
const getEditFile = (params) => post(config.docService + '/pAttachment/updatePA', params)
// 文件下载
const downloadExcel = (fileId) => postFormdata(config.docService + `/pAttachment/download/${fileId}`, {}, {responseType: 'arraybuffer'})
// 上传文件
const uploadExcel = (params) => post(config.docService + '/pAttachment/upload/file', params)
// 删除文件
const deleteExcal = (id) => deletedata(config.docService + `/pAttachment/deletePAttachment/${id}`)
// 批量删除文件
const deleteExcalNum = (ids) => deletedata(config.docService + '/pAttachment/batchDel', {data: { id: ids }})
// 文件预览
const previewExcal = (fileId) => post(config.docService + `/pAttachment/fileBrowseOnline/${fileId}`)
// 分片文件合并
const mergeFile = (data) => post(config.docService + '/uploader/mergeFile', {data: JSON.stringify(data)})
// 根据文件id 查询文件信息
const findMoreById = (idS) => post(config.docService + '/pAttachment/findMoreById', { id: idS })
// 文件类型
const uploadTypeList = {
  image: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
  video: ['mp4', 'rmvb', 'mkv', 'wmv', 'flv'],
  document: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'tif', 'tiff', 'rar', 'zip'],
  getAll() {
    return [...this.image, ...this.video, ...this.document]
  }
}
export default {
  uploadExcel,
  deleteExcalNum,
  deleteExcal,
  downloadExcel,
  getEditFile,
  selectCerterList,
  editMenuList,
  getChildrenList,
  getMenulist,
  // selectMenuList,
  deleteMenuList,
  addMenuList,
  previewExcal,
  mergeFile,
  uploadTypeList,
  findMoreById
}
