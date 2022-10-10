<template>
  <div class="tab">
    <router-link
      class="tab-item" 
      v-for="item in tabs" 
      :key="item.path" 
      :to="item.path"
    >
      <span class="tab-link">{{item.name}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tabs:[
        {
          name: '推荐',
          path: '/recommend'  
        },
        {
          name: '歌手',
          path: '/singer'  
        },
        {
          name: '排行',
          path: '/top-list'
        },
        {
          name: '搜索',
          path: '/search'
        }
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  height: 44px;
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-link {
      font-size: $font-size-medium;
      line-height: 44px;
      color: $color-text-l;
      padding-bottom: 5px;
    }
    // 路由的类名里写 被激活时会怎么样
    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>