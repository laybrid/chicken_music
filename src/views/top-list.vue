<template>
  <div class="top-list" v-loading="loading">
    <Scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" alt="" />
          </div>
          <ul class="song-list">
            <li
              class="song"
              v-for="(song, index) in item.songList"
              :key="song.id"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" appear :data="selectedTop" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import Scroll from "../components/base/scroll/scroll.vue";
import { getTopList } from "../service/top-list.js";
import { TOP_KEY } from "../assets/js/constant.js";
import storage from 'good-storage'
export default {
  components: {
    Scroll,
  },
  data() {
    return {
      topList: [],
      loading: true,
      selectedTop: null,
    };
  },
  async created() {
    const result = await getTopList();
    this.topList = result.topList;
    this.loading = false;
  },
  methods: {
    selectItem(top) {
      this.selectedTop = top;
      this.cacheAlbum(top);
      this.$router.push({
        path: `/top-list/${top.id}`,
      });
    },
    cacheAlbum(top) {
      storage.session.set(TOP_KEY, top);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  top: 88px;
  width: 100%;
  .top-list-content {
    height: 100%;
    overflow: hidden;
  }
  .item {
    display: flex;
    margin: 0 20px;
    padding-top: 20px;
    height: 100px;
  }
  .icon {
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
  }
  .song-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px;
    height: 100px;
    overflow: hidden;
    background: #333;
    color: hsla(0, 0%, 100%, 0.3);
    font-size: 12px;
    .song {
      @include no-wrap();
      line-height: 26px;
    }
  }
}
</style>