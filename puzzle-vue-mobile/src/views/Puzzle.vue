<template>
  <div class="game" :style="{width: canvasWidth, height: '100%'}">
    <img class="backimage" src="../img/my7.jpg"/>  <!--背景-->

    <el-progress class="schedule" :style="{'width': '100px'}" :text-inside="true" :stroke-width="26"
                 :percentage="percentage" status="success"></el-progress>   <!--进度条-->

    <div class="pintu_area" :style="{width: `${this.N * 36}px`, height: `${this.N * 36}px`}">  <!--拼图区域、右键工具区-->
      <img :src="src" :style="{width: `${this.N * 36}px`, height: `${this.N * 36}px`}" class="test"/>
      <div v-for="(part, index) in partList" :key="'part' + index" class="pintu_part"
           @contextmenu.prevent="opentips(index)" @touchend="opentips(index)">
        <img v-show="partList[index].type1" src="../img/cha.png" class="pingtu_cha">
        <img v-show="partList[index].type2" src="../img/zheng.png" class="pingtu_cha">
      </div>
    </div>

    <div class="puzzle">  <!--拼图-->
      <div v-for="(puzzle1, index) in puzzleList[0]" :key="puzzle1.id" class="part_img1"
           :style="{'backgroundImage': `url(${this.image})`, 'backgroundPosition': `500px 200px`}"
           @touchstart="moveImg($event,0, index)">
      </div>
      <div v-for="(puzzle2, index) in puzzleList[1]" :key="puzzle2.id" class="part_img2"
           :style="{'backgroundImage': `url(${this.image})`, 'backgroundPosition': `600px 200px`}"
           @touchstart="moveImg($event,1, index)">
      </div>
      <div v-for="(puzzle3, index) in puzzleList[2]" :key="puzzle3.id" class="part_img3"
           :style="{'backgroundImage': `url(${this.image})`, 'backgroundPosition': `400px 110px`}"
           @touchstart="moveImg($event,2, index)">
      </div>
      <div v-for="(puzzle4, index) in puzzleList[3]" :key="puzzle4.id" class="part_img4"
           :style="{'backgroundImage': `url(${this.image})`, 'backgroundPosition': `100px 200px`}"
           @touchstart="moveImg($event,3, index)">
      </div>
    </div>

    <div class="pick"> <!--选择、游戏说明、确认-->
      <el-button plain @click="finalgame()">确认提交</el-button>

      <el-button :style="{marginLeft: '30px'}" plain @click="dialogTableVisible = true">游戏说明
        <el-dialog width="350px" v-model="dialogTableVisible" :showClose="false">
          <img class="play" src="../img/play.png" @contextmenu.prevent>
        </el-dialog>
      </el-button>
    </div>

    <ul v-show="visible" :style="{left:left-50+'px', top:top-100+'px'}" class="contextmenu" @contextmenu.prevent>
      <!--右键删除旋转对称-->
      <img src="../img/use.png" class="img1"/>
      <img src="../img/rotate.png" @touchstart="rotateImg(target, rightClickIndex, rightClickType)" class="img2"/>
      <img src="../img/duichen.png" @touchstart="reveseImg(target, rightClickIndex, rightClickType)"
           class="img3"/>
      <img src="../img/delete.png" @touchstart="deleteImg(rightClickIndex, rightClickType)" class="img4"/>
    </ul>
  </div>
</template>

<script>
//TODO
//  1.UI美化                       2022.2.19-不限期
//  2.关卡设计                      2022.2.19             done
//  3.代码上传服务器 域名指向服务器     2022.2.19             done
//  4.修复bug，再次确认游戏是否能正常进行2022.2.20             done
//  5.到达最后一关                   2022.2.21             done
//  6.上传github书写开发文档          2022.2.21-undefine    done
//  7.不同浏览器兼容                  undefine
//  8.手机版                        undefine              done
//  9.UI
//TODO BUG 左右键一起按的时候 暂不改
//TODO BUG 旋转对称有看起来不和谐的地方 先对称再旋转 不改
import Store from '@/store/store';

