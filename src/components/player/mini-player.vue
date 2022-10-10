<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            :src="currentSong.pic"
            alt=""
            ref="cdImageRef"
            :class="isPlaying"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progressCircle :progress="progress" :radius="32">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progressCircle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <playlist ref="playlistRef"></playlist>
    </div>
  </transition>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import useCd from "./use-cd.js";
import useMiniSlider from "./use-mini-slider.js";
import progressCircle from "./progress-circle";
import playlist from "./playlist.vue";
export default {
  components: {
    progressCircle,
    playlist,
  },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    togglePlay: {
      type: Function,
    },
  },
  setup() {
    const playlistRef = ref(null);

    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.playing);
    const playList = computed(() => store.state.playList);
    const miniPlayIcon = computed(() =>
      playing.value ? "icon-pause-mini" : "icon-play-mini"
    );

    const { isPlaying, cdRef, cdImageRef } = useCd();
    const { sliderWrapperRef } = useMiniSlider();

    function showNormalPlayer() {
      store.commit("setFullScreen", true);
    }
    function showPlaylist() {
      playlistRef.value.show();
    }
    return {
      playlistRef,
      fullScreen,
      currentSong,
      isPlaying,
      playList,
      cdRef,
      cdImageRef,
      sliderWrapperRef,
      showNormalPlayer,
      showPlaylist,
      miniPlayIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  align-items: center;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    padding: 0 10px 0 20px;
    height: 40px;
    .cd {
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      &.playing {
        animation: rotate 10s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 20px;
    flex: 1;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
      }
    }
    .name {
      margin-bottom: 2px;
      @include no-wrap();
      font-size: $font-size-medium;
      color: $color-text;
    }
    .desc {
      @include no-wrap();
      font-size: $font-size-small;
      color: $color-text-d;
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>