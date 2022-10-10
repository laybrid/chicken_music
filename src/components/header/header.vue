<template>
  <div class="header">
    <span class="icon"></span>
    <h1 class="text">Chicken Music</h1>
    <router-link class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.header {
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: 0;
  .icon {
      display: inline-block;
      width: 30px;
      height: 32px;
      @include bg-image('logo');
      background-size: 30px 32px ;
      margin-right: 9px;
      margin-top: 6px;
      vertical-align: top;
  }  
  .text {
    display: inline-block;    
    line-height: 44px;
    font-size: $font-size-large;
     vertical-align: top;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
        // i标签是行内元素可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin；所以display:block
      display: block;
      padding: 12px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

}
</style>