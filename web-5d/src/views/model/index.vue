/**
@Author: wuhaimin
* @Date: 2020-10-12 15:14:26
 * @Last Modified by: wangliquan
 * @Last Modified time: 2021-04-06 18:17:45
* @Description: 模型
*/

<template>
  <div class="model-box">
    <div id='cesium-model' :style="{background: 'url('+bgUrl+') no-repeat center'}"></div>
    <ToolBtn @mark="mark" @clipping="clipping" ref="toolBtn" @home="home" @measure="measure" @handleViewDir="handleViewDir" @details="details" @hanlderViewTag="hanlderViewTag" @roaming="roaming" @linkFolder="linkFolder"/>
    <ClippingPanel v-if="clippingShow" @closeClipping="closeClipping" ref="clipping" @changeAxial="changeAxial" @sliderInput="sliderInput"/>
    <ArtifactsDetails v-show="detailsShow" :data="detailsData" :baseData="baseData"/>
    <ArtifactsTree v-show="treeShow" @nodeClick="nodeClick"/>
    <!-- <EditMark :show="editMarkShow" :position="markLocation" @editMark="editMark"/> -->
    <EditMarkPanel v-if="editPanelShow" :recordMsg="recordMark" @postData="postData" @cancel="cancelEditMark"/>
    <LeftBtn @viewMenu="viewMenu" @viewMark="viewMark" @viewTag="viewTag" @viewLinkDoc="handleViewDoc"/>
    <EditTag v-if="tagDisable" :recordMsg="tagMsg" @editTag="editTag"/>
    <ViewTag ref="viewTag" v-if="tagListDisable" :modelId="modelId" :projectId="currentPro.projectId" :userId="userInfo.userId" @toTag="tagRowClick" @handleEditTag="handleEditTag"/>
    <ViewMark ref="viewMark" v-if="markListDisable" :modelId="modelId" :projectId="currentPro.projectId" :userId="userInfo.userId" @handleEditMark="handleEditMark" @handleActive="handleActive"/>
    <ViewDoc ref="viewDoc" v-if="linkDocFlag" :entityId="markEntity" />
    <FolderList v-if="linkFolderFlag" :projectId="currentPro.projectId" @sureLink="sureLink" @cancelLink="cancelLink"/>
    <!-- <PidModel /> -->
    <el-button type="primary" @click="treeLinkModel" class="link-btn">关联位置</el-button>
    <!-- <el-button type="primary" @click="linkPid" class="link-pid">关联pid</el-button> -->
  </div>
