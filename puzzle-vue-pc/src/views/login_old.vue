<template>
  <div class="login">
   <img class="backimage" src="../img/my2.png"/>  <!--背景-->

    <div class="puzzle-title"><h2>Puzzle</h2></div>

    <div class="el-textarea el-input--default idinput">
            <textarea class="el-textarea__inner" rows="1" autocomplete="off" placeholder="在 Puzzle 上玩耍, 请先输入昵称"
                      style="min-height: 40px" v-model="username"
                      @keyup.enter.native="login_old($event)"></textarea>

      <div class="tile-icon-in" @click="login_old($event)">
        <img src="../img/in.png" :style="{width: '24px', height: '24px'}">
      </div>

      <div class="tile-icon-out" @click="close">
        <img src="../img/cha.png" :style="{width: '24px', height: '24px'}">
      </div>
    </div>

  </div>
</template>

<script>
import Store from '@/store/store';

export default {
  name: 'login',
  data() {
    return {
      username: ''
    }
  },
  methods: {
    close() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
        undefined
        window.location.href = "about:blank"
      } else {
        undefined
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
      }
    },
    login(event) {     //与后端java交互，把ruleForm传给后端，通过后端返回的值 跳转到Puzzle界面。done
      this.username.replace(/[\r\n]/g, "");
      const ruleForm = {
        username: this.username.replace(/[\r\n]/g, "")
      }
      const _this = this
      this.$axios.post('http://106.12.119.247:8081/user/login', ruleForm).then(res => {   //TODO 注意修改为自己的
            //console.log(res.data)
            //Store.id = res.data.data.id
            Store.username = ruleForm.username;
            Store.status = res.data.data;
            Store.first = res.data.data;

            const url = "http://106.12.119.247:8081/puzzle/level/" + Store.status      //TODO 注意修改为自己的
            this.$axios.get(url).then(res => {
                  //console.log(res.data)
                  Store.N = res.data.data.n
                  Store.Type = res.data.data.type
                  Store.src = res.data.data.imgSrc
                  Store.answer = res.data.data.answer
                  Store.puzzle_group = res.data.data.puzzleG
                  //这里如果是第一次登录的话 就跳转到规则页面
                  return this.$router.push('/rule')
                }
            )
          }
      )

    }
  }
}
</script>

<style>
.puzzle-title {
  font-size: 60px;
  text-align: center;
  color: white;
  position: absolute;
  top: 20%;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  -moz-user-select: none; /*图片不可被选中*/
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

textarea.el-textarea__inner {
  border-radius: 50px; /*输入框圆角值*/
  line-height: 2;
}

div.el-textarea {
  position: absolute;
  top: calc(10% + 230px);
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 550px;
}

.tile-icon-in {
  align-items: center;
  background-color: #f1f3f4;
  border-radius: 50%;
  display: flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: center;
  margin-top: 8%;
  width: 48px;
  margin-left: 35%;
}

.tile-icon-out {
  align-items: center;
  background-color: #f1f3f4;
  border-radius: 50%;
  display: flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: center;
  margin-top: -48px;
  width: 48px;
  margin-left: 55%;
}

</style>