export default {
  name: 'Puzzle',
  inject: ['reload'],
  data() {
    return {
      canvasWidth: document.documentElement.clientWidth,   //600 1400   500 1000
      canvasHeight: document.documentElement.clientHeight,
      //右键菜单
      visible: false,
      top: 0,
      left: 0,
      rightClickType: -1,
      rightClickIndex: -1,
      target: {},  //用于存放上一个
      //拼图区域
      N: Store.N,   //6*6的大小
      src: Store.src,  //背景图
      partList: [], // 卡槽
      checkList: [],   //[-1, -1, -1, -1, -1, -1], //看有多少块
      finalList: [],   //[[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]],
      realanswer: Store.answer.split(','),   //数组 通过,分割
      groupList: Store.puzzle_group.split(','),
      //拼图
      puzzleList: [[{id: 0, rotate: 0, revese: false, band: -1}], [{
        id: 0,
        rotate: 0,
        revese: false,
        band: -1
      }],
        [{id: 0, rotate: 0, revese: false, band: -1}], [{id: 0, rotate: 0, revese: false, band: -1}]],
      iList: [1, 1, 1, 1],
      zi: 1,
      //关卡
      percentage: parseInt((Store.status - 1) / 18 * 100),//第几关  改为全局变量

      rotateStatus: true, // 拼图旋转状态
      dialogTableVisible: false,
      image: 'http://106.12.119.247/img/puzzle.jpg' // 拼图图片路径
    }
  },
  watch: {
    //监听长度和宽度 自适应大小
    canvasHeight(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.canvasHeight = val
        this.timer = true
        let that = this
        setTimeout(function () {
          // 打印screenWidth变化的值
          //console.log(that.canvasHeight)
          that.timer = false
        }, 400)
      }
    },
    canvasWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.canvasWidth = val
        this.timer = true
        let that = this
        setTimeout(function () {
          // 打印screenWidth变化的值
          //console.log(that.canvasWidth)
          that.timer = false
        }, 400)
      }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('touchstart', this.closeMenu)
      } else {
        document.body.removeEventListener('touchstart', this.closeMenu)
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        that.canvasHeight = document.documentElement.clientHeight - 22
        that.canvasWidth = document.documentElement.clientWidth - 10
      })()
    }

    if (Store.status == 0) { //暂未登录
      this.open2()
      this.$router.push('/login')
      return
    }
    if (Store.status == Store.first) {
      this.open3()
    }

    this.initGame()
  },
  methods: {
    initGame() { // 游戏初始化
      this.partList = []
      for (let i = 0; i < this.N * this.N; i++) { // 循环遍历生成拼图数组与对应卡槽数组

        this.partList.push({ // 卡槽数组 倒着push的
          x: this.N - i % this.N, // 第几列
          y: this.N - parseInt((i / this.N)), //第几行
          group: this.groupList[i],
          type1: false,
          type2: false
        })
      }

      for (let i = 0; i < Store.Type; i++) {
        this.checkList.push(-1);
        const temp = [-1, -1, -1, -1];
        this.finalList.push(temp);
      }
    },
    //移动 翻转 反转 删除 拼图
    moveImg(e, type, index) { // 移动拼图
      const _this = this
      if (this.puzzleList[type][index].id == this.iList[type] - 1) {  //复制一个进入puzzleList
        _this.puzzleList[type].push({id: this.iList[type]++, rotate: 0, revese: false, band: -1})
      }

      const el = e.target
      el.style.transition = "none"
      el.style.zIndex = 300 + this.zi + 1;  //这里保证左键拼图始终在最上层
      const sX = e.changedTouches[0].clientX - el.offsetLeft  //用点击的点减去初始值 代表在图形内的相对位置 即相对第一个点的位置
      const sY = e.changedTouches[0].clientY - el.offsetTop

      let ismove = false;

      if (this.puzzleList[type][index].band != -1) {   //出现移动 旋转 对称 删除时首先先进行这条语句
        this.checkList[this.puzzleList[type][index].band] = -1;
        this.finalList[this.puzzleList[type][index].band][0] = -1
        this.finalList[this.puzzleList[type][index].band][1] = -1
        this.finalList[this.puzzleList[type][index].band][2] = -1
        this.finalList[this.puzzleList[type][index].band][3] = -1
      }
      document.ontouchmove = (e) => { // 拼图随鼠标移动,改变拼图的top和left属性值 设置边界

        ismove = true;
        const eX = e.changedTouches[0].clientX - sX
        const eY = e.changedTouches[0].clientY - sY
        let wid_r = 0
        let hei_t = 0
        let wid_l = 0
        let hei_d = 0
        if (type == 0 && this.puzzleList[type][index].rotate == 0) {
          wid_l = 0;
          wid_r = 144;
          hei_t = 0;
          hei_d = 36;
        } else if (type == 0 && this.puzzleList[type][index].rotate == 0.25) {
          wid_l = 36;
          wid_r = 72;
          hei_t = -72;
          hei_d = 72;
        } else if (type == 0 && this.puzzleList[type][index].rotate == 0.5) {
          wid_l = 0;
          wid_r = 144;
          hei_t = -36;
          hei_d = 0;
        } else if (type == 0 && this.puzzleList[type][index].rotate == 0.75) {
          wid_l = 72;
          wid_r = 108;
          hei_t = -72;
          hei_d = 72;
        } else if (type == 1 && this.puzzleList[type][index].rotate == 0) {
          wid_l = 0;
          wid_r = 108;
          hei_t = 0;
          hei_d = 72;
        } else if (type == 1 && this.puzzleList[type][index].rotate == 0.25) {
          wid_l = 0;
          wid_r = 72;
          hei_t = 0;
          hei_d = 108;
        } else if (type == 1 && this.puzzleList[type][index].rotate == 0.5) {
          wid_l = -36;
          wid_r = 72;
          hei_t = 0;
          hei_d = 72;
        } else if (type == 1 && this.puzzleList[type][index].rotate == 0.75) {
          wid_l = 0;
          wid_r = 72;
          hei_t = -36;
          hei_d = 72;
        } else if (type == 2 && this.puzzleList[type][index].rotate == 0) {
          wid_l = 0;
          wid_r = 72;
          hei_t = 0;
          hei_d = 108;
        } else if (type == 2 && this.puzzleList[type][index].rotate == 0.25) {
          wid_l = 0;
          wid_r = 108;
          hei_t = 36;
          hei_d = 108;
        } else if (type == 2 && this.puzzleList[type][index].rotate == 0.5) {
          wid_l = 0;
          wid_r = 72;
          hei_t = 36;
          hei_d = 144;
        } else if (type == 2 && this.puzzleList[type][index].rotate == 0.75) {
          wid_l = -36;
          wid_r = 72;
          hei_t = 36;
          hei_d = 108;
        } else if (type == 3 && this.puzzleList[type][index].rotate == 0) {
          wid_l = 0;
          wid_r = 72;
          hei_t = 0;
          hei_d = 108;
        } else if (type == 3 && this.puzzleList[type][index].rotate == 0.25) {
          wid_l = -36;
          wid_r = 72;
          hei_t = 0;
          hei_d = 72;
        } else if (type == 3 && this.puzzleList[type][index].rotate == 0.5) {
          wid_l = 0;
          wid_r = 72;
          hei_t = -36;
          hei_d = 72;
        } else {
          wid_l = 0;
          wid_r = 108;
          hei_t = 0;
          hei_d = 72;
        }
        if (eX + wid_l > 0 && eX < this.canvasWidth - wid_r) {
          el.style.left = eX + 'px'
        }
        if (eY + hei_t > 0 && eY < this.canvasHeight - hei_d) {
          el.style.top = eY + 'px'
        }
      }
      document.ontouchend = (e) => {
        const marginleft = (this.canvasWidth - this.N * 36) / 2
        const margintop = (this.canvasHeight * 0.55 - this.N * 36) / 2 + this.canvasHeight * 0.1

        //如果没有移动到拼图区 则删除
        if (e.target.style.backgroundImage == 'url("http://106.12.119.247/img/puzzle.jpg")'
            && (e.changedTouches[0].clientX - sX < marginleft - 36 ||
                e.changedTouches[0].clientY - sY < margintop - 36 ||
                e.changedTouches[0].clientX - sX > marginleft + this.N * 36 ||
                e.changedTouches[0].clientY - sY > margintop + this.N * 36) &&
            this.puzzleList[type][index].id != this.iList[type] - 1) {
          //这里好像有个莫名其妙的bug，所以用了target.id的判断 且必须是左键点击  还有一些莫名其妙的bug 会导致原始元素的被迫删除加入了最后一个判断
          this.deleteImg(index, type)
          // return
        }
        if (!ismove) {
          this.openMenu(e, type, index)
        }
        document.ontouchmove = null
        document.ontouchend = null
        el.style.transition = "all 1s"
        el.style.zIndex = 200 + this.zi++  //这里保证所有新移动完成的拼图处于所有已定拼图中的最上层

        if (this.checkImg(el, type, index)) {  //就近判断 就吸附到那个区域 同时这个区域开启锁定
          const left = (parseInt(el.style.left) - marginleft) / 36
          const top = (parseInt(el.style.top) - margintop) / 36
          const toLeft = Math.round(left) < this.N - 0.5 ? Math.round(left) : this.N - 1
          const toTop = Math.round(top) < this.N - 0.5 ? Math.round(top) : this.N - 1

          el.style.left = toLeft * 36 + marginleft + 'px'
          el.style.top = toTop * 36 + margintop + 'px'
        }
      }
    },
    rotateImg(e, index, type) { // 旋转当前拼图
      if (this.rotateStatus) { // 拼图可以旋转并且并未正确放置
        if (this.puzzleList[type][index].band != -1) {   //出现移动 旋转 对称 删除时首先先进行这条语句
          this.checkList[this.puzzleList[type][index].band] = -1;
          this.finalList[this.puzzleList[type][index].band][0] = -1
          this.finalList[this.puzzleList[type][index].band][1] = -1
          this.finalList[this.puzzleList[type][index].band][2] = -1
          this.finalList[this.puzzleList[type][index].band][3] = -1
        }

        const el = e
        this.rotateStatus = false
        el.style.transition = "all 1s"

        let angle = this.puzzleList[type][index].rotate
        this.puzzleList[type][index].rotate += 0.25

        if (angle < 0) { // 计算出的角度为270度时会返回-0.25，将其转为0.75以实现正确的旋转
          angle = 0.75
        }
        if (this.puzzleList[type][index].revese) {   //反转过
          el.style.transform = `rotate(${angle + 0.25}turn)` + `scale(-1, 1)`
        } else {                            //没有反转过
          el.style.transform += `rotate(0.25turn)`
        }
        if (this.checkImg(e, type, index)) {  //就近判断 就吸附到那个区域 同时这个区域开启锁定
          const marginleft = (this.canvasWidth - this.N * 36) / 2
          const margintop = (this.canvasHeight * 0.55 - this.N * 36) / 2 + this.canvasHeight * 0.1
          const left = (parseInt(el.style.left) - marginleft) / 36
          const top = (parseInt(el.style.top) - margintop) / 36
          const toLeft = Math.round(left) < this.N - 0.5 ? Math.round(left) : this.N - 1
          const toTop = Math.round(top) < this.N - 0.5 ? Math.round(top) : this.N - 1

          el.style.left = toLeft * 36 + marginleft + 'px'
          el.style.top = toTop * 36 + margintop + 'px'
        }
        const _this = this
        setTimeout(() => {
          if (angle + 0.25 == 1) { // 如果旋转了360度将其重置为0度，不然再次旋转会变成逆时针旋转，然后检查该拼图是否正确的放置在正确的卡槽里
            this.puzzleList[type][index].rotate = 0

            el.style.transition = "none"
            if (this.puzzleList[type][index].revese) {   //反转过
              el.style.transform = `rotate(0turn)` + `scale(-1, 1)`
            } else {                            //没有反转过
              el.style.transform = `rotate(0turn)`
            }

          }
          _this.rotateStatus = true
        }, 500);
      }
    },
    reveseImg(e, index, type) {  //反转拼图 轴对称
      if (type == 2 || type == 3) {
        if (this.puzzleList[type][index].band != -1) {   //出现移动 旋转 对称 删除时首先先进行这条语句
          this.checkList[this.puzzleList[type][index].band] = -1;
          this.finalList[this.puzzleList[type][index].band][0] = -1
          this.finalList[this.puzzleList[type][index].band][1] = -1
          this.finalList[this.puzzleList[type][index].band][2] = -1
          this.finalList[this.puzzleList[type][index].band][3] = -1
        }

        if (this.puzzleList[type][index].revese) {   //反转过
          let angle = this.puzzleList[type][index].rotate
          e.style.transform = `rotate(${angle}turn)`
          this.puzzleList[type][index].revese = false;
        } else {                            //没有反转过
          e.style.transform += `scale(-1, 1)`
          this.puzzleList[type][index].revese = true;
        }

        if (this.checkImg(e, type, index)) {  //就近判断 就吸附到那个区域 同时这个区域开启锁定
          const marginleft = (this.canvasWidth - this.N * 36) / 2
          const margintop = (this.canvasHeight * 0.55 - this.N * 36) / 2 + this.canvasHeight * 0.1
          const left = (parseInt(e.style.left) - marginleft) / 36
          const top = (parseInt(e.style.top) - margintop) / 36
          const toLeft = Math.round(left) < this.N - 0.5 ? Math.round(left) : this.N - 1
          const toTop = Math.round(top) < this.N - 0.5 ? Math.round(top) : this.N - 1

          e.style.left = toLeft * 36 + marginleft + 'px'
          e.style.top = toTop * 36 + margintop + 'px'
        }
      }
    },
    deleteImg(index, type) {
      if (this.puzzleList[type][index].band != -1) { //出现移动 旋转 对称 删除时首先先进行这条语句
        this.checkList[this.puzzleList[type][index].band] = -1;
        this.finalList[this.puzzleList[type][index].band][0] = -1
        this.finalList[this.puzzleList[type][index].band][1] = -1
        this.finalList[this.puzzleList[type][index].band][2] = -1
        this.finalList[this.puzzleList[type][index].band][3] = -1
      }
      this.puzzleList[type].splice(index, 1)
    },

    checkImg(e, type, index) { // 检查puzzle是否在区域里    移动后将原来的true改为false
      const left = (parseInt(e.style.left) - (this.canvasWidth - this.N * 36) / 2) / 36
      const top = (parseInt(e.style.top) - ((this.canvasHeight * 0.55 - this.N * 36) / 2 + this.canvasHeight * 0.1)) / 36
      const toLeft = Math.round(left) < this.N - 0.5 ? Math.round(left) : this.N - 1
      const toTop = Math.round(top) < this.N - 0.5 ? Math.round(top) : this.N - 1
      const i = toTop * this.N + toLeft

      let a = 0, b = 0, c = 0, d = 0
      if (type == 0 && this.puzzleList[type][index].rotate == 0) {
        a = i;
        b = i + 1;
        c = i + 2;
        d = i + 3;
      }
      if (type == 0 && this.puzzleList[type][index].rotate == 0.25) {
        a = i - 2 * this.N + 1;
        b = i - this.N + 1;
        c = i + 1;
        d = i + this.N + 1;
      }
      if (type == 0 && this.puzzleList[type][index].rotate == 0.5) {
        a = i - this.N;
        b = i - this.N + 1;
        c = i - this.N + 2;
        d = i - this.N + 3;
      }
      if (type == 0 && this.puzzleList[type][index].rotate == 0.75) {
        a = i - 2 * this.N + 2;
        b = i - this.N + 2;
        c = i + 2;
        d = i + this.N + 2;
      }
      if (type == 1 && this.puzzleList[type][index].rotate == 0) {
        a = i + 1;
        b = i + this.N;
        c = i + this.N + 1;
        d = i + this.N + 2;
      }
      if (type == 1 && this.puzzleList[type][index].rotate == 0.25) {
        a = i;
        b = i + this.N;
        c = i + this.N + 1;
        d = i + 2 * this.N;
      }
      if (type == 1 && this.puzzleList[type][index].rotate == 0.5) {
        a = i - 1;
        b = i;
        c = i + 1;
        d = i + this.N;
      }
      if (type == 1 && this.puzzleList[type][index].rotate == 0.75) {
        a = i - this.N + 1;
        b = i;
        c = i + 1;
        d = i + this.N + 1;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0 && !this.puzzleList[type][index].revese) {
        a = i;
        b = i + this.N;
        c = i + 2 * this.N;
        d = i + 2 * this.N + 1;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0.25 && !this.puzzleList[type][index].revese) {
        a = i + this.N;
        b = i + this.N + 1;
        c = i + this.N + 2
        d = i + 2 * this.N;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0.5 && !this.puzzleList[type][index].revese) {
        a = i + this.N;
        b = i + this.N + 1;
        c = i + 2 * this.N + 1;
        d = i + 3 * this.N + 1;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0.75 && !this.puzzleList[type][index].revese) {
        a = i + this.N + 1;
        b = i + 2 * this.N - 1;
        c = i + 2 * this.N;
        d = i + 2 * this.N + 1;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0 && this.puzzleList[type][index].revese) {
        a = i + 1;
        b = i + this.N + 1;
        c = i + 2 * this.N;
        d = i + 2 * this.N + 1;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0.25 && this.puzzleList[type][index].revese) {
        a = i + this.N;
        b = i + 2 * this.N;
        c = i + 2 * this.N + 1;
        d = i + 2 * this.N + 2;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0.5 && this.puzzleList[type][index].revese) {
        a = i + this.N;
        b = i + this.N + 1;
        c = i + 2 * this.N;
        d = i + 3 * this.N;
      }
      if (type == 2 && this.puzzleList[type][index].rotate == 0.75 && this.puzzleList[type][index].revese) {
        a = i + this.N - 1;
        b = i + this.N;
        c = i + this.N + 1;
        d = i + 2 * this.N + 1;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0 && !this.puzzleList[type][index].revese) {
        a = i + 1;
        b = i + this.N;
        c = i + this.N + 1;
        d = i + 2 * this.N;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0.25 && !this.puzzleList[type][index].revese) {
        a = i - 1;
        b = i;
        c = i + this.N;
        d = i + this.N + 1;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0.5 && !this.puzzleList[type][index].revese) {
        a = i - this.N + 1;
        b = i;
        c = i + 1;
        d = i + this.N;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0.75 && !this.puzzleList[type][index].revese) {
        a = i;
        b = i + 1;
        c = i + this.N + 1;
        d = i + this.N + 2;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0 && this.puzzleList[type][index].revese) {
        a = i;
        b = i + this.N;
        c = i + this.N + 1;
        d = i + 2 * this.N + 1;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0.25 && this.puzzleList[type][index].revese) {
        a = i;
        b = i + 1;
        c = i + this.N - 1;
        d = i + this.N;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0.5 && this.puzzleList[type][index].revese) {
        a = i - this.N;
        b = i;
        c = i + 1;
        d = i + this.N + 1;
      }
      if (type == 3 && this.puzzleList[type][index].rotate == 0.75 && this.puzzleList[type][index].revese) {
        a = i + 1;
        b = i + 2;
        c = i + this.N;
        d = i + this.N + 1;
      }

      if (a >= 0 && a < this.N * this.N && b >= 0 && b < this.N * this.N && c >= 0 && c < this.N * this.N && d >= 0 && d < this.N * this.N) {
        if (this.checkList[this.partList[a].group] == -1 && this.partList[a].group == this.partList[b].group && this.partList[b].group == this.partList[c].group && this.partList[c].group == this.partList[d].group) {
          this.checkList[this.partList[a].group] = type
          this.puzzleList[type][index].band = this.partList[a].group
          this.finalList[this.partList[a].group][0] = a
          this.finalList[this.partList[a].group][1] = b
          this.finalList[this.partList[a].group][2] = c
          this.finalList[this.partList[a].group][3] = d
          return true
        }
      } else {
        this.puzzleList[type][index].band = -1
        return false
      }

    },
    opentips(index) {  //点击区域后，显示图标
      if (!this.partList[index].type1 && !this.partList[index].type2) {
        this.partList[index].type1 = true
      } else if (this.partList[index].type1 && !this.partList[index].type2) {
        this.partList[index].type1 = false
        this.partList[index].type2 = true
      } else if (!this.partList[index].type1 && this.partList[index].type2) {
        this.partList[index].type2 = false
      }
    },
    load() {

    },
    finalgame() {   //游戏结束 进行游戏规则检查  这里可以取巧 因为每一个图的解是固定的 通过绑定位置可以解决所有check
      /*check1 全员连通 所有拼图连成一片
      //check2 同类相斥 同种拼图没有相互解除
      //check3 镂空覆盖 没有2*2的格子被拼图盖住*/

      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i] == -1) {
          this.open4()
          return
        }
      }

      let answer = []
      for (let i = 0; i < Store.Type; i++) {
        for (let j = 0; j < 4; j++) {
          answer.push(this.finalList[i][j])
        }
      }
      answer.sort(function (a, b) {
        return a - b;
      })

      for (let i = 0; i < 4 * this.N; i++) {
        if (this.realanswer[i] != answer[i]) {
          this.open4()
          return
        }
      }


      //最后一关 不刷新 不重写  这里的18代表暂时只有18关，后续增加要修改
      if (Store.status == 18) {
        this.open5()
        return
      }

      this.open1()
      Store.status++;

      const url = "http://106.12.119.247:8081/puzzle/level/" + Store.status
      this.$axios.get(url).then(res => {
            console.log(res.data)
            Store.N = res.data.data.n
            Store.Type = res.data.data.type
            Store.src = res.data.data.imgSrc
            Store.answer = res.data.data.answer
            Store.puzzle_group = res.data.data.puzzleG
            this.reload()
          }
      )

      const ruleForm = {
        // id: Store.id,
        username: Store.username,
        // status: Store.status
      }
      this.$axios.post('http://106.12.119.247:8081/user/logout', ruleForm).then(res => {
            console.log(res)
          }
      )
    },
    fuck() {   //开挂 直接通过
      if (Store.status == 18) {
        this.open5()
        return
      }

      this.open1()
      Store.status++;

      const url = "http://106.12.119.247:8081/puzzle/level/" + Store.status
      this.$axios.get(url).then(res => {
            console.log(res.data)
            Store.N = res.data.data.n
            Store.Type = res.data.data.type
            Store.src = res.data.data.imgSrc
            Store.answer = res.data.data.answer
            Store.puzzle_group = res.data.data.puzzleG
            this.reload()
          }
      )

      const ruleForm = {
        //id: Store.id,
        username: Store.username,
        //status: Store.status
      }
      this.$axios.post('http://106.12.119.247:8081/user/logout', ruleForm).then(res => {
            console.log(res)
          }
      )
    },
    open1() {
      this.$notify({
        title: '成功',
        message: '拼图完成!',
        type: 'success',
        duration: 3000
      });
    },
    open2() {
      this.$notify({
        title: '警告',
        message: '请先输入昵称登录',
        type: 'warning',
        duration: 3000
      });
    },
    open3() {
      this.$notify.info({
        title: '消息',
        message: '登录成功',
        duration: 3000
      });
    },
    open4() {
      this.$notify.error({
        title: '失败',
        message: '不满足所有游戏规则',
        duration: 3000
      });
    },
    open5() {
      this.$notify({
        title: '成功',
        message: '你已完成所有拼图!',
        type: 'success',
        duration: 3000
      });
    },
    //右键工具栏
    // TODO 对工具栏UI进行优化 UI还得继续优化 有点丑
    openMenu(e, type, index) {  //开启右键菜单
      if (this.puzzleList[type][index].id != this.iList[type] - 1) {
        this.visible = true;
      } else {
        this.visible = false;
      }

      this.rightClickType = type;
      this.rightClickIndex = index;
      this.target = e.target;

      var x = e.changedTouches[0].pageX;
      var y = e.changedTouches[0].pageY;

      this.top = y;
      this.left = x;
    },
    closeMenu() {
      this.visible = false;
    }

  }
}
</script>

