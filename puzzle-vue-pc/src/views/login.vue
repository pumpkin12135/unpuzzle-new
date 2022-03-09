<template>
  <div class="login_new">
    <div class="box">
      <div class="content-box">
        <img src="../img/rule4.png"/>
        <h2>Puzzle</h2>
      </div>
      <div class="input-box">
        <input type="text" placeholder="请 先 输 入 昵 称" @keyup.enter.native="login()" v-model="username"/>
        <a>
          <a1 @click="login">Login !</a1>
          <a2 @click="close">X</a2>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Store from "@/store/store";

export default {
  name: "temp",
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
    login() {     //与后端java交互，把ruleForm传给后端，通过后端返回的值 跳转到Puzzle界面。done
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

<style scoped>
.login_new {
  width: 1000px;
  height: 99%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
}

.login_new .box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  align-content: center;
  width: 750px;
  height: 450px;
  margin: 20px;
  box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
  -18px -18px 30px rgba(255, 255, 255, 1);
  border-radius: 50px;
  background-color: #efeeee;
  transition: box-shadow .2s ease-out;
  position: relative;
}

.login_new .content-box {
  position: absolute;
  width: 100%;
  text-align: center;
  transition: 1s;
  z-index: 0;
  overflow: hidden;
}

.login_new .box:hover {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px rgba(255, 255, 255, 0.8),
  inset 18px 18px 30px rgba(0, 0, 0, 0.1),
  inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow .2s ease-out;
}

.login_new .box img {
  width: 200px;
  transition: width 0.2s ease-out;
  -moz-user-select: none; /*图片不可被选中*/
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.login_new .box:hover img {
  width: 198px;
  transform: translateX(-180px) translateY(30px);
  transition: 1s;
}

.login_new .box:hover h2 {
  transform: translateX(130px) translateY(-190px);
  transition: 1s;
}

.login_new .box h2 {
  position: relative;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 20px 8px 8px 8px;
  color: slategrey;
}

.login_new .box .input-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
}

/*输入框*/
.login_new .box input {
  display: inline-block;
  position: relative;
  width: 35%;
  height: 40px;
  box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
  border-radius: 50px;
  border: none;
  outline: medium;
  background-color: #efeeee;
  text-align: center;
}

.login_new .box:hover input {
  opacity: 1;
  transform: translateX(130px) translateY(40px);
  transition-delay: 0.15s;
}

.login_new .box input:hover {
  box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  transition: box-shadow .2s ease-out;
}

/*最下面的login按钮 */
.login_new .box .input-box a {
  display: flex;
  justify-content: center; /*水平主轴居中*/
  align-items: center; /*垂直交叉轴居中*/
  width: 400px;
  margin-top: 40px;
  transform: translateX(180px) translateY(40px);
}

.login_new .box .input-box a1 {
  display: inline-block;
  padding: 10px 20px;
  background: #43CF7C;
  margin-right: 30px;
  text-decoration: none;
  font-weight: 600;
  color: white;
  opacity: 0;
  visibility: hidden;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1),
  -10px -10px 20px rgba(255, 255, 255, 1);
  border-radius: 50px;
}

.login_new .box .input-box a2 {
  display: inline-block;
  padding: 10px 15px;
  background: #D43030;
  text-decoration: none;
  font-weight: 600;
  color: white;
  opacity: 0;
  visibility: hidden;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1),
  -10px -10px 20px rgba(255, 255, 255, 1);
  border-radius: 50px;
}

.login_new .box:hover .input-box a1,
.login_new .box:hover .input-box a2 {
  visibility: visible;
  opacity: 1;
  transition-delay: 0.15s;
}

.login_new .box .input-box a1:hover,
.login_new .box .input-box a2:hover {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px rgba(255, 255, 255, 0.8),
  inset 10px 10px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow .1s ease-out;
}

</style>