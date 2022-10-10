<template>
  <div class="song-list">
      <ul>
          <li v-for="(item,index) in songs" :key="item.id" class="item"
              @click="selectItem(item,index)">
              <div class="content">
                  <h2 class="name">{{item.name}}</h2>
                  <p class="desc">{{getDesc(item)}}</p>
              </div>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
props:{
    songs:{
        type:Array,
        default:[]
    }
},
emits:['select'],
methods:{
      getDesc(song) {
        return `${song.singer}·${song.album}`
      },
      selectItem(song,index) {
          this.$emit('select',{song,index});
      }
}
}
</script>

<style lang="scss" scoped>
.item {
    display: flex;
    align-items: center;
    height: 64px;
    font-size: $font-size-medium;
    .content {
        line-height: 20px
    }
    .name {
         @include no-wrap();
          color: $color-text
    }
    .desc {
     @include no-wrap();
     margin-top: 4px;
    color: $color-text-d;
    }
}
</style>