<template>
  <el-card class="box-card">
    <el-tree
      ref='tree'
      node-key="id"
      lazy
      :load="loadNode"
      :props="defaultProps"
      :check-strictly="true"
      @check-change="handleCheckChange"
      @node-click="handleNodeClick"
    >
    </el-tree>
  </el-card>
</template>
<script>
import treeModel from '@/api/artifacts-tree'
export default {
  name: 'ArtifactsTree',
  data() {
    return {
      projectId: '',
      parentId: '',
      treeNode: {},
      treeResolve: {},
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name',
        isLeaf: 'childrenCout'
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  created() {
    this.$set(this, 'projectId', this.$store.state.userInfo.currentPro.projectId)
    this.$set(this, 'parentId', this.$store.state.userInfo.currentPro.projectId)
    if (this.$refs.tree) {
      this.loadNode(this.treeNode, this.treeResolve)
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.key) {
        this.$set(this, 'parentId', node.key)
      } else {
        this.$set(this, 'treeNode', node)
        this.$set(this, 'treeResolve', resolve)
      }
      this.getTree(resolve)
    },
    getTree(callback) {
      treeModel.getChildTreeNode({
        parentId: this.parentId,
        projectId: this.projectId
      }).then((result) => {
        this.setChildrenCout(callback, result)
      }).catch((err) => {
        console.log(err)
      })
    },
    setChildrenCout(callback, list) {
      for (var i = 0; i < list.length; i++) {
        list[i]['childrenCout'] = list[i]['childrenCout'] === 0
      }
      callback(list)
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      // if (data.type === 2) {
      //   this.$emit('nodeClick', {
      //     id: data.id,
      //     name: data.name
      //   })
      // }
      this.$emit('nodeClick', {
        id: data.id,
        name: data.name
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box-card{
  position: fixed;
  width: 230px;
  left: 70px;
  top: 100px;
  background: rgba(44,76,124,0.2);
  border: 1px solid #249696;
  border-radius: 0;
}
/deep/.el-card__body{
  min-height: 550px;
  max-height: 550px;
  overflow: auto;
  padding: 0;
}
/deep/.el-tree{
  margin-top: 10px;
  height: 100%;
  color: #fff;
  background: none;
}
/deep/.el-tree-node__content:hover{
  background: radial-gradient(circle,hsla(180,83%,67%,0.1),hsla(180,83%,67%,0.3));
}
/deep/.el-tree-node:focus>.el-tree-node__content{
  background: radial-gradient(circle,hsla(180,83%,67%,0.1),hsla(180,83%,67%,0.3));
}
.title{
  font-size: 16px;
}
/deep/.el-tree-node>.el-tree-node__children{
  overflow: unset;
}
.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
  box-shadow: 2px 2px 15px rgba(44,76,124,1);
}
</style>
