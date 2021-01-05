<template>
  <scroll
    ref="listview"
    class="listview"
    :listen-scroll="listenScroll"
    @scroll="scroll"
    :data="data"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <!-- <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>-->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from 'common/js/dom'; // 设置或获取 dom 属性
const  TITLE_HEIGHT = 30; // title 元素的搞
const ANCHOR_HEIGHT = 18;
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex:0,
    };
  },
  created() {
    this.listenScroll = true;
    this.touch = {};
    this.listHeight = [];
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    scroll(pos) {
      console.log(pos);
      this.scrollY = pos.y;
    },
    onShortcutTouchStart(e){
      // 获取touch 元素  e.target.dataset.index; 或者原生获取属性
      // let anchorIndex =  getData(e.target, 'index');
      console.log(e);
      let anchorIndex =  e.target.dataset.index;
      this.touch.y1 = e.touches[0].pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e){
      
    },
    _scrollTo(index) {
      if(!index && index != 0){
        return;
      }
      if(index < 0) {
        index = 0;
      } else if(index > this.listHeight.length -2 ) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = - this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calulateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for(var i = 0; i < list.length; i++ ){
        // 
        height += list[i].clientHeight;
        // 存储每个组到顶部的距离
        this.listHeight.push(height);
      }
    }
  },
  computed: {
    // 计算右边快速入口
    shortcutList:function(group) {
      return this.data.map(group => {
        return group.title.substring(0, 1);
      })
    } 
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calulateHeight();
      }, 20)
    },
    scrollY(newY) {
      console.log(newY) // 页面滚动scrollTop;
      const listHeight = this.listHeight;
      // 滚动到顶部 时  newY > 0;
      if(newY > 0) {
        // 当前元素下标重置为0
        this.currentIndex = 0;
        return ;
      }
      // 中间部分的滚动处理
      for(var i = 0; i < listHeight.length -2; i++ ) {
        let height1 = listHeight[i];
        let height2 = listHeight[i+1];
        if( -newY >= height1 && -newY <= height2) {
          this.currentIndex = i;
          this.diff = height2 + newY; // 计算出到达下一个字母差距
        }
      }
    },
    diff(newVal) {
      let fixedTop  = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