</template>
<script>
import modelApi from '@/api/home-page.js'
import { mapState } from 'vuex'
import { loading, loadingClose } from '@/utils/index'
import { initRoamingModel, firstPersonCamera, freeRoaming } from '@/utils/roam/index'
// 将这些定义在外面是因为在data里面， 当你修改某一个值的时候，操作会特别卡顿
var viewer = {}
var tileset = null
var previousPickedEntity = {
  feature: null,
  originalColor: null
}
var logBillboard = null
var primitiveCollection = null
var clippingPlane
var targetY = 0.0
var positions = []
var tempLines = []
// var tempBillboard = []
var viewMark = []
var tileContent = {}
var entityIdArr = []
// 用来保存当前点击的标注
// var tempMark = null
export default {
  name: 'Model',
  data() {
    return {
      bgUrl: require('@/assets/bg.png'),
      img: require('@/common/image/mark.png'),
      markFlag: false,
      clippingShow: false,
      measureFlag: false,
      detailsShow: true,
      treeShow: false,
      menuShow: false,
      baseData: {
        '基本属性': {
          '构件ID': '',
          '构件名称': ''
        }
      },
      detailsData: {
        '设计类': {
          '名称': '油罐',
          '高度': '100m'
        },
        '施工类': {
          '文档': 'doc格式'
        }
      },
      modelId: '',
      editPanelShow: false,
      recordMark: {},
      tagDisable: false,
      tagListDisable: false,
      addTagFlag: false,
      tagMsg: {
        id: '',
        name: '',
        x: 0,
        y: 0,
        z: 0,
        heading: 0,
        pitch: 0,
        roll: 0,
        projectId: '',
        entityId: '',
        createBy: '',
        createById: ''
      },
      markListDisable: false,
      linkFolderFlag: false,
      markEntity: '',
      linkDocFlag: false,
      treeId: '' // 暂时性，后面需要删除
    }
  },
  computed: {
    ...mapState('userInfo', {
      currentPro: state => state.currentPro,
      userInfo: state => state.userInfo
    })
  },
  components: {
    ToolBtn: () => import('./components/tool-btn'),
    LeftBtn: () => import('./components/left-btn'),
    ClippingPanel: () => import('./components/clipping-panel'),
    ArtifactsDetails: () => import('./components/artifacts-details'),
    ArtifactsTree: () => import('./components/artifacts-tree'),
    EditMark: () => import('./components/edit-mark'),
    EditMarkPanel: () => import('./components/edit-panel'),
    EditTag: () => import('./components/edit-tag'),
    ViewTag: () => import('./components/view-tag'),
    ViewMark: () => import('./components/view-mark'),
    ViewDoc: () => import('./components/view-doc'),
    FolderList: () => import('./components/folder-list'),
    PidModel: () => import('./components/pid-model')
  },
  mounted() {
    this.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NmE3NDNkZi00NzdiLTQ4NzItOGI1YS1hODhjNDc2MmEyNDgiLCJpZCI6MzQ1MDcsImlhdCI6MTYwMDM5NDYwOX0.h_LVf8AnLALUx2ft6OjLoxdV4Ag0au9x51nUsyrEu9Y'
    viewer = new this.Cesium.Viewer('cesium-model', {
      // maximumRenderTimeChange: Infinity,
      // sceneMode: this.Cesium.SceneMode.COLUMBUS_VIEW,
      requestRenderMode: false,
      shouldAnimate: true, // 动画
      animation: false, // 是否显示左下角的仪表盘
      baseLayerPicker: false, // 是否显示图层选择器按钮，右上角那个地图图标
      fullscreenButton: false, // 是否显示全屏按钮
      vrButton: false, // 是否显示VR按钮
      geocoder: false, // 是否显示搜索按钮
      homeButton: false, // 是否显示主页按钮
      infoBox: false, // 是否显示提示信息
      sceneModePicker: false, // 是否显示右上角的模式切换按钮
      selectionIndicator: false, // 是否显示选取指示器组件
      timeline: false, // 是否显示下边的时间轴
      navigationHelpButton: false, // 是否显示右上角的帮助按钮
      navigationInstructionsInitiallyVisible: true, // 是不显示导航
      scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约GPU资源
      imageryProvider: [],
      navigationHelpButtonViewModel: false,
      orderIndependentTranslucency: false,
      contextOptions: {
        webgl: {
          alpha: true
        }
      }
    })
    // 开发测试工具
    // 发版需要注释掉
    viewer.extend(this.Cesium.viewerCesiumInspectorMixin)
    // 防锯齿
    if (this.Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      viewer.resolutionScale = window.devicePixelRatio
    }
    // 隐藏版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    // 是否开启防锯齿
    viewer.scene.fxaa = true
    viewer.scene.postProcessStages.fxaa.enabled = true
    // 关闭相关特效 优化
    viewer.scene.moon.show = false
    viewer.scene.fog.enabled = false
    viewer.scene.skyBox.show = false
    viewer.resolutionScale = 0.9
    viewer.scene.sun.show = false
    viewer.scene.globe.show = false
    viewer.scene.backgroundColor = new this.Cesium.Color(0.0, 0.0, 0.0, 0.0)
    viewer.scene.skyAtmosphere.show = false
    this.getModel(this.currentPro.projectId)
    // 设置图元集合
    primitiveCollection = new this.Cesium.PrimitiveCollection()
    viewer.scene.primitives.add(primitiveCollection)
    // 鼠标点击事件(左击)
    viewer.screenSpaceEventHandler.setInputAction((movement) => {
      console.log(viewer.camera.heading)
      console.log(viewer.camera.pitch)
      console.log(viewer.camera.range)
      const pickedEntity = viewer.scene.pick(movement.position)
      console.log(pickedEntity)
      if (pickedEntity && pickedEntity instanceof this.Cesium.Cesium3DTileFeature) {
        this.markEntity = pickedEntity.getProperty('entityId')
        if (this.detailsShow) {
          this.setDetailsData(pickedEntity.getProperty('entityId'), pickedEntity.getProperty('name'))
          this.getModelProperty(this.markEntity)
        }
        // 模型高亮
        this.ModelHightlight(pickedEntity)
        if (this.markFlag) {
          // 添加标注
          this.addMark(movement.position)
        } else if (this.measureFlag) {
          // 测量距离
          this.measurePolyLine(movement)
        } else if (this.addTagFlag) {
          const camera = viewer.camera
          this.tagMsg = Object.assign({}, this.tagMsg, {
            id: '',
            name: '',
            x: camera._positionWC.x,
            y: camera._positionWC.y,
            z: camera._positionWC.z,
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll,
            projectId: this.currentPro.projectId,
            entityId: this.modelId,
            createBy: this.userInfo.realName,
            createById: this.userInfo.userId
          })
          this.addViewTag()
        }
      } else if (!pickedEntity || pickedEntity.id._name !== 'markPoint') {
        if (previousPickedEntity.feature) {
          previousPickedEntity.feature.color = previousPickedEntity.originalColor
        }
        previousPickedEntity.feature = undefined
        previousPickedEntity.originalColor = undefined
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  destroyed() {
    window.onresize = null
    // 释放空间
    viewer = null
    tileset = null
    previousPickedEntity = null
    logBillboard = null
    clippingPlane = null
    targetY = null
  },
  methods: {
    // 模型加载
    loadModel(url) {
      loading('模型加载中...')
      if (tileset) {
        let primitives = viewer.entities
        primitives.remove(tileset)
        tileset = null
      }
      tileset = primitiveCollection.add(new this.Cesium.Cesium3DTileset({
        url, // './static/output/tileset.json',
        modelMatrix: this.Cesium.Matrix4.IDENTITY, // this.Cesium.Transforms.eastNorthUpToFixedFrame(this.Cesium.Cartesian3.fromDegrees(0, 0)),
        maximumScreenSpaceError: 20,
        minimumPixelSize: 100,
        maximumNumberOfLoadedTiles: 1,
        preferLeaves: true // 优化 先加载叶子
      }))
      tileset.readyPromise.then((tileset) => {
        console.log(tileset)
        // 开启地形检测
        viewer.scene.globe.depthTestAgainstTerrain = false
        var boundingSphere = tileset.boundingSphere
        viewer.camera.viewBoundingSphere(boundingSphere, new this.Cesium.HeadingPitchRange(0.0, -0.1, boundingSphere.radius * 4))
        this.changeTilesetHeight(0)
      }).otherwise(() => {
        loadingClose()
        this.$message.error('加载失败')
      })

      tileset.tileLoad.addEventListener((tile) => {
        tileContent = tile.content
        entityIdArr = tileContent._batchTable._properties.entityId
        loadingClose()
      })

      tileset.tileFailed.addEventListener((error) => {
        loadingClose()
        this.$message({
          type: 'error',
          message: error.message
        })
      })
    },
    getModel(id) {
      modelApi.getModel(id).then(res => {
        if (res.length === 0) {
          this.$message({
            type: 'warning',
            message: '暂无模型数据'
          })
        } else {
          let url = res[res.length - 1]['url']
          this.modelId = res[res.length - 1]['id']
          console.log(url, '模型 URL')
          this.loadModel(url)
        }
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    // 点击模型高亮显示
    ModelHightlight(pickedEntity) {
      if (this.measureFlag) { return }
      if (pickedEntity !== previousPickedEntity.feature) {
        if (previousPickedEntity.feature) {
          // 将上一次选择的还原
          previousPickedEntity.feature.color = previousPickedEntity.originalColor
        }
        previousPickedEntity.feature = pickedEntity
        previousPickedEntity.originalColor = pickedEntity.color
        // this.Cesium.Color.clone(pickedEntity.color, previousPickedEntity.originalColor)
        // 设置为1 this.Cesium.ColorBlendMode.REPLACE 才会将设置颜色替换材质
        console.log(this.Cesium.ColorBlendMode.MIX)
        pickedEntity.primitive.colorBlendMode = 1
        pickedEntity.color = this.Cesium.Color.SPRINGGREEN
        console.log(pickedEntity)
      }
    },
    // 添加标注
    addMark(position) {
      if (logBillboard && logBillboard._label._text._value === '') {
        this.clearNoneMark()
      }
      logBillboard = viewer.entities.add({
        name: 'markPoint',
        position: viewer.scene.pickPosition(position),
        billboard: {
          image: this.img,
          height: 24,
          width: 24,
          horizontalOrigin: this.Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
          text: '',
          font: '12px',
          fillColor: this.Cesium.Color.WHITE,
          showBackground: true,
          outlineWidth: 0.0,
          pixelOffset: new this.Cesium.Cartesian2(0, -50)
        }
      })
      this.$emit('leftClick', {
        left: position.x,
        top: position.y,
        modelMsg: {
          axias: viewer.scene.pickPosition(position),
          modelId: this.modelId
        }
      })
    },
    // 确定标注
    sendMark(data) {
      this.addViewMark([data])
      this.clearEntites([logBillboard])
      logBillboard = null
    },
    // 查看标注
    viewMark(val) {
      this.treeShow = false
      this.tagListDisable = false
      this.$set(this, 'markListDisable', val)
      if (!val) {
        this.clearEntites(viewMark)
      }
      // if (flag) {
      //   modelApi.getMark({
      //     createById: this.userInfo.userId,
      //     projectId: this.currentPro.projectId,
      //     entityId: this.modelId
      //   }).then(data => {
      //     this.addViewMark(data)
      //   }).catch(error => {
      //     this.$message({
      //       type: 'error',
      //       message: error.msg
      //     })
      //   })
      // } else {
      //   if (viewMark.length !== 0) {
      //     this.clearEntites(viewMark)
      //   }
      // }
    },
    addViewMark(data) {
      for (let item of data) {
        let logBillboard = viewer.entities.add({
          id: `${item.id}&${item.description}`,
          name: `markPoint`,
          position: {
            x: item.x,
            y: item.y,
            z: item.z
          },
          billboard: {
            image: this.img,
            height: 24,
            width: 24,
            horizontalOrigin: this.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: item.name,
            font: '12px',
            fillColor: this.Cesium.Color.WHITE,
            showBackground: true,
            outlineWidth: 0.0,
            pixelOffset: new this.Cesium.Cartesian2(0, -50)
          }
        })
        viewMark.push(logBillboard)
      }
    },
    // // 标注的编辑与删除
    // editMark(type) {
    //   this.editMarkShow = false
    //   if (type === 'edit') {
    //     this.editPanelShow = true
    //   } else {
    //     // 删除标注
    //     this.$confirm('是否删除所选标注?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.deleteMark([this.recordMark.id])
    //     })
    //   }
    // },
    // 编辑标注发送数据
    postData(params) {
      this.editPanelShow = false
      this.$message({
        type: params.type,
        message: params.msg
      })
      if (params.type === 'success') {
        this.$refs.viewMark.queryMark()
        // console.log(tempMark)
        // this.editPanelShow = false
        // tempMark.id._id = `${params.content.id}&${params.content.description}`
        // tempMark.id._label._text._value = params.content.name
        // tempMark = null
      }
    },
    // 取消编辑
    cancelEditMark() {
      // tempMark = null
      this.editPanelShow = false
    },
    // 标注按钮
    mark(val) {
      console.log(val)
      this.$set(this, 'markFlag', val)
      if (!val) {
        this.$emit('leftClick', null)
        this.clearNoneMark()
        this.clearEntites(viewMark)
      }
    },
    // 剖切
    clipping(val) {
      this.$set(this, 'clippingShow', val)
      if (!val && tileset.clippingPlanes) {
        tileset.clippingPlanes.enabled = false
        viewer.entities.removeAll()
      }
    },
    closeClipping(val) {
      this.$set(this, 'clippingShow', val)
      this.$refs.toolBtn.closeClipping()
      tileset.clippingPlanes.enabled = false
      viewer.entities.removeAll()
    },
    changeAxial(val) {
      console.log(val)
      this.clippingModel(val)
    },
    // 模型剖切方法
    clippingModel(axial) {
      let plane
      targetY = 0.0
      viewer.entities.removeAll()
      switch (axial) {
        case 'x': plane = new this.Cesium.Cartesian3(1.0, 0.0, 0.0)
          break
        case '-x': plane = new this.Cesium.Cartesian3(-1.0, 0.0, 0.0)
          break
        case 'y': plane = new this.Cesium.Cartesian3(0.0, 1.0, 0.0)
          break
        case '-y': plane = new this.Cesium.Cartesian3(0.0, -1.0, 0.0)
          break
        case 'z': plane = new this.Cesium.Cartesian3(0.0, 0.0, 1.0)
          break
        case '-z': plane = new this.Cesium.Cartesian3(0.0, 0.0, -1.0)
          break
        default: plane = new this.Cesium.Cartesian3(0.0, 0.0, -1.0)
      }
      clippingPlane = new this.Cesium.ClippingPlaneCollection({
        planes: [new this.Cesium.ClippingPlane(plane, 0.0)],
        enabled: true,
        unionClippingRegions: true,
        modelMatrix: this.Cesium.Matrix4.fromTranslation(new this.Cesium.Cartesian3(0.0, 0.0, 0.0))
      })
      tileset.clippingPlanes = clippingPlane
      console.log(tileset)
      for (let i = 0; i < clippingPlane.length; i++) {
        let plane = clippingPlane.get(i)
        viewer.entities.add({
          position: tileset.boundingSphere.center,
          plane: {
            dimensions: new this.Cesium.Cartesian2(
              tileset.boundingSphere.radius * 2.5,
              tileset.boundingSphere.radius * 2.5
            ),
            outline: false,
            material: this.Cesium.Color.WHITE.withAlpha(0.0),
            plane: new this.Cesium.CallbackProperty(this.createPlaneUpdateFunction(plane), false)
          }
        })
      }
    },
    createPlaneUpdateFunction(plane) {
      return function () {
        plane.distance = targetY
        return plane
      }
    },
    sliderInput(val) {
      targetY = val
    },
    home() {
      this.flyToBounding()
    },
    // 旋转
    flyToBounding(heading, pitch) {
      console.log(new this.Cesium.HeadingPitchRange(heading, pitch, tileset.boundingSphere.radius * 4.0))
      viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {
        duration: 1.5,
        offset: new this.Cesium.HeadingPitchRange(heading, pitch, tileset.boundingSphere.radius * 4.0),
        complete: () => {
          viewer.camera.viewBoundingSphere(tileset.boundingSphere, new this.Cesium.HeadingPitchRange(heading, pitch, tileset.boundingSphere.radius * 4.0))
        }
      })
    },
    // 测量
    measure(val) {
      this.$set(this, 'measureFlag', val)
      this.clearEntites(tempLines)
      positions.splice(0)
    },
    // 测量距离
    measurePolyLine(clickEvent) {
      let labelEntity = null // 标签实体
      let cartesian = viewer.scene.pickPosition(clickEvent.position) // 坐标
      if (positions.length === 2) {
        viewer.screenSpaceEventHandler.removeInputAction(this.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        this.addPoint(cartesian)
        let tempPoints = JSON.parse(JSON.stringify(positions))
        this.addLine(tempPoints)
        positions.splice(0)
        return
      }
      positions.push(cartesian.clone())
      this.addPoint(cartesian)
      viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
        let movePosition = viewer.scene.pickPosition(moveEvent.endPosition)
        if (!movePosition) { return }
        if (positions.length === 2) {
          positions.pop()
          positions.push(movePosition)
          if (labelEntity) {
            viewer.entities.remove(labelEntity)
            tempLines.splice(tempLines.indexOf(labelEntity), 1)
          }
          let lengthText = `距离: ${this.getLengthText(positions[0], positions[1])}`
          let centerPoint = this.Cesium.Cartesian3.midpoint(positions[0], positions[1], new this.Cesium.Cartesian3())
          labelEntity = this.addLabel(centerPoint, lengthText)
          tempLines.push(labelEntity)
        } else if (positions.length < 2) {
          positions.push(movePosition)
          this.addLine(positions)
        }
      }, this.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    // 添加点
    addPoint(val) {
      tempLines.push(viewer.entities.add(new this.Cesium.Entity({
        position: val,
        point: {
          color: this.Cesium.Color.RED,
          pixelSize: 10,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })))
    },
    // 添加线
    addLine(val) {
      let dynamicPositions = new this.Cesium.CallbackProperty(() => {
        return val
      }, false)
      tempLines.push(viewer.entities.add({
        polyline: {
          positions: dynamicPositions,
          width: 2,
          material: this.Cesium.Color.BLUE
        }
      }))
    },
    // 添加标签
    addLabel(centerPoint, text) {
      return viewer.entities.add({
        position: centerPoint,
        label: {
          text: text,
          font: '24px sans-serif',
          scale: 0.5,
          fillColor: this.Cesium.Color.FLORALWHITE,
          pixelOffset: new this.Cesium.Cartesian2(0, -25),
          showBackground: true,
          verticalOrigin: this.Cesium.VerticalOrigin.TOP,
          heightReference: this.Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          backgroundColor: new this.Cesium.Color(0.165, 0.165, 0.165, 0.8),
          backgroundPadding: new this.Cesium.Cartesian2(6, 6)
        }
      })
    },
    // 计算两点之间的距离
    getLengthText(firstPoint, secondPoint) {
      let length = this.Cesium.Cartesian3.distance(firstPoint, secondPoint)
      if (length >= 1000) {
        length = (length / 1000).toFixed(2) + '公里'
      } else {
        length = length.toFixed(2) + '米'
      }
      return length
    },
    // 视图反向
    handleViewDir(val) {
      if (val === '1' || val === '-1') {
        this.flyToBounding(0, parseInt(val))
        return
      }
      this.flyToBounding(parseInt(val), 0.0)
    },
    // 构件详情
    details(val) {
      this.$set(this, 'detailsShow', val)
      if (!val) {
        this.setDetailsData('', '')
      }
    },
    // 设置构件详情的值
    setDetailsData(id, name) {
      this.baseData = Object.assign({}, this.baseData, {
        '基本属性': {
          '构件ID': id,
          '构件名称': name
        }
      })
    },
    // 清除entities
    clearEntites(arr) {
      if (arr.length === 0) return
      let primitives = viewer.entities
      for (let i = 0; i < arr.length; i++) {
        primitives.remove(arr[i])
      }
      arr.splice(0)
    },
    // 清除 取消标注的点
    clearNoneMark() {
      let primitives = viewer.entities
      primitives.remove(logBillboard)
      logBillboard = null
    },
    // 改变tileset高度
    changeTilesetHeight(height) {
      height = Number(height)
      if (isNaN(height)) {
        return
      }
      let cartographic = this.Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
      let surface = this.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
      let offset = this.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)
      let translation = this.Cesium.Cartesian3.subtract(offset, surface, new this.Cesium.Cartesian3())
      tileset.modelMatrix = this.Cesium.Matrix4.fromTranslation(translation)
    },
    // 模型姿态调整
    modelAdjust() {
      let params = {
        tx: 0, // 模型中心X轴坐标（经度，单位：十进制度）
        ty: 0, // 模型中心Y轴坐标（纬度，单位：十进制度）
        tz: 0, // 模型中心Z轴坐标（高程，单位：米）
        rx: 0, // X轴（经度）方向旋转角度（单位：度）
        ry: 0, // Y轴（纬度）方向旋转角度（单位：度）
        rz: 0 // Z轴（高程）方向旋转角度（单位：度）
      }
      // 旋转
      let mx = this.Cesium.Matrix3.fromRotationX(this.Cesium.Math.toRadians(params.rx))
      let my = this.Cesium.Matrix3.fromRotationY(this.Cesium.Math.toRadians(params.ry))
      let mz = this.Cesium.Matrix3.fromRotationZ(this.Cesium.Math.toRadians(params.rz))
      let rotationX = this.Cesium.Matrix4.fromRotationTranslation(mx)
      let rotationY = this.Cesium.Matrix4.fromRotationTranslation(my)
      let rotationZ = this.Cesium.Matrix4.fromRotationTranslation(mz)
      // 平移
      let position = this.Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz)
      let m = this.Cesium.Transforms.eastNorthUpToFixedFrame(position)
      // 旋转、平移矩阵相乘
      this.Cesium.Matrix4.multiply(m, rotationX, m)
      this.Cesium.Matrix4.multiply(m, rotationY, m)
      this.Cesium.Matrix4.multiply(m, rotationZ, m)
      // 赋值给tileset
      tileset._root.transform = m
    },
    // 标注取消
    // cancelAdd() {
    //   this.$refs.toolBtn.markCancel()
    // },
    // 查看视点
    viewTag(val) {
      this.treeShow = false
      this.markListDisable = false
      this.$set(this, 'tagListDisable', val)
    },
    // 查看模型关联文档
    handleViewDoc(val) {
      console.log('查看模型关联文档')
      if (!val) {
        this.$set(this, 'linkDocFlag', false)
      } else {
        if (!this.markEntity) {
          this.$message({
            type: 'warning',
            message: '请选择模型图元'
          })
        } else {
          this.$set(this, 'treeShow', false)
          this.$set(this, 'markListDisable', false)
          this.$set(this, 'tagListDisable', false)
          this.$set(this, 'linkDocFlag', true)
        }
      }
    },
    // 视点标记
    hanlderViewTag(val) {
      this.$set(this, 'addTagFlag', val)
      if (!val) {
        this.$set(this, 'tagDisable', false)
      }
    },
    // 添加视点
    addViewTag() {
      this.$set(this, 'tagDisable', true)
    },
    editTag(parmas) {
      this.$set(this, 'tagDisable', parmas.flag)
      if (parmas.type === 'edit') {
        this.$refs.viewTag.queryTag()
      }
    },
    // 查看目录树
    viewMenu(flag) {
      this.tagListDisable = false
      this.treeShow = flag
    },
    // 视点表格点击事件
    tagRowClick(row) {
      this.$set(this, 'tagMsg', row)
      this.locationTag(row)
    },
    // 编辑视点
    handleEditTag(row) {
      this.$set(this, 'tagMsg', row)
      this.$set(this, 'tagDisable', true)
      // this.locationTag(row)
    },
    // 视点定位
    locationTag(row) {
      console.log(row)
      viewer.camera.setView({
        destination: new this.Cesium.Cartesian3(row.x, row.y, row.z),
        orientation: {
          heading: row.heading,
          pitch: row.pitch,
          roll: row.roll
        }
      })
    },
    // 编辑标注
    handleEditMark(row) {
      this.$set(this, 'recordMark', row)
      this.editPanelShow = true
    },
    // 显示或隐藏标注
    handleActive(parmas) {
      if (parmas.flag) {
        this.addViewMark(parmas.data)
      } else { // 隐藏标注
        this.clearEntites(viewMark)
      }
    },
    // 目录树点击操作
    nodeClick(data) {
      this.$set(this, 'treeId', data.id)
      // this.getTreeNodeView(data.id)
      let batchId = this.queryBatchId(data.id)
      console.log(batchId)
      if (this.detailsShow) {
        this.setDetailsData(batchId, data.name)
      }
      const select = tileContent.getFeature(63)
      console.log(select)
      // viewer.flyTo(select.primitive, {
      //   duration: 1
      // })
      // viewer.camera.viewBoundingSphere(select.primitive.boundingSphere, new this.Cesium.HeadingPitchRange(0.0, -0.1, select.primitive.boundingSphere.radius * 4.0))
      this.ModelHightlight(select)
    },
    // 查询当前模型树点击节点所在的batchId
    queryBatchId(id) {
      let batchId = entityIdArr.indexOf(id)
      return batchId
    },
    // 开启文档关联操作按钮
    linkFolder(flag) {
      this.$set(this, 'linkFolderFlag', flag)
    },
    // 确定文档关联
    sureLink(parmas) {
      if (!this.markEntity) {
        this.$message({
          type: 'warning',
          message: '请选择需要关联的模型位置'
        })
        return
      }
      modelApi.modelLinkDoc({
        attachmentId: parmas,
        entityId: this.markEntity
      }).then(res => {
        this.$message({
          type: 'success',
          message: '关联成功'
        })
        // this.markEntity = ''
        // this.linkFolderFlag = false
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    // 取消关联
    cancelLink() {
      this.linkFolderFlag = false
      this.$refs.toolBtn.cancelDocLink()
    },
    // 获取模型图元的属性
    getModelProperty(id) {
      modelApi.modelProperty(id).then(res => {
        this.$set(this, 'detailsData', res)
        console.log(res)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    // 构件树关联模型位置
    treeLinkModel() {
      if (this.markEntity && this.treeId) {
        const camera = viewer.camera
        this.treeLinkModelPost({
          entityId: this.markEntity,
          treeId: this.treeId,
          x: camera._positionWC.x,
          y: camera._positionWC.y,
          z: camera._positionWC.z,
          heading: camera.heading,
          pitch: camera.pitch,
          roll: camera.roll
        })
      } else {
        this.$message({
          type: 'waring',
          message: '请选择构件树节点和模型的位置'
        })
      }
    },
    // 构件树关联模型位置数据发送
    treeLinkModelPost(parmas) {
      modelApi.treeLinkModel(parmas).then(data => {
        this.$message({
          type: 'success',
          message: '关联成功'
        })
        this.$set(this, 'treeId', '')
        this.$set(this, 'markEntity', '')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    // 获取构件树节点对应视角的位置
    getTreeNodeView(id) {
      modelApi.getTreeModelPosition(id).then(data => {
        if (JSON.stringify(data) !== '{}') {
          let batchId = this.queryBatchId(data.entityId)
          const select = tileContent.getFeature(batchId)
          this.ModelHightlight(select)
          this.locationTag(data)
          // 获取模型图元的属性
          this.setDetailsData(select.getProperty('entityId'), select.getProperty('name'))
          this.getModelProperty(data.entityId)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 通过entityId查询到相关的p_entityId
    getPEntityId(id) {
      modelApi.getPEntityIdByEntity(id).then(data => {
        console.log(data)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    // 通过entityId查询到pid文件
    getPidByEntity(id) {
      modelApi.getPidByEntity(id).then(data => {
        console.log(data)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    // 关联entity和pid
    entityLinkPid(parmas) {
      modelApi.entityLinkPid(parmas).then(data => {
        console.log(data)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    linkPid() {},
    async roaming(val) {
      console.log(val, '漫游控制')
      const position = tileset.boundingSphere.center
      const model = await initRoamingModel(viewer, {
        position,
        url: '/static/mock/man/man.glb'
      })
      console.log(model)
      model.readyPromise.then((model) => {
        freeRoaming(viewer, model)
        firstPersonCamera(viewer, model)
        // thirdPersonCamera(viewer, model)

      })
    }
  }
}
</script>

<style lang='less' scoped>
.model-box{
  position: relative;
}
#cesium-model{
  cursor: pointer;
  height: 100%;
  width: 100%;
}
.menu-btn{
  position: fixed;
  left: 20px;
  top: 80px;
  .el-icon-menu{
    font-size: 30px;
    color: #303133;
  }
}
.link-btn{
  position: absolute;
  bottom: 40px;
  right: 200px;
}
.link-pid{
  position: absolute;
  bottom: 40px;
  right: 100px;
}
</style>
