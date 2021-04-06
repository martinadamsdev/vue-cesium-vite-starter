<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { removeToken } from '@/utils/auth'
export default {
  name: 'App',
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    $route(to, from) {
      if (to.meta.index < from.meta.index) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
    }
  },
  created() {
    this.updateCache()
  },
  mounted() {
    window.addEventListener('onbeforeunload ', () => {
      removeToken()
      localStorage.removeItem('userInfo')
      this.clearCache()
    })
  },
  methods: {
    ...mapMutations('userInfo', [
      'updateCache',
      'clearCache'
    ])
  }
}
</script>
<style lang="less" scoped>
#app{
  width: 100%;
  height: 100%;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  backface-visibility: hidden;
  transition: all 500ms ease-in;
}
.slide-right-enter {
  opacity: 1;
  // transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  // transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 1;
  // transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  // transform: translate3d(-100%, 0, 0);
}
</style>
