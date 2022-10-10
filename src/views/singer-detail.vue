<template>
  <div class="singer-detail">
    <MusicList :pic="pic" :title="title" :songs="songs" :loading="loading">
    </MusicList>
  </div>
</template>

<script>
import createDetailComponent from "../assets/js/create-detail-component.js";
import { getSingerDetail } from "../service/singer";
import { SINGER_KEY } from "../assets/js/constant";
export default createDetailComponent(
  "singer-detail",
  SINGER_KEY,
  getSingerDetail
);
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-background;
}
</style>