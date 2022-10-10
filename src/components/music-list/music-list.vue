<template>
  <div class="music-list">
    <div class="back" @click="goback"><i class="icon-back"></i></div>
    <div class="title">
      {{ title }}
    </div>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probeType="3"
      @scroll="onScroll"
      v-no-result:[noResultText]="noResult"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectItem"></SongList>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "../base/scroll/scroll.vue";
import SongList from "../base/song-list/song-list.vue";
import { mapActions, mapState } from "vuex";
const RESERVED_HEIGHT = 40;
export default {
  props: {
    songs: {
      type: Array,
      default: [],
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: "抱歉咯没找到歌啊",
    },
  },
  components: {
    Scroll,
    SongList,
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
    };
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT;
  },
  computed: {
    bgImageStyle() {
      let zIndex = 0;
      let paddingTop = "70%";
      let height = 0;
      let translateZ = 0;
      if (this.scrollY > this.maxTranslateY) {
        zIndex = 10;
        height = `${RESERVED_HEIGHT}px`;
        paddingTop = 0;
      }
      let scale = 1;
      if (this.scrollY < 0) {
        scale = 1 + Math.abs(this.scrollY / this.imageHeight);
      }
      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`,
      };
    },
    scrollStyle() {
      const bottom = this.playList.length ? "60px" : "0";
      return {
        top: `${this.imageHeight}px`,
        bottom
      };
    },
    filterStyle() {
      let blur = 0;
      const scrollY = this.scrollY;
      const imageHeight = this.imageHeight;
      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) *
          20;
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      };
    },
    playBtnStyle() {
      let display = "";
      if (this.scrollY >= this.maxTranslateY) {
        display = "none";
      }
      return {
        display,
      };
    },
    noResult() {
      // loading为假代表信息传过来了 length为空代表没有 传的是空信息
      return !this.loading && !this.songs.length;
    },
    ...mapState(["playList"]),
  },
  methods: {
    goback() {
      this.$router.back();
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
    },
    selectItem({ song, index }) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    random() {
      this.randomPlay(this.songs);
    },
    ...mapActions(["selectPlay", "randomPlay"]),
  },
};
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 11px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    //禁止名字折行
    @include no-wrap();
    font-size: $font-size-large;
    color: $color-text;
    z-index: 20;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
  }
  .play-btn-wrapper {
    position: absolute;
    bottom: 20px;
    z-index: 10;
    width: 100%;
    .play-btn {
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-theme;
      color: $color-theme;
      border-radius: 100px;
      font-size: 0;
      .icon-play {
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
  }
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>