<style>
.schedule {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 5%;
}

.pintu_area {
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-user-drag: none; /*图片不可被拖动*/
  position: absolute;
  top: 10%;
  bottom: 35%;
  left: 0;
  right: 0;
  margin: auto
}

.test {
  position: absolute;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.pintu_part {
  width: 34px;
  height: 34px;
  z-index: 100;
  border: 1px solid #0000001f;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.pick {
  -webkit-user-drag: none; /*图片不可被拖动*/
  position: absolute;
  left: 0;
  bottom: 10px;
  right: 0;
  margin: auto;
  width: 210px;
}

/*对话框*/
div.el-dialog__header {
  padding: 0
}

div.el-dialog {
  --el-dialog-padding-primary: 0;
}

.play {
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.pingtu_cha {
  width: 24px;
  height: 24px;
  padding: 6px;
  -moz-user-select: none; /*图片不可被选中*/
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.contextmenu {
  position: absolute;
  z-index: 3000;
}

.img1 {
  width: 120px;
  height: 200px;
  margin-left: 40px;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.img2 {
  width: 50px;
  height: 50px;
  cursor: pointer;
  position: absolute;
  top: 0px;
  left: 50px;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.img3 {
  width: 50px;
  height: 50px;
  cursor: pointer;
  position: absolute;
  top: 75px;
  left: 112px;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.img4 {
  width: 50px;
  height: 50px;
  cursor: pointer;
  position: absolute;
  top: 150px;
  left: 50px;
  -webkit-user-drag: none; /*图片不可被拖动*/
}

.part_img1 { /*长方形 1500 700*/
  width: 144px;
  height: 36px;
  background-size: 800px 600px;
  position: absolute;
  bottom: 27%;
  left: calc(50% - 72px);
  clip-path: polygon(1px 1px, 143px 1px, 143px 35px, 1px 35px);
  transform-origin: 72px 0px;
}

.part_img2 { /*凸*/
  width: 108px;
  height: 72px;
  background-size: 800px 600px;
  position: absolute;
  bottom: 10%;
  left: calc(50% - 54px);
  clip-path: polygon(37px 1px, 71px 1px, 71px 37px, 107px 37px, 107px 71px, 1px 71px, 1px 37px, 37px 37px);
  transform-origin: 36px 36px;
}

.part_img3 { /*L*/
  width: 72px;
  height: 108px;
  background-size: 800px 600px;
  position: absolute;
  bottom: 13%;
  left: 12%;
  clip-path: polygon(1px 1px, 35px 1px, 35px 73px, 71px 73px, 71px 107px, 1px 107px);
  transform-origin: 36px 72px;
}

.part_img4 { /*Z*/
  width: 72px;
  height: 108px;
  background-size: 800px 600px;
  position: absolute;
  bottom: 13%;
  right: 12%;
  clip-path: polygon(37px 1px, 71px 1px, 71px 71px, 35px 71px, 35px 107px, 1px 107px, 1px 37px, 37px 37px);
  transform-origin: 36px 36px;
}

.backimage {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

/*全局设置*/
html, body, #app {
  height: 97%;
}
</style>