<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  created() {
    setTimeout(() => {
      //看板娘  这里会产生跨域问题 但是script里面的src允许跨域加载问题，但是app.vue里面就得修改了
      window.L2Dwidget.init({
        pluginRootPath: 'http://106.12.119.247/live2dw/',
        //pluginRootPath: './live2dw/',
        pluginJsPath: 'lib/',
        pluginModelPath: 'live2d-widget-model-tororo/assets/', //中间这个haru_2就是你的老婆,想换个老婆,换这个就可以了
        tagMode: false,
        debug: false,
        model: {jsonPath: 'http://106.12.119.247/live2dw/live2d-widget-model-tororo/assets/tororo.model.json'},
        //model: {jsonPath: './live2dw/live2d-widget-model-tororo/assets/tororo.model.json'},
        display: {position: 'left', width: 350, height: 500, vOffset: -250},  //调整大小,和位置
        mobile: {show: true},   //要不要盯着你的鼠标看
        log: false,
      })
    }, 1000)
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
  components: {}
}
</script>