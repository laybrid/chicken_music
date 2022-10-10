<template>
  <Scroll class="index-list" :probeType="3" @scroll="onScroll" ref="scroll">
    <div class="list-wrap" ref="groupRef">
      <div class="list-group" 
           v-for="(group) in singers"
          :key="group.title"
      >
        <div class="title"><span>{{group.title}}</span></div>
        <ul>
          <li v-for="(item) in group.list" :key="item.id" 
              class="list-item"
              @click="onItemClick(item)">
              <img v-lazy="item.pic" alt="" class="avatar">
              <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 下面的dom元素不应该归scroll组件管 scroll组件只对第一个dom元素有效 -->
     <div class="fixed-title" v-show="fixedTitle" :style="fixedStyle">{{fixedTitle}}</div>

     <div class="shortcut"
          @touchstart.stop.prevent="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
          @touchend.stop.prevent>
       <ul>
         <li v-for="(item,index) in shortList" :key="item"
             :data-index="index" 
             class="short-list" :class="{current: index===currentIndex}">
           {{item}}
         </li>
       </ul>
     </div>
  </Scroll>
</template>

<script>
import Scroll from '../scroll/scroll.vue'
import useFixed from './use-Fixed'
import useShortcut from './use-Shortcut'
export default {
  components:{
    Scroll
  },
  props:{
    singers:{
      type:Array,
      default:[]
    }
  },
  emits:['select'],
  setup(props,{emit}){
    const {groupRef,onScroll,fixedTitle,fixedStyle,currentIndex} = useFixed(props);
    const {shortList,onShortcutTouchStart,scroll,onShortcutTouchMove} = useShortcut(props,groupRef);

    function onItemClick(item) {
      emit('select',item);
    }
    return {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      shortList,
      onShortcutTouchStart,
      scroll,
      onShortcutTouchMove,
      onItemClick
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  height: 100%;
  overflow: hidden;
}
  .list-wrap {
    position: relative;
    .list-group {
      padding-bottom: 30px;
      .title {
        height: 30px;
        background: $color-highlight-background;
        font-size: $font-size-small;
        color: $color-text-l;
        line-height: 30px;
        padding-left: 20px;
      }
      .list-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          flex: 0 0 50px;
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
  }
.fixed-title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  padding-left: 20px;
  line-height: 30px;
  background: $color-highlight-background;
  font-size: $font-size-small;
  color: $color-text-l;
}
.shortcut {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;
  .short-list {
    padding: 3px;
    // line-height: 1;
    color: $color-text-l;
    font-size: $font-size-small;
  }
  .current {
     color: $color-theme
  }
}  
</style>