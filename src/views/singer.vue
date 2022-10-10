<template>
  <div class="singer" v-loading="!singers.length">
    <indexList :singers="singers" @select="selectSinger"></indexList>
    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component"  :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from "../service/singer";
import indexList from "../components/base/index-list/index-list.vue";
import storage from "good-storage";
import { SINGER_KEY } from "../assets/js/constant";
export default {
  components: {
    indexList,
  },
  data() {
    return {
      singers: [],
      selectedSinger: null,
    };
  },
  async created() {
    const result = await getSingerList();
    this.singers = result.singers;
    // console.log(result.singers)
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer;
      this.cacheSinger(singer);
      // 拿到值先缓存之后路由跳转一下
      this.$router.push({
        path: `/singer/${singer.mid}`,
      });
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    },
  },
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>