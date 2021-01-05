<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import ListView from 'base/listview/listview'
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'

const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';
export default {
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        console.log(res);
        this.singers = this._normalizeSinger(res.data.list)
      })
    },
    _normalizeSinger(list) {
      let map = {
         hot: {
           title: HOT_NAME,
           items: []
         }
      }
      //  原始数据分组数据
      list.forEach((item, index) => {
        // 每组最多保留10条
        if(index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        // 根据字母创建分组
        const key = item.Findex;
        if(!map[key]){
          map[key] = {
            title: key,
            items: []
          }
        }
        // 将数据分派到对应的组中
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // 按字母排序
      let ret = [];
      let hot = [];
      for (var key in map ) {
        let val = map[key];
        // 如果是字母就放入 ret 中，否则归类为 hot
        if( val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        }else if(val.title == HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort( (a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      })
      return hot.concat(ret);
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>