<template>
  <div class="recommend" v-loading="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrap">
          <div class="slider-content">
            <Silder v-if="sliders.length" :sliders="sliders"></Silder>
          </div>
        </div>
        <div class="recommend-list">
          <h2 class="list-title" v-show="!loading">热门歌单推荐</h2>
          <ul>
            <li
              v-for="item in albums"
              :key="item.id"
              class="item"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img v-lazy="item.pic" alt="" />
              </div>
              <div class="text">
                <h2 class="username">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" appear :data="selectedAlbum" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from "../service/recommend";
import { ALBUM_KEY } from "../assets/js/constant.js";
import storage from 'good-storage'
import Silder from "../components/base/slider/slider.vue";
import Scroll from "../components/base/scroll/scroll.vue";
export default {
  components: {
    Silder,
    Scroll,
  },
  data() {
    return {
      sliders: [],
      albums: [],
      loadingText: "正在载入...",
      selectedAlbum: null,
    };
  },
  async created() {
    const result = await getRecommend();
    this.sliders = result.sliders;
    this.albums = result.albums;
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length;
    },
  },
  methods: {
    selectItem(album) {
      this.selectedAlbum = album;
      this.cacheAlbum(album);
      this.$router.push({
        path: `/recommend/${album.id}`,
      });
    },
    cacheAlbum(album) {
      storage.session.set(ALBUM_KEY, album);
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .recommend-content {
    height: 100%;
    overflow: hidden;
  }
  .slider-wrap {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    .slider-content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
  .recommend-list {
    .list-title {
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }
    .item {
      display: flex;
      padding: 0 20px 20px 20px;

      .icon {
        flex: 0 0 60px;
        margin-right: 20px;
        img {
          width: 100%;
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        font-size: $font-size-medium;
        line-height: 20px;
        overflow: hidden;
        .username {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          //  margin-top:8px;
          color: $color-text-d;
        }
      }
    }
  }
}
</style>