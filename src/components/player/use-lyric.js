import { useStore } from "vuex";
import { computed, watch, ref } from 'vue'
import { getLyric } from "../../service/song";
import Lyric from 'lyric-parser'

export default function useLyric({ sonReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const playingLyric = ref('')

  const store = useStore()
  const currentSonge = computed(() => store.getters.currentSong)
  watch(currentSonge, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 歌词获取是异步的，多次切歌后如果之前的歌词逻辑还没有执行完，可以return掉
    if (currentSonge.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    if (sonReady.value) {
      playLyric()
    }
  })
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}