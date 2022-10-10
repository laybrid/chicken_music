<template>
  <div class="player" v-show="playList.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">
            {{ currentSong.name }}
          </h1>
          <h2 class="subtitle">
            {{ currentSong.singer }}
          </h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper">
              <div class="cd" ref="cdRef">
                <img
                  :src="currentSong.pic"
                  alt="图片加载失败"
                  :class="isPlaying"
                  ref="cdImageRef"
                />
              </div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <div class="time time-l">{{ formatTime(currentTime) }}</div>
            <div class="progress-bar-wrapper">
              <progressBar
                ref="barRef"
                :progress="progress"
                @progress-changed="onProgressChanging"
                @progress-changing="onProgressChanged"
              ></progressBar>
            </div>
            <div class="time time-r">
              {{ formatTime(currentSong.duration) }}
            </div>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteListIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <miniPlayer :progress="progress" :togglePlay="togglePlay"></miniPlayer>
    <!-- 用户非法暂停的时候 比如和笔记本等 会触发这个pause事件 -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, watch, ref, nextTick } from "vue";
import ProgressBar from "./progress-bar.vue";
import miniPlayer from "./mini-player.vue";
import Scroll from "../base/scroll/scroll.vue";
import useMode from "./use-mode.js";
import useFavorite from "./use-favorite.js";
import useCd from "./use-cd.js";
import useLyric from "./use-lyric.js";
import useMiddleInteractive from "./use-mid-interactive.js";
import { formatTime } from "../../assets/js/util.js";
import { PLAY_MODE } from "../../assets/js/constant.js";

export default {
  components: {
    ProgressBar,
    Scroll,
    miniPlayer,
  },
  setup() {
    //data
    const audioRef = ref(null);
    let sonReady = ref(false);
    const currentTime = ref(0);
    const barRef = ref(null);
    //控制优先级 歌曲播放带来进度条的变化的优先级和拖动进度条的优先级
    let progressChanging = false;

    //vue x
    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.playing);
    const currentIndex = computed(() => store.state.currentIndex);
    const playList = computed(() => store.state.playList);
    const playMode = computed(() => store.state.playMode);

    // hooks
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteListIcon, toggleFavorite } = useFavorite();
    const { isPlaying, cdRef, cdImageRef } = useCd();
    const {
      currentLyric,
      currentLineNum,
      playLyric,
      stopLyric,
      lyricListRef,
      lyricScrollRef,
    } = useLyric({
      sonReady,
      currentTime,
    });
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useMiddleInteractive();

    //computed
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });
    const disableCls = computed(() => {
      return sonReady.value ? "" : "disable";
    });
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });

    //watch
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0;
      sonReady.value = false;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
    });
    watch(playing, (newPlaying) => {
      if (!sonReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        barRef.value.setOffset(progress.value);
      }
    });

    // methods
    function goBack() {
      store.commit("setFullScreen", false);
    }
    function togglePlay() {
      store.commit("setPlayingState", !playing.value);
    }
    function pause() {
      store.commit("setPlayingState", false);
    }
    function prev() {
      let list = playList.value;
      //一首歌都没有或者歌曲没准备好
      if (!list.length || !sonReady.value) {
        return;
      }
      // 只有一首歌的情况
      if (list.length === 1) {
        loop();
      }
      let index = currentIndex.value - 1;
      //切换到头的情况
      if (index === -1) {
        index = list.length - 1;
      }
      store.commit("setCurrentIndex", index);
      //切换过去如果是暂停状态 把他变成播放状态
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
    }
    function next() {
      let list = playList.value;
      //一首歌都没有或者歌曲没准备好
      if (!list.length || !sonReady.value) {
        return;
      }
      // 只有一首歌的情况
      if (list.length === 1) {
        loop();
      }
      let index = currentIndex.value + 1;
      //切换到头的情况
      if (index === list.length) {
        index = 0;
      }
      store.commit("setCurrentIndex", index);
      //切换过去如果是暂停状态 把他变成播放状态
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
    }
    // 循环播放当前歌曲
    function loop() {
      // 拿到dom 将歌曲时间改为0 再播放
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
    }
    function ready() {
      if (sonReady.value) {
        return;
      }
      sonReady.value = true;
      playLyric();
    }
    function error() {
      sonReady.value = true;
    }
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime;
      }
    }
    function onProgressChanging(progress) {
      progressChanging = true;
      //这个是让进度条旁边的数字时间可以实时变化
      currentTime.value = currentSong.value.duration * progress;
    }
    function onProgressChanged(progress) {
      progressChanging = false;
      // 这个是让播放器跟上进度
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
    }
    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }
    return {
      fullScreen,
      currentSong,
      currentTime,
      playList,
      audioRef,
      barRef,
      playIcon,
      progress,
      disableCls,
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      end,
      modeIcon,
      changeMode,
      getFavoriteListIcon,
      toggleFavorite,
      isPlaying,
      cdRef,
      cdImageRef,
      currentLyric,
      currentLineNum,
      lyricListRef,
      lyricScrollRef,
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      updateTime,
      formatTime,
      onProgressChanged,
      onProgressChanging,
    };
  },
};
</script>

<style lang="scss" scoped>
.normal-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 150;
  background: $color-background;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .top {
    position: relative;
    width: 100%;
    margin-bottom: 25px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
    }
    .title {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      line-height: 40px;
      @include no-wrap();
      font-size: $font-size-large;
      color: $color-text;
    }
    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
    }
    .cd-wrapper {
      position: absolute;
      left: 10%;
      top: 0;
      width: 80%;
      box-sizing: border-box;
      height: 100%;
    }
    .cd {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 50%;
        border: 10px solid hsla(0, 0%, 100%, 0.1);
      }
      .playing {
        animation: rotate 20s linear infinite;
      }
    }
    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
          &.current {
            color: $color-text;
          }
        }
        .pure-music {
          padding-top: 50%;
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0 auto;
      padding: 10px 0;
      .time-l {
        text-align: left;
      }
      .time {
        color: #fff;
        font-size: 12px;
        flex: 0 0 40px;
      }
      .time-r {
        text-align: right;
      }
      .progress-bar-wrapper {
        flex: 1;
      }
    }
    .operators {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        color: $color-theme;
        &.disable {
          color: $color-theme-d;
        }
        i {
          font-size: 30px;
        }
      }
      .i-left {
        text-align: right;
      }
      .i-center {
        padding: 0 20px;
        text-align: center;
        i {
          font-size: 40px;
        }
      }
      .i-right {
        text-align: left;
      }
      .icon-favorite {
        color: $color-sub-theme;
      }
    }
  }
  &.normal-enter-active,
  &.normal-leave-active {
    transition: all 0.7s;
    .top,
    .cd-wrapper,
    .bottom {
      transition: all 0.7s cubic-bezier(0.45, 0, 0.55, 1);
    }
  }
  &.normal-enter-from,
  &.normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .cd-wrapper {
      transform: translate3d(calc(-50vw + 40px), calc(100vh - 0.4vw - 110px), 0)  scale(0.2);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
}
</style>