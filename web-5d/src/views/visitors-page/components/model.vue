/**
@Author: wuhaimin * @Date: 2020-10-12 15:14:26 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-12 15:14:26 * @Description: 模型
*/

<template>
  <div class="model-box">
    <div id='cesium-model'></div>
    <ToolBtn @mark="mark" @clipping="clipping" ref="toolBtn" @home="home" @measure="measure" @handleViewDir="handleViewDir" @details="details"/>
    <ClippingPanel v-if="clippingShow" @closeClipping="closeClipping" ref="clipping" @changeAxial="changeAxial" @sliderInput="sliderInput"/>
    <ArtifactsDetails v-show="detailsShow" @closeDetails="closeDetails" :data="detailsData"/>
    <ArtifactsTree @closeTree="closeTree" v-show="treeShow"/>
    <div class="menu-btn" v-show="menuShow" title="打开构件目录树">
      <el-button type="text"><i class="el-icon-menu" @click="handleMenuTree"></i> </el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { loading, loadingClose } from '@/utils/index'
// 将这些定义在外面是因为在data里面， 当你修改某一个值的时候，操作会特别卡顿
var viewer = {}
var tileset = null
var previousPickedEntity = {
  feature: undefined,
  originalColor: undefined
}
var logBillboard = null
var clippingPlane
var targetY = 0.0
var positions = []
var tempLines = []
var tempBillboard = []
export default {
  name: 'Model',
  data() {
    return {
      matrixPonit: {},
      img: require('@/common/image/mark.png'),
      markFlag: false,
      clippingShow: false,
      measureFlag: false,
      detailsShow: true,
      treeShow: true,
      menuShow: false,
      detailsData: {
        '构件ID：': '',
        '构件名称：': ''
      }
    }
  },
  computed: {
    ...mapState('userInfo', {
      currentPro: state => state.currentPro
    })
  },
  components: {
    ToolBtn: () => import('@/views/model/components/tool-btn'),
    ClippingPanel: () => import('@/views/model/components/clipping-panel'),
    ArtifactsDetails: () => import('@/views/model/components/artifacts-details'),
    ArtifactsTree: () => import('@/views/model/components/artifacts-tree')
  },
  mounted() {
    this.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NmE3NDNkZi00NzdiLTQ4NzItOGI1YS1hODhjNDc2MmEyNDgiLCJpZCI6MzQ1MDcsImlhdCI6MTYwMDM5NDYwOX0.h_LVf8AnLALUx2ft6OjLoxdV4Ag0au9x51nUsyrEu9Y'
    viewer = new this.Cesium.Viewer('cesium-model', {
      maximumRenderTimeChange: Infinity,
      sceneModePicker: false,
      baseLayerPicker: false,
      animation: false, //     是否显示左下角仪表
      geocoder: false, // 右上角查询按钮
      timeline: false, // 时间轴
      infoBox: false,
      vrButton: false,
      selectionIndicator: false,
      homeButton: false,
      navigationHelpButton: false,
      navigationHelpButtonViewModel: true,
      fullscreenButton: false
    })
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
    viewer.scene.globe.show = false
    viewer.scene.backgroundColor = this.Cesium.Color.ALICEBLUE.withAlpha(0.6)
    viewer.scene.skyAtmosphere.show = false
    this.loadModel(this.currentPro.projectId)
    // 点击高亮显示
    viewer.screenSpaceEventHandler.setInputAction((movement) => {
      const pickedEntity = viewer.scene.pick(movement.position)
      if (pickedEntity && pickedEntity instanceof this.Cesium.Cesium3DTileFeature) {
        console.log(22)
        if (this.detailsShow) {
          this.setDetailsData(pickedEntity._batchId, pickedEntity._content._batchTable._properties.name[pickedEntity._batchId])
        }
        if (this.markFlag) {
          // 添加标注
          this.addMark(movement.position)
        } else if (this.measureFlag) {
          // 测量距离
          this.measurePolyLine(movement)
        } else {
          // 模型高亮
          this.ModelHightlight(pickedEntity)
        }
      } else if (!pickedEntity || pickedEntity.id._name !== 'billboard') {
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
    loadModel(id) {
      console.log(id)
      if (tileset) {
        let primitives = viewer.entities
        primitives.remove(tileset)
        tileset = null
      }
      tileset = viewer.scene.primitives.add(new this.Cesium.Cesium3DTileset({
        url: '/car/t/tileset.json',
        modelMatrix: this.Cesium.Matrix4.IDENTITY,
        preferLeaves: true // 优化 先加载叶子
      }))
      tileset.readyPromise.then((tileset) => {
        // 开启地形检测
        // viewer.scene.primitives.add(tileset)
        // this.changeTilesetHeight(10)
        this.modelAdjust()
        viewer.scene.globe.depthTestAgainstTerrain = false
        var boundingSphere = tileset.boundingSphere
        viewer.camera.viewBoundingSphere(boundingSphere, new this.Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius * 4.0))
        this.matrixPonit = this.Cesium.Matrix4.clone(tileset.modelMatrix)
      }).otherwise((error) => {
        this.$message.error(error)
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
        this.Cesium.Color.clone(pickedEntity.color, previousPickedEntity.originalColor)
        // 设置为1 Cesium.ColorBlendMode.REPLACE 才会将设置颜色替换材质
        console.log(this.Cesium.ColorBlendMode.MIX)
        pickedEntity.primitive.colorBlendMode = 1
        pickedEntity.color = this.Cesium.Color.SPRINGGREEN
      }
    },
    // 旋转
    rotating(type, angle) {
      let m1 = {}
      switch (type) {
        case 'x': m1 = this.Cesium.Matrix3.fromRotationX(this.Cesium.Math.toRadians(angle))
          break
        case 'y': m1 = this.Cesium.Matrix3.fromRotationY(this.Cesium.Math.toRadians(angle))
          break
        case 'z': m1 = this.Cesium.Matrix3.fromRotationZ(this.Cesium.Math.toRadians(angle))
          break
      }
      this.trasnlate(m1, this.matrixPonit)
    },
    trasnlate(transformin, m) {
      const transformMat = this.Cesium.Matrix4.fromArray(m)
      const matRotation = this.Cesium.Matrix4.getMatrix3(transformMat, new this.Cesium.Matrix3())
      const inverseMatRotation = this.Cesium.Matrix3.inverse(matRotation, new this.Cesium.Matrix3())
      const matTranslation = this.Cesium.Matrix4.getTranslation(transformMat, new this.Cesium.Cartesian3())
      const transformation = this.Cesium.Transforms.eastNorthUpToFixedFrame(tileset.boundingSphere.center)
      const transformRotation = this.Cesium.Matrix4.getMatrix3(transformation, new this.Cesium.Matrix3())
      const transformTranslation = this.Cesium.Matrix4.getTranslation(transformation, new this.Cesium.Cartesian3())
      let matToTranslation = this.Cesium.Cartesian3.subtract(matTranslation, transformTranslation, new this.Cesium.Cartesian3())
      matToTranslation = this.Cesium.Matrix4.fromTranslation(matToTranslation, new this.Cesium.Matrix4())
      let matToTransformation = this.Cesium.Matrix3.multiply(inverseMatRotation, transformRotation, new this.Cesium.Matrix3())
      matToTransformation = this.Cesium.Matrix3.inverse(matToTransformation, new this.Cesium.Matrix3())
      matToTransformation = this.Cesium.Matrix4.fromRotationTranslation(matToTransformation)
      const rotationTranslation = this.Cesium.Matrix4.fromRotationTranslation(transformin)
      this.Cesium.Matrix4.multiply(transformation, rotationTranslation, transformation)
      this.Cesium.Matrix4.multiply(transformation, matToTransformation, transformation)
      this.Cesium.Matrix4.multiply(transformation, matToTranslation, transformation)
      tileset.modelMatrix = transformation
    },
    // 添加标注
    addMark(position) {
      console.log(logBillboard)
      if (logBillboard && logBillboard._label._text._value === '') {
        this.clearNoneMark()
      }
      logBillboard = viewer.entities.add({
        name: 'billboard',
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
        top: position.y
      })
    },
    // 确定备注
    sendMark(val) {
      console.log(logBillboard)
      logBillboard._label._text._value = val
      tempBillboard.push(logBillboard)
    },
    // 标注按钮
    mark(val) {
      this.$set(this, 'markFlag', val)
      if (!val) {
        this.clearEntites(tempBillboard)
        tempBillboard.splice(0)
        this.clearNoneMark()
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
      console.log(pitch)
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
      console.log(positions.length)
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
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelSize: 10
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
      this.flyToBounding(parseInt(val), -0.5)
    },
    // 构件详情
    details(val) {
      this.$set(this, 'detailsShow', val)
      if (!val) {
        this.setDetailsData('', '')
      }
    },
    // 关闭构件详情面板
    closeDetails() {
      this.setDetailsData('', '')
      console.log(this.detailsData)
      this.$refs.toolBtn.details()
    },
    // 关闭构件目录
    closeTree() {
      this.handleMenu(false)
    },
    // 关闭构件目录按钮
    handleMenuTree() {
      this.handleMenu(true)
    },
    // 设置目录树的显隐
    handleMenu(flag) {
      this.$set(this, 'treeShow', flag)
      this.$set(this, 'menuShow', !flag)
    },
    // 设置构件详情的值
    setDetailsData(id, name) {
      this.detailsData = Object.assign({}, this.detailsData, {
        '构件ID：': id,
        '构件名称：': name
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
    }
  }
}
</script>
<style lang='less' scoped>
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
</style>
