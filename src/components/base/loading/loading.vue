<template>
    <div class="loading">
        <div class="loading-content">
            <img src="./loading.gif"  width="24" height="24">
            <p class="desc">{{title}}</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            title:''
        }
    },
    methods:{
        setTitle(title){
            this.title = title
        }
    }
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
       color: $color-text-l;
      }
    }
  }
</style>