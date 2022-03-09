<template>
  <div class="login-container">
    <!--背景图片 暂时没找到很好的-->
    <div class="box">
      <div class="img">
        <div class="content-box">
          <img src="../img/rule4.png"/>
          <h2>Puzzle</h2>
          <div class="input-box">
            <input type="text" placeholder="点 击 此 处 输 入 昵 称" @keyup.enter.native="login()" v-model="username"/>
            <a>
              <a1 @click="login">Login !</a1>
              <a2 @click="close">X</a2>
            </a>
          </div>

        </div>
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
    login() {     //与后端java交互，把ruleForm传给后端，通过后端返回的值 跳转到Puzzle界面。done
      this.username.replace(/[\r\n]/g, "");
      const ruleForm = {
        username: this.username.replace(/[\r\n]/g, "")
      }
      const _this = this
      this.$axios.post('http://106.12.119.247:8081/user/login', ruleForm).then(res => {
            //console.log(res.data)
            //Store.id = res.data.data.id
            Store.username = ruleForm.username;
            Store.status = res.data.data;
            Store.first = res.data.data;

            const url = "http://106.12.119.247:8081/puzzle/level/" + Store.status
            this.$axios.get(url).then(res => {
                  //console.log(res.data)
                  Store.N = res.data.data.n
                  Store.Type = res.data.data.type
                  Store.src = res.data.data.imgSrc
                  Store.answer = res.data.data.answer
                  Store.puzzle_group = res.data.data.puzzleG
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
* {
  margin: 0;
  padding: 0;
}

.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #efeeee;
}

.login-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
}

.login-container .box {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  align-content: center;
  width: 270px;
  height: 450px;
}

.login-container .box .img {
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

.login-container .box .img img {
  width: 200px;
  transition: width 0.2s ease-out;
   -moz-user-select: none; /*图片不可被选中*/
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.login-container .box .img:hover {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px rgba(255, 255, 255, 0.8),
  inset 18px 18px 30px rgba(0, 0, 0, 0.1),
  inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow .2s ease-out;
}

.login-container .box .img:hover img {
  width: 180px;
  transition: width 0.2s ease-out;
}

.login-container .box .content-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 370px;
  text-align: center;
  transition: 1s;
  z-index: 0;
  overflow: hidden;
}

.login-container .box:hover .content-box {
  height: 400px;
}

.login-container .box .content-box h2 {
  position: relative;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 20px 8px 0px 8px;
  color: slategrey;
}

.login-container .box .input-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
}

/*输入框*/
.login-container .box input {
  display: inline-block;
  position: relative;
  width: 60%;
  border: none;
  height: 40px;
  opacity: 0;
  letter-spacing:2px;   /*字体间距*/
  box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
  border-radius: 50px;
  outline: medium;
  background-color: #efeeee;
  text-align: center;
  margin-top: 20px;
  transition: 0.5s;
}

.login-container .box:hover input {
  opacity: 1;
}

.login-container .box input:hover {
  box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  transition: box-shadow .2s ease-out;
}


/*最下面的login按钮 */
.login-container .box .input-box a {
  display: flex;
  justify-content: center; /*水平主轴居中*/
  align-items: center; /*垂直交叉轴居中*/
  width: 400px;
  margin-top: 20px;
  transition: 0.5s;
}

.login-container .box .input-box a1 {
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

.login-container .box .input-box a2 {
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

.login-container .box:hover .input-box a1,
.login-container .box:hover .input-box a2 {
  visibility: visible;
  opacity: 1;
  transition-delay: 0.15s;
}

.login-container .box .input-box a1:hover,
.login-container .box .input-box a2:hover {
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px rgba(255, 255, 255, 0.8),
  inset 10px 10px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow .1s ease-out;
}
</style>

