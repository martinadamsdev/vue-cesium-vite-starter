<template>
  <v-viewer />
</template>

<script>
import VViewer from "./components/VViewer.vue";
export default {
  components: {
    VViewer,
  },
};
</script>

<style>
@import url("/node_modules/cesium/Build/Cesium/Widgets/widgets.css");
@import url("./style/style.scss");
</style>
