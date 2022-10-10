<template>
  <Header></Header>
  <Tab></Tab>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :style="viewStyle" />
    </keep-alive>
  </router-view>
  <router-view v-slot="{ Component }" name="user">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" :style="viewStyle" />
      </keep-alive>
    </transition>
  </router-view>
  <Player></Player>
</template>
<script>
import Header from "../src/components/header/header.vue";
import Tab from "./components/base/tab/tab.vue";
import Player from "./components/player/player.vue";
import { mapState } from "vuex";
export default {
  components: {
    Header,
    Tab,
    Player,
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? "60px" : "0";
      return {
        bottom,
      };
    },
    ...mapState(["playList"]),
  },
};
</script>
<style lang="scss" scoped>
</style>
