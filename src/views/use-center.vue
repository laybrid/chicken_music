<template>
  <div class="user-center" v-no-result="noResult">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <Switches :items="['我喜欢的']" v-model="currentIndex"></Switches>
    </div>
    <div class="play-btn" @click="random" v-if="currentList.length">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <Scroll class="list-scroll" v-if="currentIndex === 0">
        <div class="list-inner">
          <song-list :songs="favoriteList" @select="selectSong"> </song-list>
        </div>
      </Scroll>
      <Scroll class="list-scroll" v-if="currentIndex === 1">
        <div class="list-inner">
          <song-list :songs="playHistory" @select="selectSong"> </song-list>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Switches from "../components/base/switches/switches.vue";
import Scroll from "../components/base/scroll/scroll.vue";
import SongList from "../components/base/song-list/song-list.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Switches,
    Scroll,
    SongList,
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    noResult() {
      return this.favoriteList.length;
    },
    currentList() {
      return this.favoriteList;
    },
    ...mapState(["favoriteList"]),
  },
  methods: {
    selectSong({ song }) {
      this.addSong(song);
    },
    random() {
      this.randomPlay(this.currentList);
    },
    back() {
      this.$router.back();
    },
    ...mapActions(["addSong", "randomPlay"]),
  },
};
</script>

<style lang="scss" scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>