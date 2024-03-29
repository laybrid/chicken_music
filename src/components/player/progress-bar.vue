<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          :style="btnStyle"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;
export default {
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  // 自定义事件的目的就是 将进度条的progress与歌曲的progress同步
  emits: ["progress-changing", "progress-changed"],
  data() {
    return {
      offset: 0,
    };
  },
  created() {
    this.touch = {};
  },

  computed: {
    progressStyle() {
      return `width: ${this.offset}px`;
    },
    btnStyle() {
      return `transform: translate3d(${this.offset}px,0,0)`;
    },
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress);
    },
  },
  methods: {
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX;
      this.touch.beginWidth = this.$refs.progress.clientWidth;
    },
    onTouchMove(e) {
      const delta = e.touches[0].pageX - this.touch.x1;
      const tempWidth = delta + this.touch.beginWidth;
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      // 把这个比值限定到0~1之间
      const progress = Math.min(1, Math.max(0, tempWidth / barWidth));
      this.offset = progress * barWidth;
      this.$emit("progress-changing", progress);
    },
    onTouchEnd() {
      // 偏移结束了就不用继续加上偏移量了
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = this.$refs.progress.clientWidth / barWidth;
      this.$emit("progress-changed", progress);
    },
    onClick(e) {
      const rect = this.$el.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = offsetWidth / barWidth;
      this.$emit("progress-changed", progress);
    },
    setOffset(progress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      this.offset = barWidth * progress;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: #ffcd32;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>