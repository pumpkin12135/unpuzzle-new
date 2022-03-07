<template>
  <div class="container">
    <!--背景图片 暂时没找到很好的-->
    <div class="puzzle-rule"><h2>游戏规则</h2></div>
    <div class="box">
      <div class="img">
        <div class="content-box">
          <img src="../img/rule1.png"/>
          <h2>全员连通</h2>
          <div class="size">
            <h3>所有拼图连成一片</h3>
          </div>
          <div class="color">
            <h3>规则一：</h3>
            <span :style="{'background-color': rule1}"></span>
            <span :style="{'background-color': rule2}"></span>
            <span :style="{'background-color': rule3}"></span>
          </div>
          <a @click="light1">Got it !</a>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="img">
        <div class="content-box">
          <img src="../img/rule2.png"/>
          <h2>同类相斥</h2>
          <div class="size">
            <h3>同种拼图没有相互接触</h3>
          </div>
          <div class="color">
            <h3>规则二：</h3>
            <span :style="{'background-color': rule1}"></span>
            <span :style="{'background-color': rule2}"></span>
            <span :style="{'background-color': rule3}"></span>
          </div>
          <a @click="light2">Got it !</a>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="img">
        <div class="content-box">
          <img src="../img/rule3.png"/>
          <h2>镂空覆盖</h2>
          <div class="size">
            <h3>没有2*2的格子被拼图盖住</h3>
          </div>
          <div class="color">
            <h3>规则三：</h3>
            <span :style="{'background-color': rule1}"></span>
            <span :style="{'background-color': rule2}"></span>
            <span :style="{'background-color': rule3}"></span>
          </div>
          <a  @click="light3">Got it !</a>
        </div>
      </div>
    </div>
    <a @click="play" style="margin-top: 10px">puzzle !</a>
  </div>
</template>

<script>
import Store from '@/store/store';

export default {
  name: 'rule',
  data() {
    return {
      rule1: '#fff',
      rule2: '#fff',
      rule3: '#fff'
    }
  },
  mounted() {
    if(Store.status != 1){   //如果不是第一次登录则 则填充颜色
      this.rule1 = '#9bdc28';
      this.rule2 = '#03a9f4';
      this.rule3 = '#e91e63';
    }
  },
  methods: {
    light1(){
      this.rule1 = '#9bdc28';
    },
    light2(){
      this.rule2 = '#03a9f4';
    },
    light3(){
      this.rule3 = '#e91e63';
    },
    open6(){
      this.$notify.error({
        title: '失败',
        message: '请先确定所有游戏规则',
        duration: 3000
      });
    },
    play(){   //如果是第一次登录 且没有确定游戏规则 则拦截
      if(this.rule1 == '#fff' || this.rule2 == '#fff' || this.rule3 == '#fff'){
        this.open6()
        return
      }
      this.$router.push('/puzzle')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #efeeee;
}

.container {
  width: 1000px;
  height: 99%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
}

.puzzle-rule{
  width: 100%;
  text-align: center;
  margin-bottom:20px;
}

.container .box {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  align-content: center;
  width: 270px;
  height: 450px;
  margin: 20px;
}

.container .box .img {
  width: 270px;
  height: 450px;
  box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
  -18px -18px 30px rgba(255, 255, 255, 1);
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #efeeee;
  transition: box-shadow .2s ease-out;
  position: relative;
}

.container .box .img img {
  width: 200px;
  transition: width 0.2s ease-out;
  -moz-user-select: none; /*图片不可被选中*/
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.container .box .img:hover {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px rgba(255, 255, 255, 0.8),
  inset 18px 18px 30px rgba(0, 0, 0, 0.1),
  inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow .2s ease-out;
}

.container .box .img:hover img {
  width: 180px;
  transition: width 0.2s ease-out;
}


.container .box .content-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 380px;
  text-align: center;
  transition: 1s;
  z-index: 0;
  overflow: hidden;
}

.container .box:hover .content-box {
  height: 400px;
}

.container .box .content-box h2 {
  position: relative;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 20px 8px 8px 8px;
  color: slategrey;
}

.container .box .content-box .size{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  transition: 0.5s;
  opacity: 0;
  visibility: hidden;
}

.container .box:hover .content-box .size {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.15s;
}

.container .box .content-box .color{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  transition: 0.5s;
  opacity: 1;
  visibility: visible;
}

.container .box .content-box .size h3,
.container .box .content-box .color h3 {
  color: slategrey;
  font-weight: 300;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.container .box .content-box .color span {
  width: 20px;
  height: 20px;
  background: #ff0;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

/*最下面的got it按钮 */
.container .box .content-box a,
.container a{
  display: inline-block;
  padding: 10px 20px;
  background: #efeeee;
  margin-top: 10px;
  text-decoration: none;
  font-weight: 600;
  color: #111;
  opacity: 0;
  transform: translateY(50px);
  transition: 0.5s;
  box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
  -18px -18px 30px rgba(255, 255, 255, 1);
  border-radius: 50px;
}

.container .box:hover .content-box a,
.container a{
  opacity: 1;
  transform: translateY(0px);
  transition-delay: 0.15s;
}

.container .box .content-box a:hover,
.container a:hover{
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px rgba(255, 255, 255, 0.8),
  inset 18px 18px 30px rgba(0, 0, 0, 0.1),
  inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow .1s ease-out;
}



</style>